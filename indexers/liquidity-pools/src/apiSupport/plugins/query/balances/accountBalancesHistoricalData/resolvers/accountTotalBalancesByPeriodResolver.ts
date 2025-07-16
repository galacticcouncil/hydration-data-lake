import {
  TimeSeriesBucketTimeRange,
  QueryResolverContext,
} from '../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import { AppConfig } from '../../../../../../appConfig';
import { RedisTimeSeriesManager } from '../../../../../../utils/redisTimeSeriesManager';
import { getBucketSizeMsFromAssetsPairPriceTimeRange } from '../../../../../utils/aggregationUtils';
import {
  AccountTotalBalanceBucket,
  AccountTotalBalancesByPeriodResponse,
  AccountTotalBalanceSnapshot,
  AssetPairPricesAndVolumesByPeriodFilter,
} from './types';

const appConfig = AppConfig.getInstance();

export async function accountTotalBalancesByPeriodResolver(
  parentObject: any,
  args: { filter: AssetPairPricesAndVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<AccountTotalBalancesByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter = args.filter;

  if (!filter) return { nodes: [], totalCount: 0 };

  const startTimestampNormalised = filter.startTimestamp
    ? +filter.startTimestamp
    : 0;
  const endTimestampNormalised = filter.endTimestamp
    ? +filter.endTimestamp
    : Date.now();

  const accountId = filter.accountId;

  const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();

  const dbResponse =
    await redisTimeSeriesManager.getAccTotalBalancesFromTimeSeries({
      accountId,
      startTimestamp: startTimestampNormalised,
      endTimestamp: endTimestampNormalised,
      indexerId: appConfig.INDEXER_ID,
      bucketSizeMs: getBucketSizeMsFromAssetsPairPriceTimeRange(
        filter.bucketSize
      ),
    });

  const finalResponseNode: AccountTotalBalanceSnapshot = {
    referenceAssetId: appConfig.ASSET_PRICE_BASE_ASSET_ID,
    accountId,
    buckets: [],
  };

  for (const transferableBalance of dbResponse.transferable.values()) {
    const lockedBalance =
      dbResponse.locked.get(transferableBalance.timestamp)?.value || 0;

    const transferableBalanceDecorated =
      !!transferableBalance.value && !Number.isNaN(transferableBalance.value)
        ? transferableBalance.value.toString()
        : '0';

    const lockedBalanceDecorated =
      !!lockedBalance && !Number.isNaN(lockedBalance)
        ? lockedBalance.toString()
        : '0';

    finalResponseNode.buckets.push({
      timestamp: transferableBalance.timestamp.toString(),
      transferableNorm: transferableBalanceDecorated,
      lockedNorm: lockedBalanceDecorated,
    } as AccountTotalBalanceBucket);
  }

  return {
    nodes: [finalResponseNode],
    totalCount: 0,
  };
}
