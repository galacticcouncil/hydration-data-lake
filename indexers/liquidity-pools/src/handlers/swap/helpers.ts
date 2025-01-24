import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AmmSupportSwappedData } from '../../parsers/batchBlocksParser/types';
import {
  ChainActivityTrace,
  ChainActivityTraceRelation,
  OtcOrderAction,
  OtcOrderActionType,
  Swap,
  SwapFillerType,
} from '../../model';
import { getOrCreateStablepool } from '../pools/stablepool/stablepool';
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
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { SwapFillerContextDetails } from '../../utils/types';

export async function getFillerContextData(
  ctx: ProcessorContext<Store>,
  eventCallData: AmmSupportSwappedData
): Promise<SwapFillerContextDetails | null> {
  const {
    eventData: { params: eventParams },
  } = eventCallData;

  if (!eventParams.fillerType.value) return null;

  switch (eventParams.fillerType.kind) {
    case SwapFillerType.XYK: {
      return {
        xykSharedTokenId: `${eventParams.fillerType.value}`,
      };
    }
    case SwapFillerType.Stableswap: {
      return {
        stablepoolId: `${eventParams.fillerType.value}`,
      };
    }
    case SwapFillerType.OTC: {
      return {
        otcOrderId: `${eventParams.fillerType.value}`,
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
        !ctx.batchState.state.swapFillerContexts.has(swap.id) ||
        !ctx.batchState.state.swapFillerContexts.get(swap.id)?.otcOrderId
      )
        return;

      const createOrderAction = await ctx.store.findOne(OtcOrderAction, {
        where: {
          kind: OtcOrderActionType.CREATED,
          order: {
            id: ctx.batchState.state.swapFillerContexts.get(swap.id)!
              .otcOrderId,
          },
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
        !chainActivityTrace ||
        rootChainActivityTrace.id === chainActivityTrace.id
      )
        return;

      const newChainActivityTraceRelation = new ChainActivityTraceRelation({
        id: `${rootChainActivityTrace.id}-${chainActivityTrace.id}`,
        childTrace: chainActivityTrace,
        parentTrace: rootChainActivityTrace,
        createdAtParaChainBlockHeight:
          eventCallData.eventData.metadata.blockHeader.height,
      });

      ctx.batchState.state.chainActivityTraceRelations.set(
        newChainActivityTraceRelation.id,
        newChainActivityTraceRelation
      );
      break;
    }
  }
}
