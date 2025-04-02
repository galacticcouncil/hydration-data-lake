import { AggregationTimeRange } from './index';
import { AggregationTimeRangeLabel } from '../types';
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
