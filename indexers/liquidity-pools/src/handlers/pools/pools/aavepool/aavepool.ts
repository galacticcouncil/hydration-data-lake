import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { Aavepool } from '../../../../model';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../../../processor';
import { getAavePoolAddress } from '../../../../utils/helpers';

export async function getOrCreateAavepool({
  reserveAssetId,
  aTokenId,
  ensure = false,
  blockHeader,
  ctx,
  relations = {},
}: {
  reserveAssetId: string;
  aTokenId: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  ctx: SqdProcessorContext<Store>;
  relations?: FindOptionsRelations<Aavepool>;
}): Promise<Aavepool | null> {
  const batchState = ctx.batchState.state;

  if (!reserveAssetId && !aTokenId)
    throw new Error('No asset ID provided in Aavepool');

  const poolId = getAavePoolAddress(reserveAssetId, aTokenId);

  let pool = batchState.aavePools.get(poolId);
  if (pool) return pool;
  pool = await ctx.storeUtils.findOneWithLogs(Aavepool, {
    where: { id: poolId },
    relations,
  }, { className: 'Aavepool' });

  if (pool) {
    ctx.batchState.state.aavePools.set(pool.id, pool);
    return pool;
  }

  if (pool || (!pool && !ensure)) return pool ?? null;

  if (!blockHeader) {
    console.log(
      `getOrCreateAavepool :: no blockHeader provided for pool ${poolId}`
    );
    return null;
  }

  if (!reserveAssetId || !aTokenId) throw new Error('No asset found for Aavepool');

  const newPool = new Aavepool({
    id: poolId,
    reserveAssetId,
    aTokenId,
  });

  await ctx.store.upsert(newPool);

  ctx.batchState.state.aavePools.set(newPool.id, newPool);

  return newPool;
}
