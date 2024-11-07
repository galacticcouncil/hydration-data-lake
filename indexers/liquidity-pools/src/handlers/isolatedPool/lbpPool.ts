import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { LbpPool } from '../../model';
import { getAccount } from '../accounts';
import {
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
} from '../../parsers/batchBlocksParser/types';
import { getAssetFreeBalance } from '../assets/balances';
import { getAsset } from '../assets/assetRegistry';

export async function getLbpPoolByAssets({
  ctx,
  assetIds,
  ensure = false,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  assetIds: number[] | string[];
  ensure?: boolean;
  blockHeader?: Block;
}): Promise<LbpPool | null> {
  const batchState = ctx.batchState.state;

  let pool = [...batchState.lbpAllBatchPools.values()].find(
    (p) =>
      (p.assetA.id === `${assetIds[0]}` && p.assetB.id === `${assetIds[1]}`) ||
      (p.assetB.id === `${assetIds[0]}` && p.assetA.id === `${assetIds[1]}`)
  );
  if (pool) return pool;

  pool = await ctx.store.findOne(LbpPool, {
    where: [
      { assetA: { id: `${assetIds[0]}` }, assetB: { id: `${assetIds[1]}` } },
      { assetB: { id: `${assetIds[0]}` }, assetA: { id: `${assetIds[1]}` } },
    ],
    relations: {
      assetA: true,
      assetB: true,
      account: true,
    },
  });

  return pool ?? null;

  // TODO implement automatic creation of XykPool based on storage data if ensure === true
}

export async function lpbPoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpPoolCreatedData
) {
  //TODO add check for existing pool with the same ID

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const assetAEntity = await getAsset({
    ctx,
    id: eventParams.data.assets[0],
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });
  const assetBEntity = await getAsset({
    ctx,
    id: eventParams.data.assets[1],
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!assetAEntity || !assetBEntity) return null;

  const newPoolsAssetBalances: {
    assetABalance: bigint | undefined;
    assetBBalance: bigint | undefined;
  } = {
    assetABalance: eventCallData.callData?.args?.assetAAmount,
    assetBBalance: eventCallData.callData?.args?.assetBAmount,
  };

  if (
    !newPoolsAssetBalances.assetABalance &&
    !newPoolsAssetBalances.assetBBalance
  ) {
    newPoolsAssetBalances.assetABalance = await getAssetFreeBalance(
      eventMetadata.blockHeader,
      eventParams.data.assets[0],
      eventParams.pool
    );
    newPoolsAssetBalances.assetBBalance = await getAssetFreeBalance(
      eventMetadata.blockHeader,
      eventParams.data.assets[1],
      eventParams.pool
    );
  }

  const newPool = new LbpPool({
    id: eventParams.pool,
    account: await getAccount(ctx, eventParams.pool),
    assetA: assetAEntity,
    assetB: assetBEntity,
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    createdAt: new Date(eventMetadata.blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: eventMetadata.blockHeader.height,
    owner: await getAccount(ctx, eventParams.data.owner),
    startBlockNumber: eventParams.data.start,
    endBlockNumber: eventParams.data.end,
    feeCollector: await getAccount(ctx, eventParams.data.feeCollector),
    fee: eventParams.data.fee,
    initialWeight: eventParams.data.initialWeight,
    finalWeight: eventParams.data.finalWeight,
    isDestroyed: false,
  });

  const poolsToSave = ctx.batchState.state.lbpPoolIdsToSave;
  poolsToSave.add(newPool.id);
  ctx.batchState.state = { lbpPoolIdsToSave: poolsToSave };

  const lbpAllBatchPools = ctx.batchState.state.lbpAllBatchPools;
  lbpAllBatchPools.set(newPool.id, newPool);
  ctx.batchState.state = {
    lbpAllBatchPools,
  };
}

export async function lpbPoolUpdated(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpPoolUpdatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const allPools = ctx.batchState.state.lbpAllBatchPools;

  const existingPoolData = allPools.get(eventParams.pool);

  if (!existingPoolData) return;

  existingPoolData.owner = await getAccount(ctx, eventParams.data.owner);
  existingPoolData.feeCollector = await getAccount(
    ctx,
    eventParams.data.feeCollector
  );
  existingPoolData.initialWeight = eventParams.data.initialWeight;
  existingPoolData.finalWeight = eventParams.data.finalWeight;
  existingPoolData.repayTarget = eventParams.data.repayTarget;
  existingPoolData.startBlockNumber = eventParams.data.start;
  existingPoolData.endBlockNumber = eventParams.data.end;

  const poolsToSave = ctx.batchState.state.lbpPoolIdsToSave;
  poolsToSave.add(existingPoolData.id);
  ctx.batchState.state = { lbpPoolIdsToSave: poolsToSave };

  allPools.set(eventParams.pool, existingPoolData);
  ctx.batchState.state = { lbpAllBatchPools: allPools };
}
