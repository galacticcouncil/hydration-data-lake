import type * as pg from 'pg';
import {
  aggregateXykPoolVolumesByBlocksRange,
  getAssetIdsByPoolIds,
} from '../../../sql/xykpool/xykPoolsVolume.sql';
import { XykpoolHistoricalVolumeRaw } from '../../../../types';
import { XykpoolVolumeAggregated } from './resolvers';
import { BigNumber } from '@galacticcouncil/sdk';

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
          assetBId: group[0].asset_b_id,
          assetBAssetRegistryId: group[0].asset_b_registry_id,
          assetAVol: BigInt(0),
          assetBVol: BigInt(0),
          assetAFeeVol: BigInt(0),
          assetBFeeVol: BigInt(0),
          assetAVolNorm: '0',
          assetBVolNorm: '0',
          assetAFeeVolNorm: '0',
          assetBFeeVolNorm: '0',
        };
        // Should not occur in normal conditions because SQL query will return
        // either 2 elements in the group or nothing.
        if (group.length === 1) return resp;

        if (group[0].para_block_height === group[1].para_block_height) {
          resp.assetAVol =
            BigInt(group[0].asset_a_vol_in) + BigInt(group[0].asset_a_vol_out);
          resp.assetBVol =
            BigInt(group[0].asset_b_vol_in) + BigInt(group[0].asset_b_vol_out);
          resp.assetAFeeVol = BigInt(group[0].asset_a_fee_vol);
          resp.assetBFeeVol = BigInt(group[0].asset_b_fee_vol);

          resp.assetAVolNorm = BigNumber(group[0].asset_a_vol_in_norm)
            .plus(group[0].asset_a_vol_out_norm)
            .toFixed();
          resp.assetBVolNorm = BigNumber(group[0].asset_b_vol_in_norm)
            .plus(group[0].asset_b_vol_out_norm)
            .toFixed();
          resp.assetAFeeVolNorm = group[0].asset_a_fee_vol_norm;
          resp.assetBFeeVolNorm = group[0].asset_b_fee_vol_norm;

          return resp;
        }

        resp.assetAVol =
          BigInt(group[1].asset_a_total_vol_in) +
          BigInt(group[1].asset_a_total_vol_out) -
          BigInt(group[0].asset_a_total_vol_in) -
          BigInt(group[0].asset_a_total_vol_out) +
          BigInt(group[0].asset_a_vol_in) +
          BigInt(group[0].asset_a_vol_out);

        resp.assetBVol =
          BigInt(group[1].asset_b_total_vol_in) +
          BigInt(group[1].asset_b_total_vol_out) -
          BigInt(group[0].asset_b_total_vol_in) -
          BigInt(group[0].asset_b_total_vol_out) +
          BigInt(group[0].asset_b_vol_in) +
          BigInt(group[0].asset_b_vol_out);

        resp.assetAFeeVol =
          BigInt(group[1].asset_a_fees_total_vol) -
          BigInt(group[0].asset_a_fees_total_vol) +
          BigInt(group[0].asset_a_fee_vol);

        resp.assetAFeeVol =
          BigInt(group[1].asset_b_fees_total_vol) -
          BigInt(group[0].asset_b_fees_total_vol) +
          BigInt(group[0].asset_b_fee_vol);

        resp.assetAVolNorm = BigNumber(group[1].asset_a_total_vol_in_norm)
          .plus(group[1].asset_a_total_vol_out_norm)
          .minus(group[0].asset_a_total_vol_in_norm)
          .minus(group[0].asset_a_total_vol_out_norm)
          .plus(group[0].asset_a_vol_in_norm)
          .plus(group[0].asset_a_vol_out_norm)
          .toFixed();

        resp.assetBVolNorm = BigNumber(group[1].asset_b_total_vol_in_norm)
          .plus(group[1].asset_b_total_vol_out_norm)
          .minus(group[0].asset_b_total_vol_in_norm)
          .minus(group[0].asset_b_total_vol_out_norm)
          .plus(group[0].asset_b_vol_in_norm)
          .plus(group[0].asset_b_vol_out_norm)
          .toFixed();

        resp.assetAFeeVolNorm = BigNumber(group[1].asset_a_fees_total_vol_norm)
          .minus(group[0].asset_a_fees_total_vol_norm)
          .plus(group[0].asset_a_fee_vol_norm)
          .toFixed();

        resp.assetAFeeVolNorm = BigNumber(group[1].asset_b_fees_total_vol_norm)
          .minus(group[0].asset_b_fees_total_vol_norm)
          .plus(group[0].asset_b_fee_vol_norm)
          .toFixed();

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
      assetAVol: BigInt(0),
      assetBVol: BigInt(0),
      assetAFeeVol: BigInt(0),
      assetBFeeVol: BigInt(0),
      assetAVolNorm: '0',
      assetBVolNorm: '0',
      assetAFeeVolNorm: '0',
      assetBFeeVolNorm: '0',
    });
  }

  return decoratedNodes;
}
