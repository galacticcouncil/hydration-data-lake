import {
  AggregationTimeRangeLabel,
  QueryResolverContext,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  SwapAssetFeesByPeriodFilter,
  SwapAssetFeesByPeriodResponse,
} from './types';
import { handleSwapAssetFeesByPeriodAggregation } from '../utils';
import { AggregationTimeRange } from '../../../../utils';
import {
  getBlockByTimestampGrtOrEq,
  getBlockByTimestampLtOrEq,
} from '../../../sql/block.sql';

export async function swapAssetFeesByPeriodResolver(
  parentObject: any,
  args: { filter: SwapAssetFeesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<SwapAssetFeesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: { period, startBlockNumber, endBlockNumber },
  } = args;

  const response = {
    nodes: [],
    totalCount: 0,
  };

  if (!period && startBlockNumber === undefined) return response;

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

    if (!startBlock?.rows?.length || !stopBlock?.rows?.length) return response;

    startBlockHeight = startBlock.rows[0].height;
    stopBlockHeight = stopBlock.rows[0].height;
  } else {
    startBlockHeight = startBlockNumber ?? 0;
    if (!endBlockNumber) {
      const stopBlock = await pgClient.query(getBlockByTimestampLtOrEq, [
        requestedRange.nowDate,
      ]);

      if (!stopBlock?.rows?.length) return response;
      stopBlockHeight = stopBlock.rows[0].height;
    } else {
      stopBlockHeight = endBlockNumber;
    }
  }

  const decoratedNodes = await handleSwapAssetFeesByPeriodAggregation({
    startBlockHeight,
    stopBlockHeight,
    pgClient,
  });

  return {
    nodes: decoratedNodes,
    totalCount: decoratedNodes.length,
  };
}
