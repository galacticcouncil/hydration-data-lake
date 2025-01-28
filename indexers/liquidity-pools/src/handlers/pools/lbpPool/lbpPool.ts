import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountType,
  Lbppool,
  LbppoolCreatedData,
  LbppoolDestroyedData,
  LbppoolLifeState,
} from '../../../model';
import { getAccount } from '../../accounts';
import {
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
} from '../../../parsers/batchBlocksParser/types';
import { getAssetFreeBalance } from '../../assets/balances';
import { getAsset } from '../../assets/assetRegistry';
import parsers from '../../../parsers';

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

  const newPool = new Lbppool({
    id: poolAddress,
    account: await getAccount({
      ctx,
      id: poolAddress,
      accountType: AccountType.Lbppool,
      ensureAccountType: true,
    }),
    assetA: assetAEntity,
    assetB: assetBEntity,
    owner: await getAccount({ ctx, id: ownerAddress }),
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    startBlockNumber: startBlockNumber ?? null,
    endBlockNumber: endBlockNumber ?? null,
    feeCollector: await getAccount({ ctx, id: feeCollectorAddress }),
    fee: fee,
    initialWeight: initialWeight,
    finalWeight: finalWeight,
    isDestroyed: false,
    lifeStates: addLbppoolCreatedLifeState({
      createdState: new LbppoolCreatedData({
        assetABalance: newPoolsAssetBalances.assetABalance?.toString() ?? '0',
        assetBBalance: newPoolsAssetBalances.assetBBalance?.toString() ?? '0',
        paraChainBlockHeight: blockHeader.height,
        relayChainBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          blockHeader.height
        ).height,
      }),
    }),
    createdAtParaChainBlockHeight: blockHeader.height,
    createdAtRelayChainBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(blockHeader.height).height,
    createdAtBlock: ctx.batchState.state.batchBlocks.get(blockHeader.id),
  });

  return newPool;
}

export async function getOrCreateLbppool({
  ctx,
  assetIds,
  ensure = false,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  assetIds: number[] | string[];
  ensure?: boolean;
  blockHeader?: SqdBlock;
}): Promise<Lbppool | null> {
  let pool = [...ctx.batchState.state.lbpAllBatchPools.values()].find(
    (p) =>
      (p.assetA.id === `${assetIds[0]}` && p.assetB.id === `${assetIds[1]}`) ||
      (p.assetB.id === `${assetIds[0]}` && p.assetA.id === `${assetIds[1]}`)
  );
  if (pool) return pool;

  pool = await ctx.store.findOne(Lbppool, {
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
  newPool.account.lbppool = newPool;
  await ctx.store.upsert(newPool.account);

  const state = ctx.batchState.state;
  state.lbpAllBatchPools.set(newPool.id, newPool);
  state.accounts.set(newPool.account.id, newPool.account);

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

  newPool.account.lbppool = newPool;

  const state = ctx.batchState.state;

  state.lbpPoolIdsToSave.add(newPool.id);
  state.lbpAllBatchPools.set(newPool.id, newPool);
  state.accounts.set(newPool.account.id, newPool.account);
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

  existingPoolData.owner = await getAccount({
    ctx,
    id: eventParams.data.owner,
  });
  existingPoolData.feeCollector = await getAccount({
    ctx,
    id: eventParams.data.feeCollector,
  });
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
    (state) =>
      state.created.paraChainBlockHeight === createdState.paraChainBlockHeight
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
        state.created.paraChainBlockHeight !==
        latestOpenState.created.paraChainBlockHeight
    ),
    new LbppoolLifeState({
      created: latestOpenState.created,
      destroyed: destroyedState,
    }),
  ];
}
