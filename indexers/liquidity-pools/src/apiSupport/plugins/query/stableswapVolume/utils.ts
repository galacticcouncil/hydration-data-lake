import type * as pg from 'pg';
import {
  AggregateStablepoolVolumesByBlocksRangeSqlResult,
  StableswapVolumeAggregated,
} from './resolvers';
import { aggregateStablepoolVolumesByBlocksRange } from '../../sql/stableswapVolumes.sql';
import { getAssetsByStableswapIds } from '../../sql/stableswap.sql';

export async function handleStableswapHistoricalVolumesByPeriodAggregation({
  poolIds,
  startBlockNumber,
  endBlockNumber,
  pgClient,
}: {
  poolIds: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
  pgClient: pg.Client;
}): Promise<Map<string, StableswapVolumeAggregated>> {
  const squidStatus = (
    await pgClient.query(`SELECT height FROM squid_processor.status`)
  ).rows[0];

  const groupedResult =
    await pgClient.query<AggregateStablepoolVolumesByBlocksRangeSqlResult>(
      aggregateStablepoolVolumesByBlocksRange,
      [poolIds, startBlockNumber, endBlockNumber ?? squidStatus.height]
    );

  const decoratedNodes = new Map<string, StableswapVolumeAggregated>(
    groupedResult.rows
      .map((item) => item.grouped_result[0] ?? null)
      .filter((g) => !!g)
      .map((group) => {
        const resp: StableswapVolumeAggregated = {
          poolId: group.pool_id,
          assetVolumes: [],
        };

        if (
          group.start_entity.para_block_height ===
          group.end_entity.para_block_height
        ) {
          resp.assetVolumes = group.start_entity_asset_volumes.map(
            (assetData) => ({
              assetId: assetData.asset_id,
              assetRegistryId: assetData.asset_registry_id ?? null,
              assetFeeVol: BigInt(assetData.asset_fee_vol),
              assetVol:
                BigInt(assetData.asset_vol_in) +
                BigInt(assetData.asset_vol_out),
            })
          );
          return resp;
        }

        const endEntityAssetsMap = new Map(
          group.end_entity_asset_volumes.map((vol) => [vol.asset_id, vol])
        );

        for (const startEntityAssetVol of group.start_entity_asset_volumes) {
          const endEntityAssetVol = endEntityAssetsMap.get(
            startEntityAssetVol.asset_id
          )!;
          resp.assetVolumes.push({
            assetId: startEntityAssetVol.asset_id,
            assetRegistryId: startEntityAssetVol.asset_registry_id ?? null,
            assetFeeVol:
              BigInt(endEntityAssetVol.asset_fees_total_vol) -
              BigInt(startEntityAssetVol.asset_fees_total_vol) +
              BigInt(startEntityAssetVol.asset_fee_vol),
            assetVol:
              BigInt(endEntityAssetVol.asset_total_vol_in) +
              BigInt(endEntityAssetVol.asset_total_vol_out) -
              BigInt(startEntityAssetVol.asset_total_vol_in) -
              BigInt(startEntityAssetVol.asset_total_vol_out) +
              BigInt(startEntityAssetVol.asset_vol_in) +
              BigInt(startEntityAssetVol.asset_vol_out),
          });
        }

        return resp;
      })
      .map((r: StableswapVolumeAggregated) => [r.poolId, r])
  );

  const assetsData = await pgClient.query(getAssetsByStableswapIds, [
    poolIds.filter((id) => !decoratedNodes.has(id)),
  ]);

  for (const poolWithNoResult of assetsData.rows) {
    decoratedNodes.set(poolWithNoResult.pool_id, {
      poolId: poolWithNoResult.pool_id,
      assetVolumes: poolWithNoResult.assets.map(
        (asset: { asset_id: string; asset_registry_id: string }) => ({
          assetId: asset.asset_id,
          assetRegistryId: asset.asset_registry_id,
          assetFeeVol: BigInt(0),
          assetVol: BigInt(0),
        })
      ),
    });
  }

  return decoratedNodes;
}
