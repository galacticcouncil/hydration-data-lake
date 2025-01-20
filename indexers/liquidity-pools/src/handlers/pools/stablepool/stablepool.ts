import { Block, ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AccountType, Stablepool, StablepoolAsset } from '../../../model';
import { getAccount } from '../../accounts';
import { StableswapPoolCreatedData } from '../../../parsers/batchBlocksParser/types';

import { StableMath } from '@galacticcouncil/sdk';
import { blake2AsHex } from '@polkadot/util-crypto';
import { isNotNullOrUndefined } from '../../../utils/helpers';
import { getAsset } from '../../assets/assetRegistry';
import { getAssetFreeBalance } from '../../assets/balances';
import parsers from '../../../parsers';

export async function getNewStablepoolWithAssets({
  poolId,
  assetIds,
  ctx,
  blockHeader,
}: {
  poolId: number | string;
  assetIds?: number[];
  ctx: ProcessorContext<Store>;
  blockHeader: Block;
}) {
  const newPool = new Stablepool({
    id: `${poolId}`,
    account: await getAccount({
      ctx,
      id: blake2AsHex(StableMath.getPoolAddress(+poolId)),
      accountType: AccountType.Stablepool,
      ensureAccountType: true,
    }),
    createdAt: new Date(blockHeader.timestamp ?? Date.now()),
    createdAtParaBlock: blockHeader.height,
    isDestroyed: false,
  });

  let poolAssetIds = assetIds;
  if (!poolAssetIds) {
    const poolStorageData = await parsers.storage.stableswap.getPoolData({
      poolId: +poolId,
      block: blockHeader,
    });
    if (!poolStorageData)
      throw new Error(
        `Storage data fro Stablepool with poolId ${poolId} can not be fetched.`
      );

    poolAssetIds = poolStorageData?.assets;
  }

  const assetsListPromise = poolAssetIds.map(
    async (assetId) =>
      new StablepoolAsset({
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

export async function getOrCreateStablepool({
  poolId,
  ctx,
  ensure,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  poolId: number | string;
  ensure?: boolean;
  blockHeader?: Block;
}) {
  const batchState = ctx.batchState.state;

  let pool = batchState.stablepoolAllBatchPools.get(`${poolId}`);
  if (pool) return pool;

  pool = await ctx.store.findOne(Stablepool, {
    where: { id: `${poolId}` },
    relations: { assets: { asset: true }, account: true },
  });

  if (pool || (!pool && !ensure)) return pool ?? null;

  if (!blockHeader) return null;

  const { pool: newPool, poolAssets } = await getNewStablepoolWithAssets({
    poolId: poolId,
    ctx,
    blockHeader: blockHeader,
  });

  await ctx.store.upsert(newPool);

  newPool.assets = poolAssets;

  const state = ctx.batchState.state;

  for (const asset of poolAssets) {
    state.stablepoolAssetsAllBatch.set(+asset.asset.id, asset);
    await ctx.store.upsert(asset);
  }
  await ctx.store.save(newPool.account);

  state.stablepoolIdsToSave.add(newPool.id);
  state.stablepoolAllBatchPools.set(newPool.id, newPool);

  newPool.account.stablepool = newPool;
  state.accounts.set(newPool.account.id, newPool.account);

  return newPool;
}

export async function stablepoolCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: StableswapPoolCreatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { pool, poolAssets } = await getNewStablepoolWithAssets({
    poolId: eventParams.poolId,
    assetIds: eventParams.assets,
    ctx,
    blockHeader: eventMetadata.blockHeader,
  });

  pool.assets = poolAssets;
  pool.account.stablepool = pool;

  const state = ctx.batchState.state;

  for (const asset of poolAssets) {
    state.stablepoolAssetsAllBatch.set(+asset.asset.id, asset);
  }

  state.stablepoolIdsToSave.add(pool.id);

  state.stablepoolAllBatchPools.set(pool.id, pool);

  await ctx.store.save(pool.account);
  state.accounts.set(pool.account.id, pool.account);
}
