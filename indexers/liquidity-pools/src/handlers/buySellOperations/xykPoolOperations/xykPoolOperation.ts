import {
  SwapFeeDestinationType,
  SwapFillerType,
  TradeOperationType,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  XykBuyExecutedData,
  XykSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { handleXykPoolVolumeUpdates } from '../../volumes';
import { handleAssetVolumeUpdates } from '../../assets/volume';
import { handleSwap } from '../../swap/swap';
import { getOrCreateXykPool } from '../../pools/xykPool/xykPool';

export async function xykBuyExecuted(
  ctx: SqdProcessorContext<Store>,
  eventCallData: XykBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const pool = await getOrCreateXykPool({
    ctx,
    id: eventParams.pool,
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
      fillerType: SwapFillerType.XYK,
      inputs: [{ assetId: eventParams.assetIn, amount: eventParams.buyPrice }],
      outputs: [{ assetId: eventParams.assetOut, amount: eventParams.amount }],
      fees: [
        {
          amount: eventParams.feeAmount,
          assetId: eventParams.feeAsset,
          destinationType: SwapFeeDestinationType.Account,
          recipientId: pool.id,
        },
      ],
      operationType: TradeOperationType.ExactOut,
      paraBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleXykPoolVolumeUpdates({
    ctx,
    swap,
    pool,
  });

  await handleAssetVolumeUpdates(ctx, {
    paraBlockHeight: swap.paraBlockHeight,
    relayBlockHeight: swap.relayBlockHeight,
    assetIn: swapInputs[0].asset,
    assetInAmount: swapInputs[0].amount,
    assetOut: swapOutputs[0].asset,
    assetOutAmount: swapOutputs[0].amount,
  });
}

export async function xykSellExecuted(
  ctx: SqdProcessorContext<Store>,
  eventCallData: XykSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const pool = await getOrCreateXykPool({
    ctx,
    id: eventParams.pool,
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
      fillerType: SwapFillerType.XYK,
      inputs: [{ assetId: eventParams.assetIn, amount: eventParams.amount }],
      outputs: [
        { assetId: eventParams.assetOut, amount: eventParams.salePrice },
      ],
      fees: [
        {
          amount: eventParams.feeAmount,
          assetId: eventParams.feeAsset,
          destinationType: SwapFeeDestinationType.Account,
          recipientId: pool.id,
        },
      ],
      operationType: TradeOperationType.ExactIn,
      paraBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleXykPoolVolumeUpdates({
    ctx,
    swap,
    pool,
  });

  await handleAssetVolumeUpdates(ctx, {
    paraBlockHeight: swap.paraBlockHeight,
    relayBlockHeight: swap.relayBlockHeight,
    assetIn: swapInputs[0].asset,
    assetInAmount: swapInputs[0].amount,
    assetOut: swapOutputs[0].asset,
    assetOutAmount: swapOutputs[0].amount,
  });
}
