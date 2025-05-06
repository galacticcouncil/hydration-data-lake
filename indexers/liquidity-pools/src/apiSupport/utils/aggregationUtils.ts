import { AggregationTimeRange } from './index';
import { AggregationTimeRangeLabel, YieldMetricsInterval } from '../types';
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