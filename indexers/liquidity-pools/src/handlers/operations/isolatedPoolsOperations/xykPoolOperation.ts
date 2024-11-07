import { PoolOperationType } from '../../../model';
import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  XykBuyExecutedData,
  XykSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { getAccount } from '../../accounts';
import { handleXykPoolVolumeUpdates } from '../../volumes';
import { handleAssetVolumeUpdates } from '../../assets/volume';
import { initXykPoolOperation } from './common';
import { getAsset } from '../../assets/assetRegistry';

export async function xykBuyExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: XykBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.xykAllBatchPools.values()].find(
    (p) => p.id === eventParams.pool
  );

  if (!pool) {
    console.log(
      `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
    );
    return;
  }

  const assetInEntity = await getAsset({
    ctx,
    id: eventParams.assetIn,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  const assetOutEntity = await getAsset({
    ctx,
    id: eventParams.assetOut,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  const assetFeeEntity = await getAsset({
    ctx,
    id: eventParams.feeAsset,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!assetInEntity || !assetOutEntity || !assetFeeEntity) return;

  const operationInstance = initXykPoolOperation({
    eventId: eventMetadata.id,
    hash: eventMetadata.extrinsic?.hash || '',
    indexInBlock: eventMetadata.indexInBlock,
    account: await getAccount(ctx, eventParams.who),
    assetIn: assetInEntity,
    assetOut: assetOutEntity,
    amountIn: eventParams.buyPrice,
    amountOut: eventParams.amount,
    feeAsset: assetFeeEntity,
    feeAmount: eventParams.feeAmount,
    operationType: PoolOperationType.BUY,
    pool,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state = {
    xykPoolOperations: [
      ...ctx.batchState.state.xykPoolOperations,
      operationInstance,
    ],
  };

  await handleXykPoolVolumeUpdates({ ctx, poolOperation: operationInstance });

  await handleAssetVolumeUpdates(ctx, operationInstance);
}

export async function xykSellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: XykSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.xykAllBatchPools.values()].find(
    (p) => p.id === eventParams.pool
  );

  if (!pool) {
    console.log(
      `No pool found for event: ${eventMetadata.name} ${eventMetadata.id}`
    );
    return;
  }

  const assetInEntity = await getAsset({
    ctx,
    id: eventParams.assetIn,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  const assetOutEntity = await getAsset({
    ctx,
    id: eventParams.assetOut,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  const assetFeeEntity = await getAsset({
    ctx,
    id: eventParams.feeAsset,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!assetInEntity || !assetOutEntity || !assetFeeEntity) return;

  const operationInstance = initXykPoolOperation({
    eventId: eventMetadata.id,
    hash: eventMetadata.extrinsic?.hash || '',
    indexInBlock: eventMetadata.indexInBlock,
    account: await getAccount(ctx, eventParams.who),
    assetIn: assetInEntity,
    assetOut: assetOutEntity,
    amountIn: eventParams.amount,
    amountOut: eventParams.salePrice,
    feeAsset: assetFeeEntity,
    feeAmount: eventParams.feeAmount,
    operationType: PoolOperationType.SELL,
    pool,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state = {
    xykPoolOperations: [
      ...ctx.batchState.state.xykPoolOperations,
      operationInstance,
    ],
  };

  await handleXykPoolVolumeUpdates({ ctx, poolOperation: operationInstance });

  await handleAssetVolumeUpdates(ctx, operationInstance);
}
