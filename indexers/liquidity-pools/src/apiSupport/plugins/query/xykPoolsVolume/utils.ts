import type * as pg from 'pg';
import {
  aggregateXykPoolVolumesByBlocksRange,
  getAssetIdsByPoolIds,
} from '../../sql/xykPoolsVolume.sql';
import { XykpoolHistoricalVolumeRaw } from '../../../types';
import { XykpoolVolumeAggregated } from './resolvers';

export async function handleXykPoolHistoricalVolumesByPeriodAggregation({
  poolIds,
  startBlockNumber,
  endBlockNumber,
  pgClient,
}: {
  poolIds: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
  pgClient: pg.Client;
}): Promise<Map<string, XykpoolVolumeAggregated>> {
  const squidStatus = (
    await pgClient.query(`SELECT height FROM squid_processor.status`)
  ).rows[0];

  const groupedResult = await pgClient.query(
    aggregateXykPoolVolumesByBlocksRange,
    [poolIds, startBlockNumber, endBlockNumber ?? squidStatus.height]
  );

  const decoratedNodes = new Map<string, XykpoolVolumeAggregated>(
    groupedResult.rows
      .map((item) => item.grouped_result.flat())
      .map((group: Array<XykpoolHistoricalVolumeRaw>) => {
        const resp: XykpoolVolumeAggregated = {
          poolId: group[0].pool_id,
          assetAId: group[0].asset_a_id,
          assetAAssetRegistryId: group[0].asset_a_registry_id,
          assetAVolume: BigInt(0),
          assetBId: group[0].asset_b_id,
          assetBAssetRegistryId: group[0].asset_b_registry_id,
          assetBVolume: BigInt(0),
        };
        // Should not occur in normal conditions because SQL query will return
        // either 2 elements in the group or nothing.
        if (group.length === 1) return resp;

        if (group[0].para_block_height === group[1].para_block_height) {
          resp.assetAVolume =
            BigInt(group[0].asset_a_volume_in) +
            BigInt(group[0].asset_a_volume_out);
          resp.assetBVolume =
            BigInt(group[0].asset_b_volume_in) +
            BigInt(group[0].asset_b_volume_out);

          return resp;
        }

        resp.assetAVolume =
          BigInt(group[1].asset_a_total_volume_in) +
          BigInt(group[1].asset_a_total_volume_out) -
          BigInt(group[0].asset_a_total_volume_in) -
          BigInt(group[0].asset_a_total_volume_out) +
          BigInt(group[0].asset_a_volume_in) +
          BigInt(group[0].asset_a_volume_out);

        resp.assetBVolume =
          BigInt(group[1].asset_b_total_volume_in) +
          BigInt(group[1].asset_b_total_volume_out) -
          BigInt(group[0].asset_b_total_volume_in) -
          BigInt(group[0].asset_b_total_volume_out) +
          BigInt(group[0].asset_b_volume_in) +
          BigInt(group[0].asset_b_volume_out);
        return resp;
      })
      .map((r: XykpoolVolumeAggregated) => [r.poolId, r])
  );

  const assetsData = await pgClient.query(getAssetIdsByPoolIds, [
    poolIds.filter((id) => !decoratedNodes.has(id)),
  ]);

  for (const poolWithAssetsData of assetsData.rows) {
    decoratedNodes.set(poolWithAssetsData.id, {
      poolId: poolWithAssetsData.id,
      assetAId: poolWithAssetsData.asset_a_id,
      assetBId: poolWithAssetsData.asset_b_id,
      assetAAssetRegistryId: poolWithAssetsData.asset_a_registry_id,
      assetBAssetRegistryId: poolWithAssetsData.asset_b_registry_id,
      assetAVolume: BigInt(0),
      assetBVolume: BigInt(0),
    });
  }

  return decoratedNodes;
}
