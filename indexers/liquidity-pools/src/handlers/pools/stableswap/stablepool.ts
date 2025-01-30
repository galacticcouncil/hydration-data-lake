import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountType,
  Stableswap,
  StableswapAsset,
  StableswapCreatedData,
  StableswapDestroyedData,
  StableswapLifeState,
} from '../../../model';
import { getAccount } from '../../accounts';
import { StableswapPoolCreatedData } from '../../../parsers/batchBlocksParser/types';

import { StableMath } from '@galacticcouncil/sdk';
import { blake2AsHex } from '@polkadot/util-crypto';
import { isNotNullOrUndefined } from '../../../utils/helpers';
import { getAsset } from '../../assets/assetRegistry';
import { getAssetFreeBalance } from '../../assets/balances';
import parsers from '../../../parsers';

export async function getNewStableswapWithAssets({
  poolId,
  assetIds,
  ctx,
  blockHeader,
}: {
  poolId: number | string;
  assetIds?: number[];
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
}) {
  const poolShareToken = await getAsset({
    ctx,
    id: poolId,
    ensure: true,
    blockHeader,
  });

  if (!poolShareToken)
    throw Error(`Asset ${poolId} can not be found or created.`);

  const newPool = new Stableswap({
    id: `${poolId}`,
    account: await getAccount({
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

  let poolAssetIds = assetIds;
  if (!poolAssetIds) {
    const poolStorageData = await parsers.storage.stableswap.getPoolData({
      poolId: +poolId,
      block: blockHeader,
    });
    if (!poolStorageData)
      throw new Error(
        `Storage data for Stableswap with poolId ${poolId} can not be fetched.`
      );

    poolAssetIds = poolStorageData?.assets;
  }

  const assetsListPromise = poolAssetIds.map(
    async (assetId) =>
      new StableswapAsset({
        id: `${newPool.id}-${assetId}`,
        pool: newPool,
        amount: await getAssetFreeBalance(
          blockHeader,
          assetId,
          newPool.account.id
        ),
        asset: (await getAsset({
          ctx,
          id: assetId,
          ensure: true,
          blockHeader,
        }))!, // TODO fix types
      })
  );

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

  let pool = batchState.stableswapAllBatchPools.get(`${poolId}`);
  if (pool) return pool;

  pool = await ctx.store.findOne(Stableswap, {
    where: { id: `${poolId}` },
    relations: { assets: { asset: true }, account: true },
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

  for (const asset of poolAssets) {
    state.stableswapAssetsAllBatch.set(+asset.asset.id, asset);
    await ctx.store.upsert(asset);
  }
  await ctx.store.save(newPool.account);

  state.stableswapIdsToSave.add(newPool.id);
  state.stableswapAllBatchPools.set(newPool.id, newPool);

  newPool.account.stableswap = newPool;
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

  const { pool, poolAssets } = await getNewStableswapWithAssets({
    poolId: eventParams.poolId,
    assetIds: eventParams.assets,
    ctx,
    blockHeader: eventMetadata.blockHeader,
  });

  pool.assets = poolAssets;

  const state = ctx.batchState.state;

  for (const asset of poolAssets) {
    state.stableswapAssetsAllBatch.set(+asset.asset.id, asset);
  }

  state.stableswapIdsToSave.add(pool.id);

  state.stableswapAllBatchPools.set(pool.id, pool);

  await ctx.store.save(pool.account);
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
