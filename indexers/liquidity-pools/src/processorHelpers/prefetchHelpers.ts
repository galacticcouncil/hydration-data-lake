import { SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { prefetchOrInitAllBatchAccounts } from '../handlers/accounts';
import { prefetchAllAssets } from '../handlers/assets/utils';
import {
  Aavepool,
  Lbppool,
  OmnipoolAsset,
  Stableswap,
  StableswapAsset,
  Xykpool,
} from '../model';

export async function prefetchPersistentData(ctx: SqdProcessorContext<Store>) {
  await prefetchOrInitAllBatchAccounts(ctx);

  await prefetchAllAssets(ctx);

  ctx.batchState.state.lbpAllBatchPools = new Map(
    (
      await ctx.store.find(Lbppool, {
        where: {},
        relations: { account: true, assetA: true, assetB: true },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.xykAllBatchPools = new Map(
    (
      await ctx.store.find(Xykpool, {
        where: {},
        relations: { assetA: true, assetB: true, account: true },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.omnipoolAssets = new Map(
    (
      await ctx.store.find(OmnipoolAsset, {
        where: {},
        relations: { asset: true, pool: true, addedAtBlock: true },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stableswapAllBatchPools = new Map(
    (
      await ctx.store.find(Stableswap, {
        where: {},
        relations: {
          account: true,
          shareToken: true,
          createdAtBlock: true,
          assets: { asset: true },
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.stableswapAssetsAllBatch = new Map(
    (
      await ctx.store.find(StableswapAsset, {
        where: {},
        relations: {
          pool: true,
          asset: true,
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.aavePools = new Map(
    (
      await ctx.store.find(Aavepool, {
        where: {},
        relations: {
          reserveAsset: true,
          aToken: true,
        },
      })
    ).map((p) => [p.id, p])
  );
}
