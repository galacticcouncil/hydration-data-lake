import { Block, ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { LbpPool } from '../../../model';
import { getAccount } from '../../accounts';
import {
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
} from '../../../parsers/batchBlocksParser/types';
import { getAssetFreeBalance } from '../../assets/balances';
import { getAsset } from '../../assets/assetRegistry';
import parsers from '../../../parsers';
import { ProcessorStatusManager } from '../../../utils/processorStatusManager';

export async function createLbpPool({
  ctx,
  blockHeader,
  poolData: {
    assetAId,
    assetBId,
    assetABalance,
    assetBBalance,
    poolAddress,
    ownerAddress,
    startBlockNumber,
    endBlockNumber,
    feeCollectorAddress,
    fee,
    initialWeight,
    finalWeight,
  },
}: {
  ctx: ProcessorContext<Store>;
  blockHeader: Block;
  poolData: {
    assetAId: string | number;
    assetBId: string | number;
    assetABalance?: bigint;
    assetBBalance?: bigint;
    poolAddress: string;
    ownerAddress: string;
    startBlockNumber?: number;
    endBlockNumber?: number;
    feeCollectorAddress: string;
    fee: number[];
    initialWeight: number;
    finalWeight: number;
  };
}) {
  const assetAEntity = await getAsset({
    ctx,
    id: assetAId,
    ensure: true,
    blockHeader: blockHeader,
  });
  const assetBEntity = await getAsset({
    ctx,
    id: assetBId,
    ensure: true,
    blockHeader: blockHeader,
  });

  if (!assetAEntity || !assetBEntity) return null;
  const newPoolsAssetBalances: {
    assetABalance: bigint | undefined;
    assetBBalance: bigint | undefined;
  } = {
    assetABalance,
    assetBBalance,
  };

  if (
    !newPoolsAssetBalances.assetABalance &&
    !newPoolsAssetBalances.assetBBalance
  ) {
    newPoolsAssetBalances.assetABalance = await getAssetFreeBalance(
      blockHeader,
      +assetAId,
      poolAddress
    );
    newPoolsAssetBalances.assetBBalance = await getAssetFreeBalance(
      blockHeader,
      +assetBId,
      poolAddress
    );
  }

  const newPool = new LbpPool({
    id: poolAddress,
    account: await getAccount(ctx, poolAddress),
    assetA: assetAEntity,
    assetB: assetBEntity,
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    createdAt: new Date(blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: blockHeader.height,
    owner: await getAccount(ctx, ownerAddress),
    startBlockNumber: startBlockNumber ?? null,
    endBlockNumber: endBlockNumber ?? null,
    feeCollector: await getAccount(ctx, feeCollectorAddress),
    fee: fee,
    initialWeight: initialWeight,
    finalWeight: finalWeight,
    isDestroyed: false,
  });

  return newPool;
}

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

  if (pool) return pool;

  if (!pool && !ensure) return null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!blockHeader) return null;

  const allLbpPoolsStorageData = await parsers.storage.lbp.getAllPoolsData({
    block: blockHeader,
  });

  const newPoolStorageData = allLbpPoolsStorageData.find(
    (poolData) =>
      (poolData.assetAId === +assetIds[0] &&
        poolData.assetBId === +assetIds[1]) ||
      (poolData.assetBId === +assetIds[0] && poolData.assetAId === +assetIds[1])
  );

  if (!newPoolStorageData) return null;

  const {
    poolAddress,
    owner,
    start,
    end,
    assetAId,
    assetBId,
    initialWeight,
    finalWeight,
    fee,
    feeCollector,
  } = newPoolStorageData;

  const newPool = await createLbpPool({
    ctx,
    blockHeader: blockHeader,
    poolData: {
      assetAId,
      assetBId,
      poolAddress: poolAddress,
      ownerAddress: owner,
      startBlockNumber: start,
      endBlockNumber: end,
      feeCollectorAddress: feeCollector,
      fee: fee,
      initialWeight: initialWeight,
      finalWeight: finalWeight,
    },
  });

  if (!newPool) return null;

  await ctx.store.upsert(newPool);
  newPool.account.lbpPool = newPool;
  await ctx.store.upsert(newPool.account);

  const state = ctx.batchState.state;
  state.lbpAllBatchPools.set(newPool.id, newPool);
  state.accounts.set(newPool.account.id, newPool.account);

  ctx.batchState.state = {
    lbpAllBatchPools: state.lbpAllBatchPools,
    accounts: state.accounts,
  };

  return newPool;
}

export async function lpbPoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: LbpPoolCreatedData
) {
  //TODO add check for existing pool with the same ID

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const newPool = await createLbpPool({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    poolData: {
      assetAId: eventParams.data.assets[0],
      assetBId: eventParams.data.assets[1],
      assetABalance: eventCallData.callData?.args?.assetAAmount,
      assetBBalance: eventCallData.callData?.args?.assetBAmount,
      poolAddress: eventParams.pool,
      ownerAddress: eventParams.data.owner,
      startBlockNumber: eventParams.data.start,
      endBlockNumber: eventParams.data.end,
      feeCollectorAddress: eventParams.data.feeCollector,
      fee: eventParams.data.fee,
      initialWeight: eventParams.data.initialWeight,
      finalWeight: eventParams.data.finalWeight,
    },
  });

  if (!newPool) return null;

  newPool.account.lbpPool = newPool;

  const state = ctx.batchState.state;

  state.lbpPoolIdsToSave.add(newPool.id);
  state.lbpAllBatchPools.set(newPool.id, newPool);
  state.accounts.set(newPool.account.id, newPool.account);

  ctx.batchState.state = {
    accounts: state.accounts,
    lbpPoolIdsToSave: state.lbpPoolIdsToSave,
    lbpAllBatchPools: state.lbpAllBatchPools,
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