import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountType,
  AssetType,
  Xykpool,
  XykpoolCreatedData,
  XykpoolDestroyedData,
  XykpoolLifeState,
} from '../../../../model';
import { getOrCreateAccount } from '../../../accounts';
import {
  XykPoolCreatedData,
  XykPoolDestroyedData,
} from '../../../../parsers/batchBlocksParser/types';
import { getAssetFreeBalance } from '../../../assets/balances';
import { getOrCreateAsset } from '../../../assets/asset';
import parsers from '../../../../parsers';
import { getXykpoolShareTokenDecimals } from '../../../../utils/helpers';
import pMap from 'p-map';

export async function createXykPool({
  ctx,
  blockHeader,
  poolData: {
    assetAId,
    assetBId,
    assetABalance,
    assetBBalance,
    poolAddress,
    initialSharesAmount,
    shareTokenId,
  },
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  poolData: {
    poolAddress: string;
    assetAId: string | number;
    assetBId: string | number;
    assetABalance?: bigint;
    assetBBalance?: bigint;
    initialSharesAmount?: bigint;
    shareTokenId?: number;
  };
}) {
  const newPoolsAssetBalances: {
    assetABalance: bigint | undefined;
    assetBBalance: bigint | undefined;
  } = {
    assetABalance: assetABalance,
    assetBBalance: assetBBalance,
  };

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

  let shareTokenIdEnsured = shareTokenId ?? null;

  if (!shareTokenIdEnsured) {
    shareTokenIdEnsured = await parsers.storage.xyk.getShareToken({
      block: blockHeader,
      poolAddress,
    });
  }

  if (!shareTokenIdEnsured) return null;

  const sharedTokenEntity = await getOrCreateAsset({
    ctx,
    assetRegistryId: shareTokenIdEnsured,
    ensure: true,
    blockHeader: blockHeader,
  });

  if (!sharedTokenEntity) return null;

  if (assetAEntity.decimals && assetBEntity.decimals) {
    const sharedTokenDecimals =
      Number(assetAEntity.id) > Number(assetBEntity.id)
        ? assetBEntity.decimals
        : assetAEntity.decimals;

    sharedTokenEntity.decimals = sharedTokenDecimals;

    await ctx.storeUtils.upsertWithBatches([sharedTokenEntity]);
    ctx.batchState.state.assetsAll.set(sharedTokenEntity.id, sharedTokenEntity);
  }

  const newPool = new Xykpool({
    id: poolAddress,
    account: await getOrCreateAccount({
      ctx,
      id: poolAddress,
      accountType: AccountType.Xykpool,
      ensureAccountType: true,
    }),
    assetA: assetAEntity,
    assetB: assetBEntity,
    shareToken: sharedTokenEntity,
    assetABalance: newPoolsAssetBalances.assetABalance,
    assetBBalance: newPoolsAssetBalances.assetBBalance,
    isDestroyed: false,
    lifeStates: addXykpoolCreatedLifeState({
      createdState: new XykpoolCreatedData({
        initialSharesAmount: initialSharesAmount
          ? initialSharesAmount.toString()
          : '0',
        paraBlockHeight: blockHeader.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          blockHeader.height
        ).height,
      }),
    }),
    createdAtParaBlockHeight: blockHeader.height,
    createdAtRelayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    createdAtBlock: ctx.batchState.state.batchBlocks.get(blockHeader.id),
  });

  return newPool;
}

