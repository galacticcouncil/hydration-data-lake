import { QueryResolverContext, YieldMetricsInterval } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  AllAssetsYieldMetricsFilter,
  AllAssetsYieldMetricsResponse,
  AssetYieldMetrics,
} from './types';
import { handleAllAssetsFarmsYieldMetrics } from '../utils';
import * as crypto from 'node:crypto';
import { CacheManager } from '../../../../utils/cacheManager';
import { handlestableswapYieldMetricsAggregation } from '../../stableswapYieldMetrics/utils';
import { handleOmnipoolAssetsYieldMetricsAggregation } from '../../omnipoolYieldMetrics/utils';
import { AppConfig } from '../../../../../appConfig';

const appConfig = AppConfig.getInstance();

export async function assetLatestSpotPricesResolver(
  parentObject: any,
  args: { filter: AllAssetsYieldMetricsFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<AllAssetsYieldMetricsResponse> {
  const pgClient: pg.Client = context.pgClient;

  // const filter = args.filter || {
  //   feeMetricsInterval: YieldMetricsInterval['1MON'],
  // };

  return {
    nodes: [],
    totalCount: 0,
  };
}
