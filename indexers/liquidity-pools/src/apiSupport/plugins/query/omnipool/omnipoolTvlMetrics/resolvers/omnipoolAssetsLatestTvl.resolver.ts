import { QueryResolverContext } from '../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  OmnipoolAssetsLatestTvlFilter,
  OmnipoolAssetsLatestTvlResponse,
} from './types';
import { handleOmnipoolAssetsLatestTvlAggregation } from '../utils';
import * as crypto from 'node:crypto';
import { CacheManager } from '../../../../../utils/cacheManager';

export async function omnipoolAssetsLatestTvlResolver(
  parentObject: any,
  args: { filter: OmnipoolAssetsLatestTvlFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<OmnipoolAssetsLatestTvlResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter = args.filter || {
    assetIds: [],
    assetRegistryIds: [],
  };

  const cacheKey = `OMNIPOOL_ASSETS_LATEST_TVL::${crypto
    .createHash('md5')
    .update(JSON.stringify(filter))
    .digest('hex')}`;

  const cachedData =
    await CacheManager.getInstance().cache.get<OmnipoolAssetsLatestTvlResponse>(
      cacheKey
    );

  if (cachedData) return cachedData;

  const nodes = await handleOmnipoolAssetsLatestTvlAggregation({
    assetIds: filter.assetIds || [],
    pgClient,
  });

  const result = {
    nodes,
    totalCount: nodes.length,
  };

  await CacheManager.getInstance().cache.set<OmnipoolAssetsLatestTvlResponse>(
    cacheKey,
    result,
    3_000
  );

  return result;
}
