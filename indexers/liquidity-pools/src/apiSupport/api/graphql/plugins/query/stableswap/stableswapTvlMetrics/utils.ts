import type * as pg from 'pg';
import {
  getOmnipoolAssetsAll,
  getOmnipoolAssetsByAssetIds,
} from '../../../../../../sql/omnipool/omnipoolAssets.sql';
import { AppConfig } from '../../../../../../../appConfig';
import { getOmnipoolAssetsTvl } from '../../../../../../sql/omnipool/omnipoolTvl.sql';
import {
  StableswapLatestTvl,
  StableswapsLatestTvlResponseRaw,
} from './resolvers';
import {
  getAllStableswapIds,
  getAssetsByStableswapIds,
} from '../../../../../../sql/stableswap/stableswap.sql';
import { getStableswapsTvl } from '../../../../../../sql/stableswap/stableswapTvl.sql';

export async function handleStableswapsLatestTvlAggregation({
  poolIds = [],
  pgClient,
}: {
  poolIds: string[];
  pgClient: pg.Client;
}): Promise<StableswapLatestTvl[]> {
  let poolIdsToProcess = poolIds;

  if (!poolIdsToProcess || poolIdsToProcess.length === 0)
    poolIdsToProcess = (
      await pgClient.query<{
        pool_id: string;
      }>(getAllStableswapIds)
    ).rows.map((row) => row.pool_id);

  const assetsDataByPool = await pgClient.query<{
    pool_id: string;
    assets: { asset_id: string; asset_registry_id: string; decimals: number }[];
  }>(getAssetsByStableswapIds, [poolIdsToProcess]);

  if (!assetsDataByPool.rows || assetsDataByPool.rows.length === 0) return [];

  const assetsDataByPoolMap = new Map(
    assetsDataByPool.rows.map((poolData) => [
      poolData.pool_id,
      {
        poolId: poolData.pool_id,
        assets: new Map(
          poolData.assets.map((asset) => [asset.asset_id, asset])
        ),
      },
    ])
  );

  const aggregatedTvls = await pgClient.query<StableswapsLatestTvlResponseRaw>(
    getStableswapsTvl,
    [[...assetsDataByPoolMap.keys()]]
  );

  const responseDecorated = aggregatedTvls.rows.map(
    (row) =>
      ({
        poolId: row.pool_id,
        assetsTvl: row.asset_tvls.map((asset) => ({
          assetId: asset.asset_id,
          assetRegistryId: assetsDataByPoolMap
            .get(row.pool_id)!
            .assets.get(asset.asset_id)?.asset_registry_id,
          tvlInRefAssetNorm: asset.tvl_in_ref_asset_norm,
        })),
        tvlTotalInRefAssetNorm: row.tvl_total_in_ref_asset_norm,
        paraBlockHeight: row.para_block_height,
      }) as StableswapLatestTvl
  );

  return responseDecorated;
}
