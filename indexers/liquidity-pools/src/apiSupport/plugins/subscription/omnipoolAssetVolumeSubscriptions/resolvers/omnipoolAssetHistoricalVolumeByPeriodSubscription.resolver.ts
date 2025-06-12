import {
  AggregationTimeRangeLabel,
  QueryResolverContext,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import { AggregationTimeRange } from '../../../../utils';
import {
  getBlockByTimestampGrtOrEq,
  getBlockByTimestampLtOrEq,
} from '../../../sql/block.sql';
import { getLatestOmnipoolAssetHistoricalVolumesBatchEntriesList } from '../../../sql/omnipoolAssetsVolumeByPeriod.sql';
import { handleOmnipoolAssetHistoricalVolumesByPeriodAggregation } from '../../../query/omnipoolVolume/utils';

export async function omnipoolAssetHistoricalVolumeByPeriodSubscriptionResolver(
  event: any,
  args: any,
  context: QueryResolverContext,
  resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  sql: any,
  omnipoolAddress: string
) {
  const pgClient: pg.Client = context.pgClient;

  const {
    filter: { assetIds, period },
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
    getLatestOmnipoolAssetHistoricalVolumesBatchEntriesList
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
    latestVolumesBatchEntitiesList.rows[0].asset_ids
  );
  const involvedRequestedAssetIds = assetIds.filter((id: string) =>
    involvedPoolIdsSet.has(id)
  );

  const decoratedNodes =
    await handleOmnipoolAssetHistoricalVolumesByPeriodAggregation({
      assetIds: involvedRequestedAssetIds,
      startBlockNumber: startBlock.rows[0].height,
      endBlockNumber: stopBlock.rows[0].height,
      omnipoolAddress,
      pgClient,
    });

  return {
    nodes: [...decoratedNodes.values()],
    event: event.__node__.event_name,
  };
}
