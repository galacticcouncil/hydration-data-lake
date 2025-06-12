import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { StableswapAsset } from '../../../model';

export async function getAssetsByStablepool(
  ctx: SqdProcessorContext<Store>,
  poolId: string | number
) {
  const batchState = ctx.batchState.state;

  const cachedAssets = [...batchState.stableswapAssetsAllBatch.values()].filter(
    (asset) => asset.pool.id === poolId
  );
  const persistentAssets = await ctx.store.find(StableswapAsset, {
    where: { pool: { id: `${poolId}` } },
    relations: {
      pool: true,
      asset: true,
    },
  });
  const compiledMap = new Map(
    [...cachedAssets, ...persistentAssets].map((asset) => [asset.id, asset])
  );

  return [...compiledMap.values()].map(
    (stableswapAsset) => stableswapAsset.asset
  );
}