export async function getOrCreateXykPool({
  ctx,
  id,
  ensure = false,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  id: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
}): Promise<Xykpool | null> {
  const batchState = ctx.batchState.state;

  let pool = batchState.xykAllBatchPools.get(id);
  if (pool) return pool;

  pool = await ctx.storeUtils.findOneWithLogs(
    Xykpool,
    {
      where: { id },
      relations: {
        assetA: true,
        assetB: true,
        account: true,
        shareToken: true,
      },
    },
    { className: 'Xykpool' }
  );

  if (pool) {
    ctx.batchState.state.xykAllBatchPools.set(pool.id, pool);
    return pool;
  }

  if (pool || (!pool && !ensure)) return pool ?? null;

  /**
   * Following logic below is implemented and will be used only if indexer
   * has been started not from genesis block and some assets have not been
   * pre-created before indexing start point.
   */

  if (!blockHeader) return null;

  const xykPoolAssetsStorageData = await parsers.storage.xyk.getPoolAssets({
    block: blockHeader,
    poolAddress: id,
  });

  if (!xykPoolAssetsStorageData) return null;

  const newPool = await createXykPool({
    ctx,
    blockHeader: blockHeader,
    poolData: {
      assetAId: xykPoolAssetsStorageData.assetAId,
      assetBId: xykPoolAssetsStorageData.assetBId,
      poolAddress: id,
    },
  });

  if (!newPool) return null;

  await ctx.store.upsert(newPool);
  newPool.account.xykpool = newPool;
  // await ctx.store.upsert(newPool.account);
  await ctx.storeUtils.runWithRetry(() => ctx.store.upsert(newPool.account));

  const state = ctx.batchState.state;
  state.xykAllBatchPools.set(newPool.id, newPool);
  state.accounts.set(newPool.account.id, newPool.account);

  return newPool;
}

export async function xykPoolCreated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: XykPoolCreatedData
) {
  //TODO add check for existing pool with the same ID

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const existingPool = await getOrCreateXykPool({
    id: eventParams.pool,
    ctx,
    ensure: false,
  });

  if (existingPool && !existingPool.isDestroyed) return;

  if (existingPool && existingPool.isDestroyed) {
    existingPool.isDestroyed = false;

    existingPool.lifeStates = addXykpoolCreatedLifeState({
      createdState: new XykpoolCreatedData({
        initialSharesAmount: eventParams.initialSharesAmount
          ? eventParams.initialSharesAmount.toString()
          : '0',
        paraBlockHeight: eventMetadata.blockHeader.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          eventMetadata.blockHeader.height
        ).height,
      }),
    });
    existingPool.createdAtParaBlockHeight = eventMetadata.blockHeader.height;
    existingPool.createdAtRelayBlockHeight =
      ctx.batchState.getRelayChainBlockDataFromCache(
        eventMetadata.blockHeader.height
      ).height;
    existingPool.createdAtBlock = ctx.batchState.state.batchBlocks.get(
      eventMetadata.blockHeader.id
    )!;

    ctx.batchState.state.xykAllBatchPools.set(existingPool.id, existingPool);
    ctx.batchState.state.xykPoolIdsToSave.add(existingPool.id);

    return existingPool;
  }

  const newPool = await createXykPool({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    poolData: {
      assetAId: eventParams.assetA,
      assetBId: eventParams.assetB,
      assetABalance: eventCallData.callData?.args?.amountA,
      assetBBalance: eventCallData.callData?.args?.amountB,
      poolAddress: eventParams.pool,
      initialSharesAmount: eventParams.initialSharesAmount,
      shareTokenId: eventParams.shareToken,
    },
  });

  if (!newPool) return;

  newPool.account.xykpool = newPool;

  const state = ctx.batchState.state;

  state.xykPoolIdsToSave.add(newPool.id);
  state.xykAllBatchPools.set(newPool.id, newPool);
  state.accounts.set(newPool.account.id, newPool.account);
}

export async function xykPoolDestroyed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: XykPoolDestroyedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const pool = await ctx.storeUtils.findOneWithLogs(
    Xykpool,
    {
      where: { id: eventParams.pool },
      relations: {
        assetA: true,
        assetB: true,
        account: true,
      },
    },
    { className: 'Xykpool' }
  );

  if (!pool) return;

  pool.isDestroyed = true;
  pool.lifeStates = addXykpoolDestroyedLifeState({
    existingStates: pool.lifeStates,
    destroyedState: new XykpoolDestroyedData({
      paraBlockHeight: eventMetadata.blockHeader.height,
      relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
        eventMetadata.blockHeader.height
      ).height,
    }),
  });

  const state = ctx.batchState.state;

  state.xykPoolIdsToSave.add(pool.id);
  state.xykAllBatchPools.set(pool.id, pool);
}

