import { QueryResolverContext } from '../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import { XykpoolsLatestTvlFilter, XykpoolsLatestTvlResponse } from './types';
import { handleXykpoolsLatestTvlAggregation } from '../utils';
import * as crypto from 'node:crypto';
import { CacheManager } from '../../../../../utils/cacheManager';

export async function xykpoolsLatestTvlResolver(
  parentObject: any,
  args: { filter: XykpoolsLatestTvlFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<XykpoolsLatestTvlResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter =
    args.filter ||
    ({
      poolIds: [],
    } as XykpoolsLatestTvlFilter);

  const cacheKey = `XYKPOOLS_LATEST_TVL::${crypto
    .createHash('md5')
    .update(JSON.stringify(filter))
    .digest('hex')}`;

  const cachedData =
    await CacheManager.getInstance().cache.get<XykpoolsLatestTvlResponse>(
      cacheKey
    );

  if (cachedData) return cachedData;

  const nodes = await handleXykpoolsLatestTvlAggregation({
    poolIds: filter.poolIds || [],
    pgClient,
  });

  const result = {
    nodes,
    totalCount: nodes.length,
  };

  await CacheManager.getInstance().cache.set<XykpoolsLatestTvlResponse>(
    cacheKey,
    result,
    3_000
  );

  return result;
}
