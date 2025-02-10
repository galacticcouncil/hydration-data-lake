import type * as pg from 'pg';
import {
  AggregateStablepoolVolumesByBlocksRangeSqlResult,
  StableswapVolumeAggregated,
} from './resolvers';
import {
  aggregateStablepoolVolumesByBlocksRange,
  getAssetIdsByStableswapIds,
} from '../../sql/stableswapVolumes.sql';

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
              assetId: +assetData.asset_id,
              swapFee: BigInt(assetData.swap_fee),
              swapVolume:
                BigInt(assetData.swap_volume_in) +
                BigInt(assetData.swap_volume_out),
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
            assetId: +startEntityAssetVol.asset_id,
            swapFee:
              BigInt(endEntityAssetVol.swap_total_fees) -
              BigInt(startEntityAssetVol.swap_total_fees) +
              BigInt(startEntityAssetVol.swap_fee),
            swapVolume:
              BigInt(endEntityAssetVol.swap_total_volume_in) +
              BigInt(endEntityAssetVol.swap_total_volume_out) -
              BigInt(startEntityAssetVol.swap_total_volume_in) -
              BigInt(startEntityAssetVol.swap_total_volume_out) +
              BigInt(startEntityAssetVol.swap_volume_in) +
              BigInt(startEntityAssetVol.swap_volume_out),
          });
        }

        return resp;
      })
      .map((r: StableswapVolumeAggregated) => [r.poolId, r])
  );

  const assetsData = await pgClient.query(getAssetIdsByStableswapIds, [
    poolIds.filter((id) => !decoratedNodes.has(id)),
  ]);

  for (const poolWithNoResult of assetsData.rows) {
    decoratedNodes.set(poolWithNoResult.pool_id, {
      poolId: poolWithNoResult.pool_id,
      assetVolumes: poolWithNoResult.assets.map((assetId: string) => ({
        assetId: +assetId,
        swapFee: BigInt(0),
        swapVolume: BigInt(0),
      })),
    });
  }

  return decoratedNodes;
}
