import type * as pg from 'pg';
import { OmnipoolAssetVolumeAggregated } from './resolvers';
import { getAllOmnipoolAssets } from '../../sql/omnipoolAssets.sql';
import { aggregateOmnipoolAssetsVolumesByBlocksRange } from '../../sql/omnipoolAssetsVolume.sql';
import { OmnipoolAssetHistoricalVolumeRaw } from '../../../types';

export async function handleOmnipoolAssetHistoricalVolumesByPeriodAggregation({
  omnipoolAddress,
  assetIds: assetIdsFilter,
  startBlockNumber,
  endBlockNumber: endBlockNumberFilter,
  pgClient,
}: {
  omnipoolAddress: string;
  assetIds?: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
  pgClient: pg.Client;
}): Promise<Map<string, OmnipoolAssetVolumeAggregated>> {
  const squidStatus = (
    await pgClient.query(`SELECT height FROM squid_processor.status`)
  ).rows[0];

  const endBlockNumber = endBlockNumberFilter ?? squidStatus.height;

  let omnipoolAssetIds = (assetIdsFilter || []).map(
    (assetId) => `${omnipoolAddress}-${assetId}`
  );

  if (!omnipoolAssetIds) {
    const allOminipoolAssetsForBlocksRange = await pgClient.query<{
      id: string;
    }>(getAllOmnipoolAssets, [omnipoolAddress, endBlockNumber]);

    omnipoolAssetIds = allOminipoolAssetsForBlocksRange.rows
      .map((row) => row.id)
      .filter((id) => id !== `${omnipoolAddress}-1`);
  }

  const groupedResult = await pgClient.query(
    aggregateOmnipoolAssetsVolumesByBlocksRange,
    [omnipoolAssetIds, startBlockNumber, endBlockNumber]
  );

  const decoratedNodes = new Map<string, OmnipoolAssetVolumeAggregated>(
    groupedResult.rows
      .map((item) => item.grouped_result.flat())
      .map((group: Array<OmnipoolAssetHistoricalVolumeRaw>) => {
        const resp: OmnipoolAssetVolumeAggregated = {
          omnipoolAssetId: group[0].omnipool_asset_id,
          assetId: group[0].omnipool_asset_id.split('-')[1],
          assetVolume: BigInt(0),
          assetFeeVolume: BigInt(0),
        };

        // Should not occur in normal conditions because SQL query will return
        // either 2 elements in the group or nothing.
        if (group.length === 1) return resp;

        if (group[0].para_block_height === group[1].para_block_height) {
          resp.assetVolume =
            BigInt(group[0].asset_vol_in) +
            BigInt(group[0].asset_vol_out);
          resp.assetFeeVolume = BigInt(group[0].asset_fee_vol);
          return resp;
        }

        resp.assetVolume =
          BigInt(group[1].asset_total_vol_in) +
          BigInt(group[1].asset_total_vol_out) -
          BigInt(group[0].asset_total_vol_in) -
          BigInt(group[0].asset_total_vol_out) +
          BigInt(group[0].asset_vol_in) +
          BigInt(group[0].asset_vol_out);

        resp.assetFeeVolume =
          BigInt(group[1].asset_total_fees_vol) - BigInt(group[0].asset_total_fees_vol);
        return resp;
      })
      .map((r: OmnipoolAssetVolumeAggregated) => [r.omnipoolAssetId, r])
  );

  for (const assetIdWithNoResult of omnipoolAssetIds.filter(
    (id) => !decoratedNodes.has(id)
  )) {
    decoratedNodes.set(assetIdWithNoResult, {
      omnipoolAssetId: assetIdWithNoResult,
      assetId: assetIdWithNoResult.split('-')[1] || '-1',
      assetVolume: BigInt(0),
      assetFeeVolume: BigInt(0),
    });
  }

  return decoratedNodes;
}
