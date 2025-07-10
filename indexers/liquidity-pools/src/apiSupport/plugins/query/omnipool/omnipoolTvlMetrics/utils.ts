import type * as pg from 'pg';
import {
  getOmnipoolAssetsAll,
  getOmnipoolAssetsByAssetIds,
} from '../../../sql/omnipool/omnipoolAssets.sql';
import { AppConfig } from '../../../../../appConfig';
import { getOmnipoolAssetsTvl } from '../../../sql/omnipool/omnipoolTvl.sql';
import { OmnipoolAssetLatestTvl } from './resolvers';

const appConfig = AppConfig.getInstance();

export async function handleOmnipoolAssetsLatestTvlAggregation({
  assetIds = [],
  pgClient,
}: {
  assetIds: string[];
  pgClient: pg.Client;
}): Promise<OmnipoolAssetLatestTvl[]> {
  const omnipoolAssetsData =
    assetIds.length > 0
      ? await pgClient.query<{
          omnipool_asset_id: string;
          asset_id: string;
          asset_registry_id: string;
          decimals: number;
        }>(getOmnipoolAssetsByAssetIds, [assetIds])
      : await pgClient.query<{
          omnipool_asset_id: string;
          asset_id: string;
          asset_registry_id: string;
          decimals: number;
        }>(getOmnipoolAssetsAll);

  const omnipoolAssetsDataMap = new Map(
    omnipoolAssetsData.rows.map((assetData) => [
      assetData.asset_id,
      {
        omnipoolAssetId: assetData.omnipool_asset_id,
        assetId: assetData.asset_id,
        assetRegistryId: assetData.asset_registry_id,
        decimals: assetData.decimals,
      },
    ])
  );

  if (omnipoolAssetsDataMap.size === 0) return [];

  const aggregatedTvls = await pgClient.query<{
    asset_id: string;
    tvl_in_ref_asset_norm: string;
    para_block_height: number;
  }>(getOmnipoolAssetsTvl, [[...omnipoolAssetsDataMap.keys()]]);

  return aggregatedTvls.rows.map(
    (row) =>
      ({
        assetId: row.asset_id,
        assetRegistryId: omnipoolAssetsDataMap.get(row.asset_id)!
          .assetRegistryId,
        tvlInRefAssetNorm: row.tvl_in_ref_asset_norm,
        paraBlockHeight: row.para_block_height,
      }) as OmnipoolAssetLatestTvl
  );
}
