import { Store } from '@subsquid/typeorm-store';

import {
  Account,
  Block,
  ChainActivityTrace,
  Swap,
  SwapFillerType,
} from '../../model';
import { BroadcastSwappedData } from '../../parsers/batchBlocksParser/types';
import { SqdProcessorContext } from '../../processor';
import { SwapFillerContextDetails } from '../../utils/types';
import { handleAccountAssetSwapFee } from '../accounts/historicalAccountSwapFee';
import { handleAssetSwapFee } from '../assets/historicalAssetSwapFee';
import { handleAssetVolumeUpdates } from '../assets/volume';
import { handleHsmAssetHistoricalData } from '../pools/pools/hsmpool/hsmpoolAssetHistData';
import { getOrCreateLbppool } from '../pools/pools/lbpPool/lbpPool';
import { getOrCreateStableswap } from '../pools/pools/stableswap/stablepool';
import { getOrCreateXykPool } from '../pools/pools/xykPool/xykPool';
import {
  handleLbppoolVolumeUpdates,
  handleOmnipoolAssetVolumeUpdates,
  handleXykPoolVolumeUpdates,
} from '../pools/volumes';
import { handleStablepoolVolumeUpdates } from '../pools/volumes/stablepoolVolume';
import {
  getProcessingMode,
  ProcessingMode,
} from '../../processorHelpers/getProcessingMode';

export async function getFillerContextData(
  ctx: SqdProcessorContext<Store>,
  eventCallData: BroadcastSwappedData
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

export async function broadcastSwappedEventPreHook(
  eventCallData: BroadcastSwappedData
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

export async function broadcastSwappedEventPostHook({
  swap,
  ctx,
  eventCallData,
  chainActivityTrace,
  forceExec = false,
}: {
  swap: Swap;
  ctx: SqdProcessorContext<Store>;
  eventCallData: BroadcastSwappedData;
  chainActivityTrace?: ChainActivityTrace | null;
  forceExec?: boolean;
}) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  if (
    !forceExec &&
    getProcessingMode(ctx) === ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR
  ) {
    return;
  }

  switch (eventParams.fillerType.kind) {
    case SwapFillerType.LBP: {
      const pool = await getOrCreateLbppool({
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

      await handleLbppoolVolumeUpdates({
        ctx,
        swap,
        pool,
      });

      await handleAssetVolumeUpdates(ctx, {
        paraBlockHeight: swap.paraBlockHeight,
        assetInId: swap.inputs[0].assetId,
        assetInAmount: swap.inputs[0].amount,
        assetOutId: swap.outputs[0].assetId,
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
        paraBlockHeight: swap.paraBlockHeight,
        assetInId: swap.inputs[0].assetId,
        assetInAmount: swap.inputs[0].amount,
        assetOutId: swap.outputs[0].assetId,
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
      await handleAssetVolumeUpdates(ctx, {
        paraBlockHeight: swap.paraBlockHeight,
        assetInId: swap.inputs[0].assetId,
        assetInAmount: swap.inputs[0].amount,
        assetOutId: swap.outputs[0].assetId,
        assetOutAmount: swap.outputs[0].amount,
      });
      break;
    case SwapFillerType.Stableswap: {
      const pool = await getOrCreateStableswap({
        ctx,
        poolId: +eventParams.fillerType.value,
        ensure: true,
        blockHeader: eventMetadata.blockHeader,
      });

      if (!pool) {
        console.log(
          `Stableswap with ID ${eventParams.filler} has not been found`
        );
        return;
      }
      ctx.batchState.state.stableswapPools.set(pool.id, pool);

      await handleStablepoolVolumeUpdates({
        ctx,
        swap,
        pool,
      });

      await handleAssetVolumeUpdates(ctx, {
        paraBlockHeight: swap.paraBlockHeight,
        assetInId: swap.inputs[0].assetId,
        assetInAmount: swap.inputs[0].amount,
        assetOutId: swap.outputs[0].assetId,
        assetOutAmount: swap.outputs[0].amount,
      });

      break;
    }
    case SwapFillerType.HSM: {
      // await handleHsmAssetHistoricalData({
      //   ctx,
      //   swap,
      //   blockHeader: eventCallData.eventData.metadata.blockHeader,
      // });

      await handleAssetVolumeUpdates(ctx, {
        paraBlockHeight: swap.paraBlockHeight,
        assetInId: swap.inputs[0].assetId,
        assetInAmount: swap.inputs[0].amount,
        assetOutId: swap.outputs[0].assetId,
        assetOutAmount: swap.outputs[0].amount,
      });

      break;
    }
    case SwapFillerType.AAVE: {
      await handleAssetVolumeUpdates(ctx, {
        paraBlockHeight: swap.paraBlockHeight,
        assetInId: swap.inputs[0].assetId,
        assetInAmount: swap.inputs[0].amount,
        assetOutId: swap.outputs[0].assetId,
        assetOutAmount: swap.outputs[0].amount,
      });

      break;
    }
  }
}
export async function handleSwapFeeHistoricalData({
  ctx,
  feeAmount,
  assetId,
  account,
  block,
}: {
  ctx: SqdProcessorContext<Store>;
  block: Block;
  account: Account;
  assetId: string;
  feeAmount: bigint;
}) {
  await handleAccountAssetSwapFee({
    ctx,
    feeAmount,
    assetId,
    account,
    block,
  });

  await handleAssetSwapFee({
    ctx,
    feeAmount,
    assetId,
    block,
  });
}
