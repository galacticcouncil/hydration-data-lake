import { QueryResolverContext } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  StableswapVolumesByPeriodFilter,
  StableswapVolumesByPeriodResponse,
} from './types';
import { handleStableswapHistoricalVolumesByPeriodAggregation } from '../utils';

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
    filter: { poolIds, startBlockNumber, endBlockNumber },
  } = args;

  const decoratedNodes =
    await handleStableswapHistoricalVolumesByPeriodAggregation({
      poolIds,
      startBlockNumber,
      endBlockNumber,
      pgClient,
    });

  return {
    nodes: [...decoratedNodes.values()],
    totalCount: decoratedNodes.size,
  };
}
