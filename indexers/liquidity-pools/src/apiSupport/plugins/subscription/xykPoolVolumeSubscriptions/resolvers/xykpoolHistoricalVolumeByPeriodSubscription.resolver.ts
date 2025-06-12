import {
  AggregationTimeRangeLabel,
  QueryResolverContext,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import { getLatestXykpoolHistoricalVolumesBatchEntriesList } from '../../../sql/xykPoolsVolumeByPeriod.sql';
import { AggregationTimeRange } from '../../../../utils';
import { handleXykPoolHistoricalVolumesByPeriodAggregation } from '../../../query/xykPoolsVolume/utils';
import {
  getBlockByTimestampGrtOrEq,
  getBlockByTimestampLtOrEq,
} from '../../../sql/block.sql';

export async function xykpoolHistoricalVolumeByPeriodSubscriptionResolver(
  event: any,
  args: any,
  context: QueryResolverContext,
  resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  sql: any
) {
  const pgClient: pg.Client = context.pgClient;

  const {
    filter: { poolIds, period },
  } = args;

  const requestedRange = new AggregationTimeRange(
    period ?? AggregationTimeRangeLabel['24H']
  );

  const response = {
    nodes: [],
    event: event.__node__.event_name,
  };

  const startBlock = await pgClient.query(getBlockByTimestampGrtOrEq, [
    requestedRange.startDate,
  ]);

  const stopBlock = await pgClient.query(getBlockByTimestampLtOrEq, [
    requestedRange.nowDate,
  ]);

  const latestVolumesBatchEntitiesList = await pgClient.query(
    getLatestXykpoolHistoricalVolumesBatchEntriesList
  );

  if (!startBlock || !startBlock.rows || !startBlock.rows.length)
    return response;

  if (!stopBlock || !stopBlock.rows || !stopBlock.rows.length) return response;

  if (
    !latestVolumesBatchEntitiesList ||
    !latestVolumesBatchEntitiesList.rows ||
    !latestVolumesBatchEntitiesList.rows.length
  )
    return response;

  const involvedPoolIdsSet = new Set(
    latestVolumesBatchEntitiesList.rows[0].pool_ids
  );
  const involvedRequestedPoolIds = poolIds.filter((id: string) =>
    involvedPoolIdsSet.has(id)
  );

  const decoratedNodes =
    await handleXykPoolHistoricalVolumesByPeriodAggregation({
      poolIds: involvedRequestedPoolIds,
      startBlockNumber: startBlock.rows[0].height,
      endBlockNumber: stopBlock.rows[0].height,
      pgClient,
    });

  return {
    nodes: [...decoratedNodes.values()],
    event: event.__node__.event_name,
  };
}
