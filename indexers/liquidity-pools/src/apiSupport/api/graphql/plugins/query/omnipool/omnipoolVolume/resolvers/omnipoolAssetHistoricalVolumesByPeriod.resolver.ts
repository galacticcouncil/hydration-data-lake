import { QueryResolverContext } from '../../../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  OmnipoolAssetVolumeHistoricalDataByPeriodFilter,
  XykPoolVolumesByPeriodResponse,
} from './types';
import { handleOmnipoolAssetHistoricalVolumesByPeriodAggregation } from '../utils';
import { getStartStopBlocksFromInput } from '../../../../../../../utils/aggregationUtils';

export async function omnipoolAssetHistoricalVolumesByPeriodResolver(
  parentObject: any,
  args: { filter: OmnipoolAssetVolumeHistoricalDataByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  omnipoolAddress: string
): Promise<XykPoolVolumesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: {
      assetIds,
      assetRegistryIds,
      startBlockNumber,
      endBlockNumber,
      period,
    },
  } = args;

  const blocksRange = await getStartStopBlocksFromInput({
    period,
    pgClient,
    inputStopBlockNumber: endBlockNumber,
    inputStartBlockNumber: startBlockNumber,
  });

  if (!blocksRange) return { nodes: [], totalCount: 0 };

  const decoratedNodes =
    await handleOmnipoolAssetHistoricalVolumesByPeriodAggregation({
      omnipoolAddress,
      startBlockNumber: blocksRange.startBlockHeight,
      endBlockNumber: blocksRange.stopBlockHeight,
      assetIds,
      assetRegistryIds,
      pgClient,
    });

  return {
    nodes: [...decoratedNodes.values()],
    totalCount: decoratedNodes.size,
  };
}
