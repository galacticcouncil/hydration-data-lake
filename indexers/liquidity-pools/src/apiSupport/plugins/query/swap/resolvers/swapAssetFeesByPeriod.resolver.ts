import { QueryResolverContext } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  AssetSwapFeeHistoricalDataByPeriodFilter,
  AssetSwapFeeHistoricalDataByPeriodResponse,
} from './types';
import { handleSwapAssetFeesByPeriodAggregation } from '../utils';
import { getStartStopBlocksFromInput } from '../../../../utils/aggregationUtils';

export async function swapAssetFeesByPeriodResolver(
  parentObject: any,
  args: { filter: AssetSwapFeeHistoricalDataByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<AssetSwapFeeHistoricalDataByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: { period, startBlockNumber, endBlockNumber },
  } = args;

  const blocksRange = await getStartStopBlocksFromInput({
    period,
    pgClient,
    inputStopBlockNumber: endBlockNumber,
    inputStartBlockNumber: startBlockNumber,
  });

  if (!blocksRange) return { nodes: [], totalCount: 0 };

  const decoratedNodes = await handleSwapAssetFeesByPeriodAggregation({
    startBlockHeight: blocksRange.startBlockHeight,
    stopBlockHeight: blocksRange.stopBlockHeight,
    pgClient,
  });

  return {
    nodes: decoratedNodes,
    totalCount: decoratedNodes.length,
  };
}
