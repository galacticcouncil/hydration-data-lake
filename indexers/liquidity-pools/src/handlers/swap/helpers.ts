import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AmmSupportSwappedData } from '../../parsers/batchBlocksParser/types';
import {
  ChainActivityTrace,
  ChainActivityTraceRelation,
  DcaSchedule,
  OtcOrderAction,
  OtcOrderActionKind,
  Swap,
  SwapFillerContext,
  SwapFillerType,
  SwappedExecutionTypeKind,
} from '../../model';
import { getAsset } from '../assets/assetRegistry';
import { getOrCreateStablepool } from '../pools/stablepool/stablepool';
import { getOtcOrder } from '../otc/otcOrder';
import { AmmSupportSwappedAssetAmount } from '../../parsers/types/events';
import { getOrCreateLbpPool } from '../pools/lbpPool/lbpPool';
import {
  handleLbpPoolVolumeUpdates,
  handleOmnipoolAssetVolumeUpdates,
  handleXykPoolVolumeUpdates,
} from '../volumes';
import { handleAssetVolumeUpdates } from '../assets/volume';
import { getOrCreateXykPool } from '../pools/xykPool/xykPool';
import { handleStablepoolVolumeUpdates } from '../volumes/stablepoolVolume';
import { ChainActivityTraceManager } from '../../chainActivityTraceManager';
import { getDcaScheduleExecutionAction } from '../dca/dcaScheduleExecutionAction';
import { OperationStackManager } from '../../chainActivityTraceManager/operationStackManager';

export async function getFillerContextData(
  ctx: ProcessorContext<Store>,
  eventCallData: AmmSupportSwappedData
): Promise<Partial<
  Pick<SwapFillerContext, 'shareToken' | 'otcOrder' | 'stablepool'>
> | null> {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  if (!eventParams.fillerType.value) return null;

  switch (eventParams.fillerType.kind) {
    case SwapFillerType.XYK: {
      const shareToken = await getAsset({
        id: `${eventParams.fillerType.value}`,
        ctx,
        ensure: true,
        blockHeader: eventMetadata.blockHeader,
      });

      if (!shareToken) {
        console.log(
          `Asset ${eventParams.fillerType.value} for swap filler cannot be found.`
        );
        return null;
      }
      return {
        shareToken,
      };
    }
    case SwapFillerType.Stableswap: {
      const stablepool = await getOrCreateStablepool({
        poolId: eventParams.fillerType.value,
        ctx,
        ensure: true,
        blockHeader: eventMetadata.blockHeader,
      });

      if (!stablepool) {
        console.log(
          `Stablepool ${eventParams.fillerType.value} cannot be found.`
        );
        return null;
      }
      return {
        stablepool,
      };
    }
    case SwapFillerType.OTC: {
      const otcOrder = await getOtcOrder({
        id: eventParams.fillerType.value,
        ctx,
      });

      if (!otcOrder) {
        console.log(
          `OTC order ${eventParams.fillerType.value} cannot be found.`
        );
        return null;
      }
      return {
        otcOrder,
      };
    }
  }
  return null;
}

export function getOmnipoolHubAmountOnSwap({
  fillerType,
  swapInputs,
  swapOutputs,
  ctx,
}: {
  fillerType: SwapFillerType;
  swapInputs: AmmSupportSwappedAssetAmount[];
  swapOutputs: AmmSupportSwappedAssetAmount[];
  ctx: ProcessorContext<Store>;
}): {
  hubAmountIn: bigint | undefined;
  hubAmountOut: bigint | undefined;
} {
  const result: {
    hubAmountIn: bigint | undefined;
    hubAmountOut: bigint | undefined;
  } = {
    hubAmountIn: undefined,
    hubAmountOut: undefined,
  };

  if (fillerType !== SwapFillerType.Omnipool) return result;
  const hubAssetSwapDetails: {
    amount: bigint;
    position: 'input' | 'output' | 'none';
  } = {
    amount: 0n,
    position: 'none',
  };

  for (const input of swapInputs) {
    if (input.assetId !== +ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID) continue;
    hubAssetSwapDetails.amount = input.amount;
    hubAssetSwapDetails.position = 'input';
  }
  for (const output of swapOutputs) {
    if (output.assetId !== +ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID) continue;
    hubAssetSwapDetails.amount = output.amount;
    hubAssetSwapDetails.position = 'output';
  }

  switch (hubAssetSwapDetails.position) {
    case 'output':
      result.hubAmountIn = hubAssetSwapDetails.amount;
      break;
    case 'input':
      result.hubAmountOut = hubAssetSwapDetails.amount;
      break;
  }

  return result;
}

