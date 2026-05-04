import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { Aavepool, Asset } from '../../../../model';
import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { getAavePoolAddress } from '../../../../utils/helpers';
import { batchGetOrCreateAssets } from '../../../assets/asset';

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
  pool = await ctx.storeUtils.findOneWithLogs(
    Aavepool,
    {
      where: { id: poolId },
      relations,
    },
    { className: 'Aavepool' }
  );

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

  const assetsMap = await batchGetOrCreateAssets({
    assetRegistryIds: [reserveAssetId, aTokenId],
    ensure: true,
    blockHeader,
    ctx,
  });

  // Build secondary Map indexed by assetRegistryId for lookup
  // (assetsMap is keyed by Asset.id which may differ from assetRegistryId for ERC20 tokens)
  const assetsByRegistryId = new Map<string, Asset>();
  for (const asset of assetsMap.values()) {
    if (asset.assetRegistryId) {
      assetsByRegistryId.set(asset.assetRegistryId, asset);
    }
  }

  // Validate both assets were found
  if (assetsByRegistryId.size < 2) {
    throw new Error(
      `Missing assets for Aavepool: Expected 2 (reserve: ${reserveAssetId}, aToken: ${aTokenId}), found ${assetsByRegistryId.size}`
    );
  }

  // Extract assets using assetRegistryId lookup
  const reserveAsset = assetsByRegistryId.get(reserveAssetId);
  const aTokenAsset = assetsByRegistryId.get(aTokenId);

  if (!reserveAsset || !aTokenAsset) {
    throw new Error(
      `Failed to retrieve assets for Aavepool: reserve=${!!reserveAsset}, aToken=${!!aTokenAsset}`
    );
  }

  const newPool = new Aavepool({
    id: poolId,
    reserveAssetId: reserveAsset.id, // Use Asset.id, not assetRegistryId
    aTokenId: aTokenAsset.id, // Use Asset.id, not assetRegistryId
  });

  await ctx.store.upsert(newPool);

  ctx.batchState.state.aavePools.set(newPool.id, newPool);

  return newPool;
}
