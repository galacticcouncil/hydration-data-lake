import { PoolOperationType } from '../../../model';
import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  LbpBuyExecutedData,
  LbpSellExecutedData,
} from '../../../parsers/batchBlocksParser/types';
import { getAccount } from '../../accounts';
import { handleLbpPoolVolumeUpdates } from '../../volumes';
import { handleAssetVolumeUpdates } from '../../assets/volume';
import { initLbpPoolOperation } from './common';
import { getAsset } from '../../assets/assetRegistry';

export async function lpbBuyExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpBuyExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.lbpAllBatchPools.values()].find(
    (p) =>
      (p.assetA.id == `${eventParams.assetIn}` &&
        p.assetB.id == `${eventParams.assetOut}`) ||
      (p.assetB.id == `${eventParams.assetIn}` &&
        p.assetA.id == `${eventParams.assetOut}`)
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

  const operationInstance = initLbpPoolOperation({
    eventId: eventMetadata.id,
    hash: eventMetadata.extrinsic?.hash || '',
    indexInBlock: eventMetadata.indexInBlock,
    account: await getAccount(ctx, eventParams.who),
    assetIn: assetInEntity,
    assetOut: assetOutEntity,
    amountIn: eventParams.amount,
    amountOut: eventParams.buyPrice,
    feeAsset: assetFeeEntity,
    feeAmount: eventParams.feeAmount,
    operationType: PoolOperationType.BUY,
    pool,
    relayChainBlockHeight: eventCallData.relayChainInfo.relaychainBlockNumber,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state = {
    lbpPoolOperations: [
      ...ctx.batchState.state.lbpPoolOperations,
      operationInstance,
    ],
  };

  await handleLbpPoolVolumeUpdates({ ctx, poolOperation: operationInstance });

  await handleAssetVolumeUpdates(ctx, operationInstance);
}

export async function lpbSellExecuted(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpSellExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = [...ctx.batchState.state.lbpAllBatchPools.values()].find(
    (p) =>
      (p.assetA.id == `${eventParams.assetIn}` &&
        p.assetB.id == `${eventParams.assetOut}`) ||
      (p.assetB.id == `${eventParams.assetIn}` &&
        p.assetA.id == `${eventParams.assetOut}`)
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

  const operationInstance = initLbpPoolOperation({
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
    lbpPoolOperations: [
      ...ctx.batchState.state.lbpPoolOperations,
      operationInstance,
    ],
  };

  await handleLbpPoolVolumeUpdates({ ctx, poolOperation: operationInstance });

  await handleAssetVolumeUpdates(ctx, operationInstance);
}