export async function supportSwapperEventPreHook(
  ctx: ProcessorContext<Store>,
  eventCallData: AmmSupportSwappedData
) {
  const {
    eventData: { params: eventParams },
  } = eventCallData;

  switch (eventParams.fillerType.kind) {
    case SwapFillerType.LBP: {
      break;
    }
    case SwapFillerType.XYK: {
      break;
    }
    case SwapFillerType.Stableswap: {
      break;
    }
  }
}

export async function supportSwappedEventPostHook({
  swap,
  ctx,
  eventCallData,
  chainActivityTrace,
}: {
  swap: Swap;
  ctx: ProcessorContext<Store>;
  eventCallData: AmmSupportSwappedData;
  chainActivityTrace?: ChainActivityTrace | null;
}) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  switch (eventParams.fillerType.kind) {
    case SwapFillerType.LBP: {
      const pool = await getOrCreateLbpPool({
        ctx,
        assetIds: [
          eventParams.inputs[0].assetId,
          eventParams.outputs[0].assetId,
        ],
        ensure: true,
        blockHeader: eventCallData.eventData.metadata.blockHeader,
      });

      if (!pool) {
        console.log(
          `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
        );
        return;
      }
      ctx.batchState.state.lbpAllBatchPools.set(pool.id, pool);

      await handleLbpPoolVolumeUpdates({
        ctx,
        swap,
        pool,
      });

      await handleAssetVolumeUpdates(ctx, {
        paraChainBlockHeight: swap.paraChainBlockHeight,
        relayChainBlockHeight: swap.relayChainBlockHeight,
        assetIn: swap.inputs[0].asset,
        assetInAmount: swap.inputs[0].amount,
        assetOut: swap.outputs[0].asset,
        assetOutAmount: swap.outputs[0].amount,
      });
      break;
    }
    case SwapFillerType.XYK: {
      const pool = await getOrCreateXykPool({
        ctx,
        id: eventParams.filler,
        ensure: true,
        blockHeader: eventCallData.eventData.metadata.blockHeader,
      });

      if (!pool) {
        console.log(
          `No XYK pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
        );
        return;
      }
      ctx.batchState.state.xykAllBatchPools.set(pool.id, pool);

      await handleXykPoolVolumeUpdates({
        ctx,
        swap,
        pool,
      });

      await handleAssetVolumeUpdates(ctx, {
        paraChainBlockHeight: swap.paraChainBlockHeight,
        relayChainBlockHeight: swap.relayChainBlockHeight,
        assetIn: swap.inputs[0].asset,
        assetInAmount: swap.inputs[0].amount,
        assetOut: swap.outputs[0].asset,
        assetOutAmount: swap.outputs[0].amount,
      });

      break;
    }
    case SwapFillerType.Omnipool:
      await handleOmnipoolAssetVolumeUpdates({
        ctx,
        swap,
        blockHeader: eventMetadata.blockHeader,
      });
      break;
    case SwapFillerType.Stableswap: {
      const pool = await getOrCreateStablepool({
        ctx,
        poolId: +eventParams.fillerType.value,
        ensure: true,
        blockHeader: eventMetadata.blockHeader,
      });

      if (!pool) {
        console.log(
          `Stablepool with ID ${eventParams.filler} has not been found`
        );
        return;
      }
      ctx.batchState.state.stablepoolAllBatchPools.set(pool.id, pool);

      await handleStablepoolVolumeUpdates({
        ctx,
        swap,
        pool,
      });
      break;
    }
    case SwapFillerType.OTC: {
      if (
        !chainActivityTrace ||
        !swap.fillerContext ||
        !swap.fillerContext.otcOrder
      )
        return;

      const createOrderAction = await ctx.store.findOne(OtcOrderAction, {
        where: {
          kind: OtcOrderActionKind.CREATED,
          order: { id: swap.fillerContext!.otcOrder!.id },
        },
      });

      if (!createOrderAction || !createOrderAction.traceIds) return;

      const rootChainActivityTrace =
        await ChainActivityTraceManager.getChainActivityTraceByTraceIdsBatch({
          ids: createOrderAction.traceIds,
          ctx,
        });

      if (
        !rootChainActivityTrace ||
        rootChainActivityTrace.id === chainActivityTrace.id
      )
        return;

      const newChainActivityTraceRelation = new ChainActivityTraceRelation({
        id: `${chainActivityTrace.id}-${rootChainActivityTrace.id}`,
        childTrace: chainActivityTrace,
        parentTrace: rootChainActivityTrace,
        createdAtParaChainBlockHeight:
          eventCallData.eventData.metadata.blockHeader.height,
      });

      // chainActivityTrace.childTraces = [...(chainActivityTrace.childTraces || []), newChainActivityTraceRelation];
      // rootChainActivityTrace.childTraces = [...(chainActivityTrace.childTraces || []), newChainActivityTraceRelation];

      ctx.batchState.state.chainActivityTraceRelations.set(
        newChainActivityTraceRelation.id,
        newChainActivityTraceRelation
      );
      break;
    }
  }
}
