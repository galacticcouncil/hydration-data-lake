import { QueryResolverContext } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  StableswapVolumesByPeriodFilter,
  StableswapVolumesByPeriodResponse,
} from './types';
import { handleStableswapHistoricalVolumesByPeriodAggregation } from '../utils';
import { getStartStopBlocksFromInput } from '../../../../utils/aggregationUtils';

export async function stableswapHistoricalVolumesByPeriodResolver(
  parentObject: any,
  args: { filter: StableswapVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<StableswapVolumesByPeriodResponse> {
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
    await handleStableswapHistoricalVolumesByPeriodAggregation({
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
