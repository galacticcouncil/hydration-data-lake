import { QueryResolverContext } from '../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  StableswapsLatestTvlFilter,
  StableswapsLatestTvlResponse,
} from './types';
import { handleStableswapsLatestTvlAggregation } from '../utils';
import * as crypto from 'node:crypto';
import { CacheManager } from '../../../../../utils/cacheManager';

export async function stableswapsLatestTvlResolver(
  parentObject: any,
  args: { filter: StableswapsLatestTvlFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<StableswapsLatestTvlResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter = args.filter || {
    poolIds: [],
  };

  const cacheKey = `STABLESWAPS_LATEST_TVL::${crypto
    .createHash('md5')
    .update(JSON.stringify(filter))
    .digest('hex')}`;

  const cachedData =
    await CacheManager.getInstance().cache.get<StableswapsLatestTvlResponse>(
      cacheKey
    );

  if (cachedData) return cachedData;

  const nodes = await handleStableswapsLatestTvlAggregation({
    poolIds: filter.poolIds || [],
    pgClient,
  });

  const result = {
    nodes,
    totalCount: nodes.length,
  };

  await CacheManager.getInstance().cache.set<StableswapsLatestTvlResponse>(
    cacheKey,
    result,
    3_000
  );

  return result;
}
