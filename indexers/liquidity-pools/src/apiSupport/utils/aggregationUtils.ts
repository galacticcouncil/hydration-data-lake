import { AggregationTimeRange } from './index';
import {
  AggregationTimeRangeLabel,
  TimeSeriesBucketTimeRange,
  YieldMetricsInterval,
} from '../types';
import {
  getBlockByTimestampGrtOrEq,
  getBlockByTimestampLtOrEq,
} from '../plugins/sql/block.sql';
import type * as pg from 'pg';

export async function getStartStopBlocksFromInput({
  inputStartBlockNumber,
  inputStopBlockNumber,
  period,
  pgClient,
}: {
  inputStartBlockNumber?: number;
  inputStopBlockNumber?: number;
  period?: AggregationTimeRangeLabel;
  pgClient: pg.Client;
}): Promise<{ startBlockHeight: number; stopBlockHeight: number } | null> {
  if (!period && inputStartBlockNumber === undefined) return null;

  const requestedRange = new AggregationTimeRange(
    period ?? AggregationTimeRangeLabel['24H']
  );

  let startBlockHeight = 0;
  let stopBlockHeight = 0;

  if (period) {
    const startBlock = await pgClient.query(getBlockByTimestampGrtOrEq, [
      requestedRange.startDate,
    ]);
    const stopBlock = await pgClient.query(getBlockByTimestampLtOrEq, [
      requestedRange.nowDate,
    ]);

    if (!startBlock?.rows?.length || !stopBlock?.rows?.length) return null;

    startBlockHeight = startBlock.rows[0].height;
    stopBlockHeight = stopBlock.rows[0].height;
  } else {
    startBlockHeight = inputStartBlockNumber ?? 0;
    if (!inputStopBlockNumber) {
      const stopBlock = await pgClient.query(getBlockByTimestampLtOrEq, [
        requestedRange.nowDate,
      ]);

      if (!stopBlock?.rows?.length) return null;
      stopBlockHeight = stopBlock.rows[0].height;
    } else {
      stopBlockHeight = inputStopBlockNumber;
    }
  }

  return {
    startBlockHeight,
    stopBlockHeight,
  };
}

export function getPeriodFromInterval(
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

export function getPeriodsNumberFromInterval(interval: YieldMetricsInterval) {
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
 * Returns number of milliseconds in a selected period.
 * Default value is _1H_.
 * @param range
 */
export function getBucketSizeMsFromAssetsPairPriceTimeRange(
  range: TimeSeriesBucketTimeRange
): number {
  switch (range) {
    case TimeSeriesBucketTimeRange['_NONE_']:
      return 1000;
    case TimeSeriesBucketTimeRange['_1S_']:
      return 1000;
    case TimeSeriesBucketTimeRange['_15S_']:
      return 1000 * 15;
    case TimeSeriesBucketTimeRange['_1M_']:
      return 1000 * 60;
    case TimeSeriesBucketTimeRange['_5M_']:
      return 1000 * 60 * 5;
    case TimeSeriesBucketTimeRange['_15M_']:
      return 1000 * 60 * 15;
    case TimeSeriesBucketTimeRange['_30M_']:
      return 1000 * 60 * 30;
    case TimeSeriesBucketTimeRange['_1H_']:
      return 1000 * 60 * 60;
    case TimeSeriesBucketTimeRange['_4H_']:
      return 1000 * 60 * 60 * 4;
    case TimeSeriesBucketTimeRange['_1D_']:
      return 1000 * 60 * 60 * 24;
    case TimeSeriesBucketTimeRange['_7D_']:
      return 1000 * 60 * 60 * 24 * 7;
    case TimeSeriesBucketTimeRange['_30D_']:
      return 1000 * 60 * 60 * 24 * 30;
    default:
      return 1000 * 60 * 60;
  }
}
