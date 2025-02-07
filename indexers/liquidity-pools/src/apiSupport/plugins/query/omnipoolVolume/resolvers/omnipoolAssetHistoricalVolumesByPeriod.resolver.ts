import { QueryResolverContext } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  OmnipoolAssetVolumesByPeriodFilter,
  XykPoolVolumesByPeriodResponse,
} from './types';
import { handleOmnipoolAssetHistoricalVolumesByPeriodAggregation } from '../utils';

export async function omnipoolAssetHistoricalVolumesByPeriodResolver(
  parentObject: any,
  args: { filter: OmnipoolAssetVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  omnipoolAddress: string
): Promise<XykPoolVolumesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: { assetIds, startBlockNumber, endBlockNumber },
  } = args;

  const decoratedNodes =
    await handleOmnipoolAssetHistoricalVolumesByPeriodAggregation({
      omnipoolAddress,
      startBlockNumber,
      endBlockNumber,
      assetIds,
      pgClient,
    });

  return {
    nodes: [...decoratedNodes.values()],
    totalCount: decoratedNodes.size,
  };
}