export function addXykpoolCreatedLifeState({
  existingStates = [],
  createdState,
}: {
  existingStates?: XykpoolLifeState[];
  createdState: XykpoolCreatedData;
}): XykpoolLifeState[] {
  const existingState = existingStates.find(
    (state) => state.created.paraBlockHeight === createdState.paraBlockHeight
  );

  if (existingState) return existingStates;

  return [
    ...existingStates,
    new XykpoolLifeState({
      created: createdState,
      destroyed: null,
    }),
  ];
}

export function addXykpoolDestroyedLifeState({
  existingStates = [],
  destroyedState,
}: {
  existingStates?: XykpoolLifeState[];
  destroyedState: XykpoolDestroyedData;
}): XykpoolLifeState[] {
  const latestOpenState = existingStates.find((state) => !state.destroyed);

  if (!latestOpenState) return existingStates;

  return [
    ...existingStates.filter(
      (state) =>
        state.created.paraBlockHeight !==
        latestOpenState.created.paraBlockHeight
    ),
    new XykpoolLifeState({
      created: latestOpenState.created,
      destroyed: destroyedState,
    }),
  ];
}

export async function initAllXykPools({
  ctx,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
}) {
  let existingXykPoolsCount = ctx.batchState.state.xykAllBatchPools.size;

  if (existingXykPoolsCount > 0) return;

  existingXykPoolsCount = (await ctx.storeUtils.findOneWithLogs(Xykpool, {
    where: {},
  }))
    ? 1
    : 0;

  if (existingXykPoolsCount) return;

  const poolShareTokenPairs =
    await parsers.storage.xyk.getPoolShareTokenPairsMany({
      block: blockHeader,
    });

  const xykpoolsWithInvolvedShareAssets: Xykpool[] = [];
  const otherXykpools: Xykpool[] = [];

  await pMap(
    poolShareTokenPairs,
    async ({ poolId, shareTokenId }) => {
      const pool = await getOrCreateXykPool({
        ctx,
        id: poolId,
        ensure: true,
        blockHeader,
      });

      if (!pool) return;

      if (
        pool.assetA.assetType === AssetType.XYK ||
        pool.assetB.assetType === AssetType.XYK
      ) {
        xykpoolsWithInvolvedShareAssets.push(pool);
      } else {
        otherXykpools.push(pool);
      }
    },
    { concurrency: 200 }
  );

  for (const pool of otherXykpools) {
    if (!pool.assetA.decimals || !pool.assetB.decimals) continue;

    try {
      const shareAssetDecimals = getXykpoolShareTokenDecimals({
        poolAssets: [pool.assetA, pool.assetB],
      });

      pool.shareToken.decimals = shareAssetDecimals;

      await ctx.storeUtils.upsertWithBatches([pool.shareToken]);
      ctx.batchState.state.assetsAll.set(pool.shareToken.id, pool.shareToken);
    } catch (e) {
      console.log(e);
    }
  }

  for (const pool of xykpoolsWithInvolvedShareAssets) {
    const assetA = ctx.batchState.state.assetsAll.get(pool.assetA.id);
    const assetB = ctx.batchState.state.assetsAll.get(pool.assetB.id);
    if (!assetA?.decimals || !assetB?.decimals) continue;

    try {
      const shareAssetDecimals = getXykpoolShareTokenDecimals({
        poolAssets: [pool.assetA, pool.assetB],
      });

      pool.shareToken.decimals = shareAssetDecimals;

      await ctx.storeUtils.upsertWithBatches([pool.shareToken]);
      ctx.batchState.state.assetsAll.set(pool.shareToken.id, pool.shareToken);
    } catch (e) {
      console.log(e);
    }
  }
}
