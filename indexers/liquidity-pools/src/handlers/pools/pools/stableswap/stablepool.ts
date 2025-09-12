import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountType,
  Stableswap,
  StableswapAsset,
  StableswapCreatedData,
  StableswapDestroyedData,
  StableswapLifeState,
} from '../../../../model';
import { getOrCreateAccount } from '../../../accounts';
import { StableswapPoolCreatedData } from '../../../../parsers/batchBlocksParser/types';

import { StableMath } from '@galacticcouncil/sdk';
import { blake2AsHex } from '@polkadot/util-crypto';
import { isNotNullOrUndefined } from '../../../../utils/helpers';
import { getOrCreateAsset } from '../../../assets/asset';
import { getAssetFreeBalance } from '../../../assets/balances';
import parsers from '../../../../parsers';

export async function getNewStableswapWithAssets({
  poolId,
  assetRegistryAssetIds,
  ctx,
  blockHeader,
}: {
  poolId: number | string;
  // assetIds?: string[];
  assetRegistryAssetIds?: number[];
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
}) {
  const poolShareToken = await getOrCreateAsset({
    ctx,
    assetRegistryId: poolId,
    ensure: true,
    blockHeader,
  });

  if (!poolShareToken)
    throw Error(`Asset ${poolId} can not be found or created.`);

  const newPool = new Stableswap({
    id: `${poolId}`,
    account: await getOrCreateAccount({
      ctx,
      id: blake2AsHex(StableMath.getPoolAddress(+poolId)),
      accountType: AccountType.Stableswap,
      ensureAccountType: true,
    }),
    shareToken: poolShareToken,
    createdAtParaBlockHeight: blockHeader.height,
    createdAtRelayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    createdAtBlock: ctx.batchState.state.batchBlocks.get(blockHeader.id),
    isDestroyed: false,
    lifeStates: addStableswapCreatedLifeState({
      createdState: new StableswapCreatedData({
        paraBlockHeight: blockHeader.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          blockHeader.height
        ).height,
      }),
    }),
  });

  let poolArAssetIds = assetRegistryAssetIds;
  if (!poolArAssetIds) {
    const poolStorageData = await parsers.storage.stableswap.getPoolData({
      poolId: +poolId,
      block: blockHeader,
    });
    if (!poolStorageData)
      throw new Error(
        `Storage data for Stableswap with poolId ${poolId} can not be fetched.`
      );

    poolArAssetIds = poolStorageData?.assets;
  }

  const assetsListPromise = poolArAssetIds.map(async (arAssetId) => {
    const assetEntity = await getOrCreateAsset({
      ctx,
      assetRegistryId: arAssetId,
      ensure: true,
      blockHeader,
    });

    return new StableswapAsset({
      id: `${newPool.id}-${assetEntity!.id}`,
      pool: newPool,
      amount: await getAssetFreeBalance(
        blockHeader,
        arAssetId,
        newPool.account.id
      ),
      asset: assetEntity!, // TODO fix types
    });
  });

  const stablepoolAssets = (await Promise.all(assetsListPromise)).filter(
    isNotNullOrUndefined
  );

  return {
    pool: newPool,
    poolAssets: stablepoolAssets,
  };
}

export async function getOrCreateStableswap({
  poolId,
  ctx,
  ensure,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  poolId: number | string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
}) {
  const batchState = ctx.batchState.state;

  let pool = batchState.stableswapPools.get(`${poolId}`);
  if (pool) return pool;

  pool = await ctx.store.findOne(Stableswap, {
    where: { id: `${poolId}` },
    relations: { assets: { asset: true }, account: true, shareToken: true },
  });

  if (pool || (!pool && !ensure)) return pool ?? null;

  if (!blockHeader) return null;

  const { pool: newPool, poolAssets } = await getNewStableswapWithAssets({
    poolId: poolId,
    ctx,
    blockHeader: blockHeader,
  });

  await ctx.store.upsert(newPool);

  newPool.assets = poolAssets;

  const state = ctx.batchState.state;

  for (const poolAsset of poolAssets) {
    state.stableswapAssets.set(poolAsset.id, poolAsset);
    await ctx.store.upsert(poolAsset);
  }

  newPool.account.stableswap = newPool;

  // await ctx.store.save(newPool.account);
  await ctx.storeUtils.runWithRetry(() => ctx.store.save(newPool.account));

  state.stableswapIdsToSave.add(newPool.id);
  state.stableswapPools.set(newPool.id, newPool);

  state.accounts.set(newPool.account.id, newPool.account);

  return newPool;
}

export async function stableswapCreated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: StableswapPoolCreatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const existingPool = await getOrCreateStableswap({
    poolId: eventParams.poolId,
    ctx,
    ensure: false,
  });

  if (existingPool && !existingPool.isDestroyed) return;

  if (existingPool && existingPool.isDestroyed) {
    existingPool.isDestroyed = false;

    existingPool.createdAtParaBlockHeight = eventMetadata.blockHeader.height;
    existingPool.createdAtRelayBlockHeight =
      ctx.batchState.getRelayChainBlockDataFromCache(
        eventMetadata.blockHeader.height
      ).height;
    existingPool.createdAtBlock = ctx.batchState.state.batchBlocks.get(
      eventMetadata.blockHeader.id
    )!;
    existingPool.lifeStates = addStableswapCreatedLifeState({
      createdState: new StableswapCreatedData({
        paraBlockHeight: eventMetadata.blockHeader.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          eventMetadata.blockHeader.height
        ).height,
      }),
    });

    ctx.batchState.state.stableswapPools.set(existingPool.id, existingPool);
    ctx.batchState.state.stableswapIdsToSave.add(existingPool.id);
    return existingPool;
  }

  const { pool, poolAssets } = await getNewStableswapWithAssets({
    poolId: eventParams.poolId,
    assetRegistryAssetIds: eventParams.assets,
    ctx,
    blockHeader: eventMetadata.blockHeader,
  });

  pool.assets = poolAssets;

  const state = ctx.batchState.state;

  for (const poolAsset of poolAssets) {
    state.stableswapAssets.set(poolAsset.id, poolAsset);
  }

  state.stableswapIdsToSave.add(pool.id);

  state.stableswapPools.set(pool.id, pool);

  await ctx.store.save(pool.account);

  // Account must be saved one more time later after pool save to persist pool
  // relationshit which is not existing at the time.
  pool.account.stableswap = pool;

  state.accounts.set(pool.account.id, pool.account);
}

export function addStableswapCreatedLifeState({
  existingStates = [],
  createdState,
}: {
  existingStates?: StableswapLifeState[];
  createdState: StableswapCreatedData;
}): StableswapLifeState[] {
  const existingState = existingStates.find(
    (state) => state.created.paraBlockHeight === createdState.paraBlockHeight
  );

  if (existingState) return existingStates;

  return [
    ...existingStates,
    new StableswapLifeState({
      created: createdState,
      destroyed: null,
    }),
  ];
}

export function addStableswapDestroyedLifeState({
  existingStates = [],
  destroyedState,
}: {
  existingStates?: StableswapLifeState[];
  destroyedState: StableswapDestroyedData;
}): StableswapLifeState[] {
  const latestOpenState = existingStates.find((state) => !state.destroyed);

  if (!latestOpenState) return existingStates;

  return [
    ...existingStates.filter(
      (state) =>
        state.created.paraBlockHeight !==
        latestOpenState.created.paraBlockHeight
    ),
    new StableswapLifeState({
      created: latestOpenState.created,
      destroyed: destroyedState,
    }),
  ];
}
