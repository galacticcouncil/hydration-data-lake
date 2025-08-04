import {
  AggregationTimeRangeLabel,
  QueryResolverContext,
  YieldMetricsInterval,
} from '../../../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  StableswapVolumeHistoricalDataByPeriodFilter,
  StableswapVolumeHistoricalDataByPeriodResponse,
} from './types';
import { handleStableswapHistoricalVolumesByPeriodAggregation } from '../utils';
import { getStartStopBlocksFromInput } from '../../../../../../../utils/aggregationUtils';

export async function stableswapHistoricalVolumesByPeriodResolver(
  parentObject: any,
  args: { filter: StableswapVolumeHistoricalDataByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<StableswapVolumeHistoricalDataByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  // const {
  //   filter: { poolIds, startBlockNumber, endBlockNumber, period },
  // } = args;

  const filter = args.filter || {
    period: AggregationTimeRangeLabel['24H'],
  };

  const blocksRange = await getStartStopBlocksFromInput({
    period: filter.period,
    pgClient,
    inputStopBlockNumber: filter.endBlockNumber,
    inputStartBlockNumber: filter.startBlockNumber,
  });

  if (!blocksRange) return { nodes: [], totalCount: 0 };

  const decoratedNodes =
    await handleStableswapHistoricalVolumesByPeriodAggregation({
      poolIds: filter.poolIds,
      startBlockNumber: blocksRange.startBlockHeight,
      endBlockNumber: blocksRange.stopBlockHeight,
      pgClient,
    });

  return {
    nodes: [...decoratedNodes.values()],
    totalCount: decoratedNodes.size,
  };
}
