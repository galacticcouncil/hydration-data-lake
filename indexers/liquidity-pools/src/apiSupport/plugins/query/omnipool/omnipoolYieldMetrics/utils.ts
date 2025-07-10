import type * as pg from 'pg';
import { OmnipoolAssetYieldMetricsAggregated } from './resolvers';
import { YieldMetricsInterval } from '../../../../types';
import {
  getPeriodFromInterval,
  getStartStopBlocksFromInput,
} from '../../../../utils/aggregationUtils';
import BigNumber from 'bignumber.js';
import {
  getOmnipoolAssetsAll,
  getOmnipoolAssetsByAssetIds,
} from '../../../sql/omnipool/omnipoolAssets.sql';
import {
  getLatestOmnipoolAssetBalance,
  getOmnipoolAssetSwapFeesByPeriod,
} from '../../../sql/omnipool/omnipoolYieldMetrics.sql';
import { calculateAssetYieldMetrics } from '../../../../utils/math';

export async function handleOmnipoolAssetsYieldMetricsAggregation({
  assetIds = [],
  omnipoolAddress,
  interval,
  pgClient,
}: {
  assetIds: string[];
  omnipoolAddress: string;
  interval: YieldMetricsInterval;
  pgClient: pg.Client;
}): Promise<OmnipoolAssetYieldMetricsAggregated[]> {
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

  const blocksRange = await getStartStopBlocksFromInput({
    period: getPeriodFromInterval(interval),
    pgClient,
  });

  if (!blocksRange) {
    console.log(
      'ERROR: blocksRange in handleOmnipoolAssetsYieldMetricsAggregation can not be found.'
    );
    return [];
  }

  const aggregatedAssetSwapFees = await pgClient.query<{
    asset_id: string;
    total_fee_amount: string;
  }>(getOmnipoolAssetSwapFeesByPeriod, [
    omnipoolAddress,
    [...omnipoolAssetsDataMap.keys()],
    blocksRange.startBlockHeight,
  ]);

  const aggregatedAssetSwapFeesMap = new Map(
    aggregatedAssetSwapFees.rows.map((r) => [r.asset_id, r.total_fee_amount])
  );
  if (aggregatedAssetSwapFeesMap.size === 0) return [];

  const latestBalances = await pgClient.query<{
    asset_id: string;
    free_balance: string;
    asset_hub_reserve: string;
    para_block_height: number;
  }>(getLatestOmnipoolAssetBalance, [[...omnipoolAssetsDataMap.keys()]]);

  const latestBalancesMap = new Map(
    latestBalances.rows.map((r) => [r.asset_id, r])
  );

  if (latestBalancesMap.size === 0) return [];

  const resultMap: Map<string, OmnipoolAssetYieldMetricsAggregated> = new Map();

  omnipoolAssetsDataMap.forEach((assetData, assetId) => {
    const feeAmount = BigNumber(
      aggregatedAssetSwapFeesMap.has(assetId)
        ? aggregatedAssetSwapFeesMap.get(assetId)!
        : '0'
    );

    const tvl = BigNumber(
      latestBalancesMap.has(assetId)
        ? latestBalancesMap.get(assetId)!.free_balance
        : '0'
    );

    const assetYieldMetrics = calculateAssetYieldMetrics({
      feeAmount,
      tvl,
      interval,
    });

    resultMap.set(assetId, {
      assetId,
      assetRegistryId: assetData.assetRegistryId,
      projectedAprPerc: assetYieldMetrics.projectedAprPerc
        .div(2)
        .toFixed(4, BigNumber.ROUND_HALF_UP),
      projectedApyPerc: assetYieldMetrics.projectedApyPerc
        .div(2)
        .toFixed(4, BigNumber.ROUND_HALF_UP),
    });
  });

  return [...resultMap.values()];
}
