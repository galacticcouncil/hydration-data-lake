import { QueryResolverContext, YieldMetricsInterval } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  AssetLatestSpotPricesFilter,
  AssetLatestSpotPricesResponse,
} from './types';
import { AppConfig } from '../../../../../appConfig';

const appConfig = AppConfig.getInstance();

export async function assetLatestSpotPricesResolver(
  parentObject: any,
  args: { filter: AssetLatestSpotPricesFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<AssetLatestSpotPricesResponse> {
  const pgClient: pg.Client = context.pgClient;

  // const filter = args.filter || {
  //   feeMetricsInterval: YieldMetricsInterval['1MON'],
  // };

  return {
    nodes: [],
    totalCount: 0,
  };
}
