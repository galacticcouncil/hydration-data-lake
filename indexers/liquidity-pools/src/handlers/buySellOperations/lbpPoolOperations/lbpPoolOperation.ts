import { SwapFillerType, TradeOperationType } from '../../../model';
import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  LbpBuyExecutedData,
  LbpSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { handleLbpPoolVolumeUpdates } from '../../volumes';
import { handleAssetVolumeUpdates } from '../../assets/volume';
import { handleSwap } from '../../swap/swap';
import { getOrCreateLbpPool } from '../../pools/lbpPool/lbpPool';

export async function lpbBuyExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const pool = await getOrCreateLbpPool({
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
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.who,
      fillerAccountId: pool.id,
      swapFillerType: SwapFillerType.LBP,
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
          recipientId: pool.account.id,
        },
      ],
      operationType: TradeOperationType.ExactOut,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleLbpPoolVolumeUpdates({
    ctx,
    swap,
    pool,
  });

  await handleAssetVolumeUpdates(ctx, {
    paraChainBlockHeight: swap.paraChainBlockHeight,
    relayChainBlockHeight: swap.relayChainBlockHeight,
    assetIn: swapInputs[0].asset,
    assetInAmount: swapInputs[0].amount,
    assetOut: swapOutputs[0].asset,
    assetOutAmount: swapOutputs[0].amount,
  });
}

export async function lpbSellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const pool = await getOrCreateLbpPool({
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
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.who,
      fillerAccountId: pool.id,
      swapFillerType: SwapFillerType.LBP,
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
          recipientId: pool.account.id,
        },
      ],
      operationType: TradeOperationType.ExactIn,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleLbpPoolVolumeUpdates({
    ctx,
    swap,
    pool,
  });

  await handleAssetVolumeUpdates(ctx, {
    paraChainBlockHeight: swap.paraChainBlockHeight,
    relayChainBlockHeight: swap.relayChainBlockHeight,
    assetIn: swapInputs[0].asset,
    assetInAmount: swapInputs[0].amount,
    assetOut: swapOutputs[0].asset,
    assetOutAmount: swapOutputs[0].amount,
  });
}
