import type * as pg from 'pg';
import {
  StableswapYieldMetricsAggregated,
  StableswapYieldMetricsRaw,
} from './resolvers';
import {
  getStableswapAssetSwapFeesByPeriod,
  getLatestStableswapAssetBalance,
} from '../../sql/stableswapYieldMetrics.sql';
import { getAssetsByStableswapIds } from '../../sql/stableswap.sql';
import {
  AggregationTimeRangeLabel,
  YieldMetricsInterval,
} from '../../../types';
import {
  getPeriodFromInterval,
  getStartStopBlocksFromInput,
} from '../../../utils/aggregationUtils';
import BigNumber from 'bignumber.js';
import {
  calculateAssetYieldMetrics,
  calculateAverageYieldMetrics,
} from '../../../utils/math';

export async function handlestableswapYieldMetricsAggregation({
  poolIds,
  interval,
  pgClient,
}: {
  poolIds: string[];
  interval: YieldMetricsInterval;
  pgClient: pg.Client;
}): Promise<StableswapYieldMetricsAggregated[]> {
  const assetsDataByPool = await pgClient.query<{
    pool_id: string;
    assets: { asset_id: string; decimals: number }[];
  }>(getAssetsByStableswapIds, [poolIds]);

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

  const blocksRange = await getStartStopBlocksFromInput({
    period: getPeriodFromInterval(interval),
    pgClient,
  });

  if (!blocksRange) {
    console.log(
      'ERROR: blocksRange in handlestableswapYieldMetricsAggregation can not be found.'
    );
    return [];
  }

  const aggregatedAssetSwapFees = await pgClient.query<{
    pool_id: string;
    asset_amounts: { asset_id: string; total_fee_amount: string }[];
  }>(getStableswapAssetSwapFeesByPeriod, [
    JSON.stringify(
      assetsDataByPool.rows.map(({ pool_id, assets }) => ({
        pool_id,
        asset_ids: assets.map((a) => a.asset_id),
      }))
    ),
    blocksRange.startBlockHeight,
  ]);

  if (
    !aggregatedAssetSwapFees.rows ||
    aggregatedAssetSwapFees.rows.length === 0
  )
    return [];

  const aggregatedAssetSwapFeesMap = new Map(
    aggregatedAssetSwapFees.rows.map((r) => [
      r.pool_id,
      new Map(r.asset_amounts.map((a) => [a.asset_id, a])),
    ])
  );

  const latestBalances = await pgClient.query<{
    pool_id: string;
    asset_balances: {
      asset_id: string;
      free_balance: string;
      para_block_height: number;
    }[];
  }>(getLatestStableswapAssetBalance, [poolIds]);

  if (!latestBalances.rows || latestBalances.rows.length === 0) return [];

  const latestBalancesMap = new Map(
    latestBalances.rows.map((r) => [
      r.pool_id,
      new Map(r.asset_balances.map((a) => [a.asset_id, a])),
    ])
  );

  const resultMap: Map<string, StableswapYieldMetricsAggregated> = new Map();

  assetsDataByPoolMap.forEach((poolData, poolId) => {
    const poolYieldMetricsByAsset = [];

    for (const asset of [...poolData.assets.values()]) {
      const feeAmount = BigNumber(
        aggregatedAssetSwapFeesMap.has(poolId) &&
          aggregatedAssetSwapFeesMap.get(poolId)!.has(asset.asset_id)
          ? aggregatedAssetSwapFeesMap.get(poolId)!.get(asset.asset_id)!
              .total_fee_amount
          : '0'
      );

      const tvl = BigNumber(
        latestBalancesMap.has(poolId) &&
          latestBalancesMap.get(poolId)!.has(asset.asset_id)
          ? latestBalancesMap.get(poolId)!.get(asset.asset_id)!.free_balance
          : '0'
      );

      poolYieldMetricsByAsset.push(
        calculateAssetYieldMetrics({
          feeAmount,
          tvl,
          interval,
        })
      );
    }

    const avrMetrics = calculateAverageYieldMetrics(poolYieldMetricsByAsset);

    resultMap.set(poolId, {
      poolId,
      projectedAprPerc: avrMetrics.projectedAprPerc.toFixed(
        4,
        BigNumber.ROUND_HALF_UP
      ),
      projectedApyPerc: avrMetrics.projectedApyPerc.toFixed(
        4,
        BigNumber.ROUND_HALF_UP
      ),
    });
  });

  return [...resultMap.values()];
}
