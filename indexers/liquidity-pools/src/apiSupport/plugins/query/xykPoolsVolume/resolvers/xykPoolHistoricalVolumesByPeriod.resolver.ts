import {
  QueryResolverContext,
  XykpoolHistoricalVolumeRaw,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  aggregateXykPoolVolumesByBlocksRange,
  getAssetIdsByPoolIds,
} from '../../../sql/xykPoolsVolume.sql';
import { handleXykPoolHistoricalVolumesByPeriodAggregation } from '../utils';

export type XykPoolVolumesByPeriodFilter = {
  poolIds: string[];
  startBlockNumber: number;
  endBlockNumber?: number;
};

export type XykPoolVolumeAggregated = {
  poolId: string;
  assetAId: number;
  assetAVolume: bigint;
  assetBId: number;
  assetBVolume: bigint;
};

export type XykPoolVolumesByPeriodResponse = {
  nodes: XykPoolVolumeAggregated[];
  totalCount: number;
};

export async function xykPoolHistoricalVolumesByPeriodResolver(
  parentObject: any,
  args: { filter: XykPoolVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<XykPoolVolumesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  pgClient.setTypeParser(1700, function (val) {
    return val;
  });

  const {
    filter: { poolIds, startBlockNumber, endBlockNumber },
  } = args;

  const decoratedNodes =
    await handleXykPoolHistoricalVolumesByPeriodAggregation({
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
