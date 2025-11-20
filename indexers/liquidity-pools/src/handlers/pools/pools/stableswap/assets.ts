import { Store } from '@subsquid/typeorm-store';

import { Asset, StableswapAsset } from '../../../../model';
import { SqdProcessorContext } from '../../../../processor';

export async function getAssetsByStablepool(
  ctx: SqdProcessorContext<Store>,
  poolId: string | number
) {
  const batchState = ctx.batchState.state;

  // Get StableswapAsset entities from cache (filtered by poolId)
  const cachedStableswapAssets = [...batchState.stableswapAssets.values()].filter(
    (stableswapAsset) => stableswapAsset.pool.id === poolId
  );

  // Fallback to DB if not found in cache
  const persistentStableswapAssets = cachedStableswapAssets.length === 0
    ? await ctx.storeUtils.findWithLogs(StableswapAsset, {
        where: { pool: { id: `${poolId}` } },
        relations: {
          pool: true,
        },
      }, { className: 'StableswapAsset' })
    : [];

  const compiledMap = new Map(
    [...cachedStableswapAssets, ...persistentStableswapAssets].map((stableswapAsset) => [stableswapAsset.id, stableswapAsset])
  );

  // Map to actual Asset entities using cache-first with DB fallback
  const assets: Asset[] = [];
  for (const stableswapAsset of compiledMap.values()) {
    // Try cache first
    let asset = batchState.assetsAll.get(stableswapAsset.assetId);

    // Fallback to DB if not in cache
    if (!asset) {
      asset = await ctx.storeUtils.findOneWithLogs(Asset, {
        where: { id: stableswapAsset.assetId },
      }, { className: 'Asset' });

      // Add to cache if found
      if (asset) {
        batchState.assetsAll.set(asset.id, asset);
      }
    }

    if (asset) {
      assets.push(asset);
    }
  }

  return assets;
}
