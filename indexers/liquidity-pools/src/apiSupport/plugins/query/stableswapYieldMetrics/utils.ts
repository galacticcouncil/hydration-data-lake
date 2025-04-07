import type * as pg from 'pg';
import {
  StableswapYieldMetricsAggregated,
  StableswapYieldMetricsRaw,
} from './resolvers';
import {
  getAssetSwapFeesByPeriod,
  getLatestStableswapAssetBalance,
} from '../../sql/stableswapYieldMetrics.sql';
import { getAssetsByStableswapIds } from '../../sql/stableswap.sql';
import {
  AggregationTimeRangeLabel,
  YieldMetricsInterval,
} from '../../../types';
import { getStartStopBlocksFromInput } from '../../../utils/aggregationUtils';
import BigNumber from 'bignumber.js';

function getPeriodFromInterval(
  interval: YieldMetricsInterval
): AggregationTimeRangeLabel {
  switch (interval) {
    case YieldMetricsInterval['1D']:
      return AggregationTimeRangeLabel['24H'];
    case YieldMetricsInterval['1W']:
      return AggregationTimeRangeLabel['1W'];
    case YieldMetricsInterval['1MON']:
      return AggregationTimeRangeLabel['1M'];
    case YieldMetricsInterval['1Y']:
      return AggregationTimeRangeLabel['1Y'];
    default:
      return AggregationTimeRangeLabel['1M'];
  }
}

function getPeriodsNumberFromInterval(interval: YieldMetricsInterval) {
  switch (interval) {
    case YieldMetricsInterval['1D']:
      return 365;
    case YieldMetricsInterval['1W']:
      return 52;
    case YieldMetricsInterval['1MON']:
      return 12;
    case YieldMetricsInterval['1Y']:
      return 1;
    default:
      return 12;
  }
}

/**
 * Calculates yield metrics for a stableswap pair based on the provided fee amount, total value locked (TVL),
 * and interval for yield calculation.
 *
 * Notice: returns metrics as represents but not in decimal form.
 *
 */
function calcYieldMetrics({
  feeAmount,
  tvl,
  interval,
}: {
  feeAmount: BigNumber;
  tvl: BigNumber;
  interval: YieldMetricsInterval;
}): StableswapYieldMetricsRaw {
  if (tvl.isZero()) {
    throw new Error('TVL cannot be zero.');
  }

  const feeYieldPerPeriod = feeAmount.div(tvl);

  return {
    projectedAprPerc: feeYieldPerPeriod
      .multipliedBy(getPeriodsNumberFromInterval(interval))
      .multipliedBy(100),
    projectedApyPerc: new BigNumber(1)
      .plus(feeYieldPerPeriod)
      .pow(getPeriodsNumberFromInterval(interval))
      .minus(1)
      .multipliedBy(100),
  };
}

function getAverageYieldMetrics(
  data: StableswapYieldMetricsRaw[]
): StableswapYieldMetricsRaw {
  const avrMetrics = {
    projectedAprPerc: new BigNumber(0),
    projectedApyPerc: new BigNumber(0),
  };

  data.forEach((assetData) => {
    avrMetrics.projectedAprPerc = avrMetrics.projectedAprPerc.plus(
      assetData.projectedAprPerc
    );
    avrMetrics.projectedApyPerc = avrMetrics.projectedApyPerc.plus(
      assetData.projectedApyPerc
    );
  });

  return {
    projectedAprPerc: avrMetrics.projectedAprPerc.div(data.length),
    projectedApyPerc: avrMetrics.projectedApyPerc.div(data.length),
  };
}

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
  }>(getAssetSwapFeesByPeriod, [
    JSON.stringify(
      assetsDataByPool.rows.map(({ pool_id, assets }) => ({
        pool_id,
        asset_ids: assets.map((a) => a.asset_id),
      }))
    ),
    blocksRange.startBlockHeight,
  ]);

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
      poolYieldMetricsByAsset.push(
        calcYieldMetrics({
          feeAmount: BigNumber(
            aggregatedAssetSwapFeesMap.get(poolId)!.get(asset.asset_id)!
              .total_fee_amount
          ),
          tvl: BigNumber(
            latestBalancesMap.get(poolId)!.get(asset.asset_id)!.free_balance
          ),
          interval,
        })
      );
    }

    const avrMetrics = getAverageYieldMetrics(poolYieldMetricsByAsset);

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
