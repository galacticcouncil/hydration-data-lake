import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Stablepool, StablepoolAsset } from '../../model';

export async function getStablepoolAssetsAll(
  ctx: ProcessorContext<Store>,
  poolId: string | number
) {
  const batchState = ctx.batchState.state;

  const cachedAssets = [...batchState.stablepoolAssetsAllBatch.values()].filter(
    (asset) => asset.pool.id === poolId
  );
  const persistentAssets = await ctx.store.find(StablepoolAsset, {
    where: { pool: { id: `${poolId}` } },
    relations: {
      pool: true,
      asset: true,
    },
  });
  const compiledMap = new Map(
    [...cachedAssets, ...persistentAssets].map((asset) => [asset.id, asset])
  );

  return [...compiledMap.values()].map((sAsset) => sAsset.asset);
}
