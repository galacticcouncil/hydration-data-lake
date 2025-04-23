import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Aavepool } from '../../../model';
import { getOrCreateAsset } from '../../assets/asset';
import { getAavePoolAddress } from '../../../utils/helpers';

export async function getOrCreateAavepool({
  reserveAssetId,
  aTokenId,
  ensure = false,
  blockHeader,
  ctx,
}: {
  reserveAssetId: string;
  aTokenId: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}): Promise<Aavepool | null> {
  const batchState = ctx.batchState.state;

  if (!reserveAssetId && !aTokenId)
    throw new Error('No asset ID provided in Aavepool');

  const poolId = getAavePoolAddress(reserveAssetId, aTokenId);

  let pool = batchState.aavePools.get(poolId);
  if (pool) return pool;

  pool = await ctx.store.findOne(Aavepool, {
    where: { id: poolId },
    relations: { reserveAsset: true, aToken: true, historicalData: true },
  });

  if (pool) {
    ctx.batchState.state.aavePools.set(pool.id, pool);
    return pool;
  }

  if (pool || (!pool && !ensure)) return pool ?? null;

  if (!blockHeader) return null;

  const reserveAsset = await getOrCreateAsset({
    assetRegistryId: reserveAssetId,
    ensure: true,
    blockHeader,
    ctx,
  });

  const aToken = await getOrCreateAsset({
    assetRegistryId: aTokenId,
    ensure: true,
    blockHeader,
    ctx,
  });

  if (!reserveAsset || !aToken) throw new Error('No asset found for Aavepool');

  const newPool = new Aavepool({
    id: poolId,
    reserveAsset: reserveAsset,
    aToken: aToken,
  });

  await ctx.store.upsert(newPool);

  ctx.batchState.state.aavePools.set(newPool.id, newPool);

  return newPool;
}
