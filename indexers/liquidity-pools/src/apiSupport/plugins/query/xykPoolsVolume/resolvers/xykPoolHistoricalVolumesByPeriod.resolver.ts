import {
  AggregationTimeRangeLabel,
  QueryResolverContext,
  XykpoolHistoricalVolumeRaw,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import { handleXykPoolHistoricalVolumesByPeriodAggregation } from '../utils';
import {
  XykPoolVolumesByPeriodFilter,
  XykPoolVolumesByPeriodResponse,
} from './types';
import { AggregationTimeRange } from '../../../../utils';
import {
  getBlockByTimestampGrtOrEq,
  getBlockByTimestampLtOrEq,
} from '../../../sql/block.sql';
import { getStartStopBlocksFromInput } from '../../../../utils/aggregationUtils';

export async function xykPoolHistoricalVolumesByPeriodResolver(
  parentObject: any,
  args: { filter: XykPoolVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<XykPoolVolumesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: { poolIds, startBlockNumber, endBlockNumber, period },
  } = args;

  const blocksRange = await getStartStopBlocksFromInput({
    period,
    pgClient,
    inputStopBlockNumber: endBlockNumber,
    inputStartBlockNumber: startBlockNumber,
  });

  if (!blocksRange) return { nodes: [], totalCount: 0 };

  const decoratedNodes =
    await handleXykPoolHistoricalVolumesByPeriodAggregation({
      poolIds,
      startBlockNumber: blocksRange.startBlockHeight,
      endBlockNumber: blocksRange.stopBlockHeight,
      pgClient,
    });

  return {
    nodes: [...decoratedNodes.values()],
    totalCount: decoratedNodes.size,
  };
}
