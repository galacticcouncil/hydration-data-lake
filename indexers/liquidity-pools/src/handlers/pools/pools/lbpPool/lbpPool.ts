import { Store } from '@subsquid/typeorm-store';

import {
  Lbppool,
  LbppoolCreatedData,
  LbppoolDestroyedData,
  LbppoolLifeState,
} from '../../../../model';
import parsers from '../../../../parsers';
import {
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
} from '../../../../parsers/batchBlocksParser/types';
import { LbpPoolData } from '../../../../parsers/types/storage';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../../../processor';
import { getOrCreateAccount } from '../../../accounts';
import { getOrCreateAsset } from '../../../assets/asset';
import { getAssetFreeBalance } from '../../../assets/balances';

export async function createLbppool({
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
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
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
  const assetAEntity = await getOrCreateAsset({
    ctx,
    assetRegistryId: assetAId,
    ensure: true,
    blockHeader: blockHeader,
  });
  const assetBEntity = await getOrCreateAsset({
    ctx,
    assetRegistryId: assetBId,
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

  const newPool = new Lbppool({
    id: poolAddress,
    accountId: poolAddress,
    assetAId: assetAEntity.id,
    assetBId: assetBEntity.id,
    ownerId: ownerAddress,
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    startBlockNumber: startBlockNumber ?? null,
    endBlockNumber: endBlockNumber ?? null,
    feeCollectorId: feeCollectorAddress,
    fee: fee,
    initialWeight: initialWeight,
    finalWeight: finalWeight,
    isDestroyed: false,
    lifeStates: addLbppoolCreatedLifeState({
      createdState: new LbppoolCreatedData({
        assetABalance: newPoolsAssetBalances.assetABalance?.toString() ?? '0',
        assetBBalance: newPoolsAssetBalances.assetBBalance?.toString() ?? '0',
        paraBlockHeight: blockHeader.height,
      }),
    }),
    createdAtParaBlockHeight: blockHeader.height,
    createdAtRelayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    createdAtBlockId: ctx.batchState.getParaBlockFromCacheByHeight(blockHeader.height)!.id,
  });

  return newPool;
}

export async function getOrCreateLbppool({
  ctx,
  assetIds,
  ensure = false,
  blockHeader,
  poolStorageData,
}: {
  ctx: SqdProcessorContext<Store>;
  assetIds: number[] | string[];
  ensure?: boolean;
  blockHeader?: SqdBlock;
  poolStorageData?: LbpPoolData;
}): Promise<Lbppool | null> {
  let pool = [...ctx.batchState.state.lbpAllBatchPools.values()].find(
    (p) =>
      (p.assetAId === `${assetIds[0]}` && p.assetBId === `${assetIds[1]}`) ||
      (p.assetBId === `${assetIds[0]}` && p.assetAId === `${assetIds[1]}`)
  );
  if (pool) return pool;

  pool = await ctx.storeUtils.findOneWithLogs(Lbppool, {
    where: [
      { assetAId: `${assetIds[0]}`, assetBId: `${assetIds[1]}` },
      { assetBId: `${assetIds[0]}`, assetAId: `${assetIds[1]}`  },
    ],
    relations: {},
  }, { className: 'Lbppool' });

  if (pool) {
    ctx.batchState.state.lbpAllBatchPools.set(pool.id, pool);
    return pool;
  }

  if (!pool && !ensure) return pool ?? null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!blockHeader) return null;

  let newPoolStorageData = poolStorageData;

  if (!newPoolStorageData) {
    const allLbpPoolsStorageData = await parsers.storage.lbp.getAllPoolsData({
      block: blockHeader,
    });

    newPoolStorageData = allLbpPoolsStorageData.find(
      (poolData) =>
        (poolData.assetAId === +assetIds[0] &&
          poolData.assetBId === +assetIds[1]) ||
        (poolData.assetBId === +assetIds[0] &&
          poolData.assetAId === +assetIds[1])
    );
  }

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

  const newPool = await createLbppool({
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

  // Get the account and set the bidirectional relation
  const poolAccount = await getOrCreateAccount({ ctx, id: newPool.accountId });
  poolAccount.lbppool = newPool;
  await ctx.storeUtils.runWithRetry(() => ctx.store.upsert(poolAccount));

  const state = ctx.batchState.state;
  state.lbpAllBatchPools.set(newPool.id, newPool);
  state.accounts.set(poolAccount.id, poolAccount);

  return newPool;
}

export async function lpbpoolCreated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: LbpPoolCreatedData
) {
  //TODO add check for existing pool with the same ID

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const existingPool = await getOrCreateLbppool({
    assetIds: eventParams.data.assets,
    ctx,
    ensure: false,
  });

  if (existingPool && !existingPool.isDestroyed) return existingPool;

  if (existingPool && existingPool.isDestroyed) {
    const assetABalance = await getAssetFreeBalance(
      eventMetadata.blockHeader,
      +eventParams.data.assets[0],
      eventParams.pool
    );
    const assetBBalance = await getAssetFreeBalance(
      eventMetadata.blockHeader,
      +eventParams.data.assets[1],
      eventParams.pool
    );

    existingPool.lifeStates = addLbppoolCreatedLifeState({
      createdState: new LbppoolCreatedData({
        assetABalance: assetABalance?.toString() ?? '0',
        assetBBalance: assetBBalance?.toString() ?? '0',
        paraBlockHeight: eventMetadata.blockHeader.height,
      }),
    });
    existingPool.createdAtParaBlockHeight = eventMetadata.blockHeader.height;
    existingPool.createdAtRelayBlockHeight =
      ctx.batchState.getRelayChainBlockDataFromCache(
        eventMetadata.blockHeader.height
      ).height;

    ctx.batchState.state.lbpAllBatchPools.set(eventParams.pool, existingPool);
    ctx.batchState.state.lbpPoolIdsToSave.add(eventParams.pool);
    return existingPool;
  }

  const newPool = await createLbppool({
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

  // Get the account and set the bidirectional relation
  const poolAccount = await getOrCreateAccount({ ctx, id: newPool.accountId });
  poolAccount.lbppool = newPool;

  const state = ctx.batchState.state;

  state.lbpPoolIdsToSave.add(newPool.id);
  state.lbpAllBatchPools.set(newPool.id, newPool);
  state.accounts.set(poolAccount.id, poolAccount);
}

export async function lpbpoolUpdated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: LbpPoolUpdatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const existingPoolData = ctx.batchState.state.lbpAllBatchPools.get(
    eventParams.pool
  );

  if (!existingPoolData) return;

  // Ensure owner and feeCollector accounts exist, then store IDs
  await getOrCreateAccount({ ctx, id: eventParams.data.owner });
  await getOrCreateAccount({ ctx, id: eventParams.data.feeCollector });

  existingPoolData.ownerId = eventParams.data.owner;
  existingPoolData.feeCollectorId = eventParams.data.feeCollector;
  existingPoolData.initialWeight = eventParams.data.initialWeight;
  existingPoolData.finalWeight = eventParams.data.finalWeight;
  existingPoolData.repayTarget = eventParams.data.repayTarget;
  existingPoolData.startBlockNumber = eventParams.data.start;
  existingPoolData.endBlockNumber = eventParams.data.end;

  ctx.batchState.state.lbpPoolIdsToSave.add(existingPoolData.id);

  ctx.batchState.state.lbpAllBatchPools.set(eventParams.pool, existingPoolData);
}

export function addLbppoolCreatedLifeState({
  existingStates = [],
  createdState,
}: {
  existingStates?: LbppoolLifeState[];
  createdState: LbppoolCreatedData;
}): LbppoolLifeState[] {
  const existingState = existingStates.find(
    (state) => state.created.paraBlockHeight === createdState.paraBlockHeight
  );

  if (existingState) return existingStates;

  return [
    ...existingStates,
    new LbppoolLifeState({
      created: createdState,
      destroyed: null,
    }),
  ];
}

export function addLbppoolDestroyedLifeState({
  existingStates = [],
  destroyedState,
}: {
  existingStates?: LbppoolLifeState[];
  destroyedState: LbppoolDestroyedData;
}): LbppoolLifeState[] {
  const latestOpenState = existingStates.find((state) => !state.destroyed);

  if (!latestOpenState) return existingStates;

  return [
    ...existingStates.filter(
      (state) =>
        state.created.paraBlockHeight !==
        latestOpenState.created.paraBlockHeight
    ),
    new LbppoolLifeState({
      created: latestOpenState.created,
      destroyed: destroyedState,
    }),
  ];
}
