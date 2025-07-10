import { QueryResolverContext, YieldMetricsInterval } from '../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  StableswapYieldMetricsFilter,
  StableswapYieldMetricsResponse,
} from './types';
import { handlestableswapYieldMetricsAggregation } from '../utils';
import * as crypto from 'node:crypto';
import { CacheManager } from '../../../../../utils/cacheManager';

export async function stableswapYieldMetricsResolver(
  parentObject: any,
  args: { filter: StableswapYieldMetricsFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<StableswapYieldMetricsResponse> {
  const pgClient: pg.Client = context.pgClient;

  // const {
  //   filter: { interval, poolIds },
  // } = args;

  const filter = args.filter || {
    interval: YieldMetricsInterval['1MON'],
  };

  const cacheKey = `STABLESWAP_YIELD_METRICS::${crypto
    .createHash('md5')
    .update(JSON.stringify(filter))
    .digest('hex')}`;

  const cachedData =
    await CacheManager.getInstance().cache.get<StableswapYieldMetricsResponse>(
      cacheKey
    );

  if (cachedData) return cachedData;

  const decoratedNodes = await handlestableswapYieldMetricsAggregation({
    poolIds: filter.poolIds,
    interval: filter.interval,
    pgClient,
  });

  const result = {
    nodes: decoratedNodes,
    totalCount: decoratedNodes.length,
  };

  await CacheManager.getInstance().cache.set<StableswapYieldMetricsResponse>(
    cacheKey,
    result
  );

  return result;
}
