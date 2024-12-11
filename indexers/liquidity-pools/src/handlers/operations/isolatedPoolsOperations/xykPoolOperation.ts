import { SwapFillerType, TradeOperationType } from '../../../model';
import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  XykBuyExecutedData,
  XykSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { handleXykPoolVolumeUpdates } from '../../volumes';
import { handleAssetVolumeUpdates } from '../../assets/volume';
import { getXykPool } from '../../isolatedPool/xykPool';
import { handleSellBuyAsSwap } from '../../swap/swap';

export async function xykBuyExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: XykBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = await getXykPool({
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

  const { swap, swapInputs, swapOutputs } = await handleSellBuyAsSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      eventId: eventMetadata.id,
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.who,
      poolAccountId: pool.id,
      poolType: SwapFillerType.XYK,
      assetInId: `${eventParams.assetIn}`,
      assetOutId: `${eventParams.assetOut}`,
      amountIn: eventParams.buyPrice,
      amountOut: eventParams.amount,
      fees: [
        {
          amount: eventParams.feeAmount,
          assetId: `${eventParams.feeAsset}`,
          recipientId: pool.account.id,
        },
      ],
      operationType: TradeOperationType.ExactOut,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleXykPoolVolumeUpdates({
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

export async function xykSellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: XykSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = await getXykPool({
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

  const { swap, swapInputs, swapOutputs } = await handleSellBuyAsSwap({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      eventId: eventMetadata.id,
      extrinsicHash: eventMetadata.extrinsic?.hash || '',
      eventIndex: eventMetadata.indexInBlock,
      swapperAccountId: eventParams.who,
      poolAccountId: pool.id,
      poolType: SwapFillerType.XYK,
      assetInId: `${eventParams.assetIn}`,
      assetOutId: `${eventParams.assetOut}`,
      amountIn: eventParams.amount,
      amountOut: eventParams.salePrice,
      fees: [
        {
          amount: eventParams.feeAmount,
          assetId: `${eventParams.feeAsset}`,
          recipientId: pool.account.id,
        },
      ],
      operationType: TradeOperationType.ExactIn,
      relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
      paraChainBlockHeight: eventMetadata.blockHeader.height,
      timestamp: eventMetadata.blockHeader.timestamp ?? Date.now(),
    },
  });

  await handleXykPoolVolumeUpdates({
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
