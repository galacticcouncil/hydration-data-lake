import { Store } from '@subsquid/typeorm-store';

import {
  SwapFeeDestinationType,
  SwapFillerType,
  TradeOperationType,
} from '../../../model';
import {
  LbpBuyExecutedData,
  LbpSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { SqdProcessorContext } from '../../../processor';
import { handleAssetVolumeUpdates } from '../../assets/volume';
import { getOrCreateLbppool } from '../../pools/pools/lbpPool/lbpPool';
import { handleLbppoolVolumeUpdates } from '../../pools/volumes';
import { handleSwap } from '../../swap/swap';

export async function lpbBuyExecuted(
  ctx: SqdProcessorContext<Store>,
  eventCallData: LbpBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const pool = await getOrCreateLbppool({
    ctx,
    assetIds: [eventParams.assetIn, eventParams.assetOut],
    ensure: true,
    blockHeader: eventCallData.eventData.metadata.blockHeader,
  });

  if (!pool) {
    console.log(
      `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
    );
    return;
  }

  const { swap, swapInputs, swapOutputs } = await handleSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      traceIds: [
        ...(callData.traceId ? [callData.traceId] : []),
        eventMetadata.traceId,
      ],
      eventId: eventMetadata.id,
      swapperAccountId: eventParams.who,
      fillerAccountId: pool.id,
      fillerType: SwapFillerType.LBP,
      inputs: [
        {
          amount: eventParams.buyPrice,
          assetId: eventParams.assetIn,
        },
      ],
      outputs: [
        {
          amount: eventParams.amount,
          assetId: eventParams.assetOut,
        },
      ],
      fees: [
        {
          amount: eventParams.feeAmount,
          assetId: eventParams.feeAsset,
          destinationType: SwapFeeDestinationType.Account,
          recipientId: pool.accountId,
        },
      ],
      operationType: TradeOperationType.ExactOut,
      paraBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleLbppoolVolumeUpdates({
    ctx,
    swap,
    pool,
  });

  await handleAssetVolumeUpdates(ctx, {
    paraBlockHeight: swap.paraBlockHeight,
    assetInId: swapInputs[0].assetId,
    assetInAmount: swapInputs[0].amount,
    assetOutId: swapOutputs[0].assetId,
    assetOutAmount: swapOutputs[0].amount,
  });
}

export async function lpbSellExecuted(
  ctx: SqdProcessorContext<Store>,
  eventCallData: LbpSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const pool = await getOrCreateLbppool({
    ctx,
    assetIds: [eventParams.assetIn, eventParams.assetOut],
    ensure: true,
    blockHeader: eventCallData.eventData.metadata.blockHeader,
  });

  if (!pool) {
    console.log(
      `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
    );
    return;
  }

  const { swap, swapInputs, swapOutputs } = await handleSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      traceIds: [
        ...(callData.traceId ? [callData.traceId] : []),
        eventMetadata.traceId,
      ],
      eventId: eventMetadata.id,
      swapperAccountId: eventParams.who,
      fillerAccountId: pool.id,
      fillerType: SwapFillerType.LBP,
      inputs: [
        {
          amount: eventParams.amount,
          assetId: eventParams.assetIn,
        },
      ],
      outputs: [
        {
          amount: eventParams.salePrice,
          assetId: eventParams.assetOut,
        },
      ],
      fees: [
        {
          amount: eventParams.feeAmount,
          assetId: eventParams.feeAsset,
          destinationType: SwapFeeDestinationType.Account,
          recipientId: pool.accountId,
        },
      ],
      operationType: TradeOperationType.ExactIn,
      paraBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleLbppoolVolumeUpdates({
    ctx,
    swap,
    pool,
  });

  await handleAssetVolumeUpdates(ctx, {
    paraBlockHeight: swap.paraBlockHeight,
    assetInId: swapInputs[0].assetId,
    assetInAmount: swapInputs[0].amount,
    assetOutId: swapOutputs[0].assetId,
    assetOutAmount: swapOutputs[0].amount,
  });
}
