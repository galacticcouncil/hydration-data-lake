import { AggregationTimeRange, DateTimeHelper } from './index';
import {
  AggregationTimeRangeLabel,
  TimeSeriesBucketTimeRange,
  YieldMetricsInterval,
} from '../types';
import {
  getBlockByTimestampGrtOrEq,
  getBlockByTimestampLtOrEq,
} from '../sql/block.sql';
import type * as pg from 'pg';

export async function getStartStopBlocksFromInput({
  inputStartBlockNumber,
  inputStopBlockNumber,
  inputFromIsoString,
  inputToIsoString,
  period,
  pgClient,
}: {
  inputStartBlockNumber?: number;
  inputStopBlockNumber?: number;
  inputFromIsoString?: string;
  inputToIsoString?: string;
  period?: AggregationTimeRangeLabel;
  pgClient: pg.Client;
}): Promise<{ startBlockHeight: number; stopBlockHeight: number } | null> {
  if (
    !period &&
    inputStartBlockNumber === undefined &&
    inputFromIsoString === undefined
  )
    return null;

  const requestedRange = new AggregationTimeRange(
    period ?? AggregationTimeRangeLabel['1D']
  );

  let startBlockHeight = 0;
  let stopBlockHeight = 0;

  if (inputStartBlockNumber !== undefined && inputStartBlockNumber !== null) {
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
  } else if (
    (inputStartBlockNumber === undefined || inputStartBlockNumber === null) &&
    inputFromIsoString !== undefined &&
    inputFromIsoString !== null &&
    isValidIsoDateTime(inputFromIsoString)
  ) {
    const fromBlock = await pgClient.query(getBlockByTimestampGrtOrEq, [
      new DateTimeHelper(inputFromIsoString).getDateObject(),
    ]);
    const toBlock = await pgClient.query(getBlockByTimestampLtOrEq, [
      inputToIsoString
        ? new DateTimeHelper(inputToIsoString).getDateObject()
        : requestedRange.nowDate,
    ]);

    if (!fromBlock?.rows?.length || !toBlock?.rows?.length) return null;

    startBlockHeight = fromBlock.rows[0].height;
    stopBlockHeight = toBlock.rows[0].height;
  } else {
    const startBlock = await pgClient.query(getBlockByTimestampGrtOrEq, [
      requestedRange.startDate,
    ]);
    const stopBlock = await pgClient.query(getBlockByTimestampLtOrEq, [
      requestedRange.nowDate,
    ]);

    if (!startBlock?.rows?.length || !stopBlock?.rows?.length) return null;

    startBlockHeight = startBlock.rows[0].height;
    stopBlockHeight = stopBlock.rows[0].height;
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
      return AggregationTimeRangeLabel['1D'];
    case YieldMetricsInterval['1W']:
      return AggregationTimeRangeLabel['7D'];
    case YieldMetricsInterval['1MON']:
      return AggregationTimeRangeLabel['30D'];
    case YieldMetricsInterval['1Y']:
      return AggregationTimeRangeLabel['365D'];
    default:
      return AggregationTimeRangeLabel['30D'];
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

/**
 * Validates if the provided value is a valid Unix timestamp (in seconds or milliseconds).
 *
 * @param value - The value to validate
 * @param allowMs - If true, allows millisecond timestamps (default: true)
 * @returns true if the value is a valid timestamp, false otherwise
 */
export function isValidTimestamp(
  value: unknown,
  allowMs: boolean = true
): boolean {
  // Check if value is a number
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return false;
  }

  // Reject negative values
  if (value < 0) {
    return false;
  }

  // Reject zero (epoch start)
  if (value === 0) {
    return false;
  }

  // Check if it's within reasonable bounds
  // Seconds: roughly from 2001 to ~2286
  // Milliseconds: roughly from 2001 to ~2286
  const secondsMin = 978307200; // Jan 1, 2001
  const secondsMax = 9999999999; // Far future in seconds
  const msMin = 978307200000; // Jan 1, 2001 in ms
  const msMax = 9999999999000; // Far future in ms

  if (allowMs) {
    // If value looks like milliseconds (> 10 billion), validate as ms
    if (value > 10000000000) {
      return value >= msMin && value <= msMax;
    }
    // Otherwise validate as seconds
    return value >= secondsMin && value <= secondsMax;
  } else {
    // Only allow seconds
    return value >= secondsMin && value <= secondsMax;
  }
}

/**
 * ISO 8601 DateTime regex pattern (RFC 3339 compliant)
 * Matches: YYYY-MM-DDTHH:mm:ss[.sss]Z
 * Example: 2024-01-15T10:30:45.123Z
 */
const ISO_DATETIME_REGEX =
  /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?([Z])$/;

/**
 * Validates if the provided value is a valid ISO 8601 DateTime string.
 *
 * @param value - The value to validate
 * @returns true if the value is a valid ISO DateTime string, false otherwise
 * @example
 *
 * isValidIsoDateTime('2024-01-15T10:30:45.123Z') // true
 * isValidIsoDateTime('2024-01-15') // false
 * isValidIsoDateTime('2024-01-15T10:30:45') // false
 */
export function isValidIsoDateTime(value: unknown): boolean {
  // Check if value is a string
  if (typeof value !== 'string') {
    return false;
  }

  // Validate against ISO 8601 pattern
  if (!ISO_DATETIME_REGEX.test(value)) {
    return false;
  }

  // Additional validation: ensure the date is parseable and valid
  try {
    const date = new Date(value);
    // Check if date is valid (not NaN)
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}
