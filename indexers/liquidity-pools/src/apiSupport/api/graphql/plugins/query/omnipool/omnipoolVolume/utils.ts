import type * as pg from 'pg';
import { OmnipoolAssetVolumeAggregated } from './resolvers';
import {
  getAllOmnipoolAssets,
  getOmnipoolAssetsByAssetIds,
  getOmnipoolAssetsByAssetRegistryIds,
} from '../../../../../../sql/omnipool/omnipoolAssets.sql';
import { aggregateOmnipoolAssetsVolumesByBlocksRange } from '../../../../../../sql/omnipool/omnipoolAssetsVolume.sql';
import { OmnipoolAssetHistoricalVolumeRaw } from '../../../../../../types';
import { BigNumber } from '@galacticcouncil/sdk';

export async function handleOmnipoolAssetHistoricalVolumesByPeriodAggregation({
  omnipoolAddress,
  assetIds: assetIdsFilter,
  assetRegistryIds: assetRegistryIdsFilter,
  startBlockNumber,
  endBlockNumber: endBlockNumberFilter,
  pgClient,
}: {
  omnipoolAddress: string;
  assetIds?: string[];
  assetRegistryIds?: string[];
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

  if (
    (!assetIdsFilter || assetIdsFilter.length === 0) &&
    !!assetRegistryIdsFilter &&
    assetRegistryIdsFilter.length > 0
  ) {
    const ominipoolAssetsByAssetRegistryIds = await pgClient.query<{
      omnipool_asset_id: string;
    }>(getOmnipoolAssetsByAssetRegistryIds, [assetRegistryIdsFilter]);

    omnipoolAssetIds = ominipoolAssetsByAssetRegistryIds.rows.map(
      (omniAsset) => omniAsset.omnipool_asset_id
    );
  }

  if (!omnipoolAssetIds || omnipoolAssetIds.length === 0) {
    const allOminipoolAssetsForBlocksRange = await pgClient.query<{
      id: string;
    }>(getAllOmnipoolAssets, [omnipoolAddress]);

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
          assetRegistryId: group[0].asset_registry_id,
          assetVol: BigInt(0),
          assetFeeVol: BigInt(0),
          assetVolNormalized: '0',
          assetFeeVolNormalized: '0',
        };

        // Should not occur in normal conditions because SQL query will return
        // either 2 elements in the group or nothing.
        if (group.length === 1) return resp;

        if (group[0].para_block_height === group[1].para_block_height) {
          resp.assetVol =
            BigInt(group[0].asset_vol_in) + BigInt(group[0].asset_vol_out);
          resp.assetFeeVol = BigInt(group[0].asset_fee_vol);

          resp.assetVolNormalized = BigNumber(group[0].asset_vol_in_norm)
            .plus(group[0].asset_vol_out_norm)
            .toFixed();
          resp.assetFeeVolNormalized = group[0].asset_fee_vol_norm;

          return resp;
        }

        resp.assetVol =
          BigInt(group[1].asset_total_vol_in) +
          BigInt(group[1].asset_total_vol_out) -
          BigInt(group[0].asset_total_vol_in) -
          BigInt(group[0].asset_total_vol_out) +
          BigInt(group[0].asset_vol_in) +
          BigInt(group[0].asset_vol_out);

        resp.assetFeeVol =
          BigInt(group[1].asset_total_fees_vol) -
          BigInt(group[0].asset_total_fees_vol);

        resp.assetVolNormalized = BigNumber(group[1].asset_total_vol_in_norm)
          .plus(group[1].asset_total_vol_out_norm)
          .minus(group[0].asset_total_vol_in_norm)
          .minus(group[0].asset_total_vol_out_norm)
          .plus(group[0].asset_vol_in_norm)
          .plus(group[0].asset_vol_out_norm)
          .toFixed();

        resp.assetFeeVolNormalized = BigNumber(
          group[1].asset_total_fees_vol_norm
        )
          .minus(group[0].asset_total_fees_vol_norm)
          .toFixed();

        return resp;
      })
      .map((r: OmnipoolAssetVolumeAggregated) => [r.omnipoolAssetId, r])
  );

  const omnipoolAssetIdsWithoutResultsList = omnipoolAssetIds.filter(
    (id) => !decoratedNodes.has(id)
  );

  const assetWithoutResultsDetails = new Map(
    (
      await pgClient.query<{
        omnipool_asset_id: string;
        asset_id: string;
        asset_registry_id?: string;
        decimals?: number;
      }>(getOmnipoolAssetsByAssetIds, [
        omnipoolAssetIdsWithoutResultsList.map((omAs) => omAs.split('-')[1]),
      ])
    ).rows.map((a) => [a.omnipool_asset_id, a])
  );

  for (const omnipoolAssetIdWithNoResult of omnipoolAssetIdsWithoutResultsList.filter(
    (a) => assetWithoutResultsDetails.has(a)
  )) {
    decoratedNodes.set(omnipoolAssetIdWithNoResult, {
      omnipoolAssetId: omnipoolAssetIdWithNoResult,
      assetId: omnipoolAssetIdWithNoResult.split('-')[1] || '-1',
      assetRegistryId: assetWithoutResultsDetails.get(
        omnipoolAssetIdWithNoResult
      )?.asset_registry_id,
      assetVol: BigInt(0),
      assetFeeVol: BigInt(0),
      assetVolNormalized: '0',
      assetFeeVolNormalized: '0',
    });
  }

  return decoratedNodes;
}
