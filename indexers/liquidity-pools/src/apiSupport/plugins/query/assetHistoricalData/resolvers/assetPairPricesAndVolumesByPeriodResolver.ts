import {
  AssetsPairPriceTimeRange,
  QueryResolverContext,
} from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  AssetPairPriceBucket,
  AssetPairPricesAndVolumeByPeriodResponse,
  AssetPairPricesAndVolumesByPeriodFilter,
  AssetPairPriceSnapshot,
} from './types';
import { AppConfig } from '../../../../../appConfig';
import { RedisTimeSeriesManager } from '../../../../../utils/redisTimeSeriesManager';
import { getBucketSizeMsFromAssetsPairPriceTimeRange } from '../../../../utils/aggregationUtils';
import BigNumber from 'bignumber.js';
import {
  getAssetsByAssetRegistryIds,
  getAssetsByIds,
} from '../../../sql/asset.sql';

const appConfig = AppConfig.getInstance();

export async function assetPairPricesAndVolumesByPeriodResolver(
  parentObject: any,
  args: { filter: AssetPairPricesAndVolumesByPeriodFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<AssetPairPricesAndVolumeByPeriodResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter = args.filter || {
    bucketSize: AssetsPairPriceTimeRange['_5M_'],
  };

  let assetInId = filter.assetInId;
  let assetInRegistryId = filter.assetInRegistryId;
  let assetOutId = filter.assetOutId;
  let assetOutRegistryId = filter.assetOutRegistryId;

  if (!filter.assetOutId && !filter.assetOutRegistryId) {
    assetOutId = appConfig.ASSET_PRICE_BASE_ASSET_ID;
    assetOutRegistryId = appConfig.ASSET_PRICE_BASE_ASSET_ID;
  } else if (filter.assetOutId && !filter.assetOutRegistryId) {
    assetOutRegistryId =
      (
        await pgClient.query<{
          asset_registry_id: string;
        }>(getAssetsByIds, [[filter.assetOutId]])
      ).rows[0]?.asset_registry_id || undefined;
  } else if (!filter.assetOutId && filter.assetOutRegistryId) {
    assetOutId = (
      await pgClient.query<{
        id: string;
      }>(getAssetsByAssetRegistryIds, [[filter.assetOutRegistryId]])
    ).rows[0]?.id;

    if (!assetOutId)
      throw Error('assetOutId not found by provided assetOutRegistryId');
  }

  if (filter.assetInId && !filter.assetInRegistryId) {
    assetInRegistryId =
      (
        await pgClient.query<{
          asset_registry_id: string;
        }>(getAssetsByIds, [[filter.assetInId]])
      ).rows[0]?.asset_registry_id || undefined;
  } else if (!filter.assetInId && filter.assetInRegistryId) {
    assetInId = (
      await pgClient.query<{
        id: string;
      }>(getAssetsByAssetRegistryIds, [[filter.assetInRegistryId]])
    ).rows[0]?.id;

    if (!assetInId)
      throw Error('assetInId not found by provided assetInRegistryId');
  }

  const assetInUnifiedId = assetInRegistryId || assetInId;
  const assetOutUnifiedId = assetOutRegistryId || assetOutId;

  const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();

  const dbResponse =
    await redisTimeSeriesManager.getPricesAndVolumesFromTimeSeries({
      assetInId: assetInUnifiedId,
      assetOutId: assetOutUnifiedId,
      startTimestamp: +filter.startTimestamp!,
      endTimestamp: +filter.endTimestamp!,
      indexerId: appConfig.INDEXER_ID,
      bucketSizeMs: getBucketSizeMsFromAssetsPairPriceTimeRange(
        filter.bucketSize
      ),
    });

  const finalResponseNode: AssetPairPriceSnapshot = {
    referenceAssetId: appConfig.ASSET_PRICE_BASE_ASSET_ID,
    assetInId: assetInId,
    assetInAssetRegistryId: assetInRegistryId,
    assetOutId: assetOutId!,
    assetOutAssetRegistryId: assetOutRegistryId,
    buckets: [],
  };

  if (assetOutUnifiedId === appConfig.ASSET_PRICE_BASE_ASSET_ID) {
    const pairPrices = dbResponse.priceData.get(
      `${assetInUnifiedId}:${appConfig.ASSET_PRICE_BASE_ASSET_ID}`
    );
    if (!pairPrices) throw Error(`pairPrices is not available`);

    for (const priceSnapshot of pairPrices.values()) {
      const volume = dbResponse.volumeData.get(priceSnapshot.timestamp)?.value;

      finalResponseNode.buckets.push({
        timestamp: priceSnapshot.timestamp.toString(),
        priceAvrgNorm: priceSnapshot.value.toString(),
        priceMinNorm: '0',
        priceMaxNorm: '0',
        priceOpenNorm: '0',
        priceCloseNorm: '0',
        referenceAssetVolNorm:
          !!volume && !Number.isNaN(volume) ? volume.toString() : '0',
      } as AssetPairPriceBucket);
    }
  } else {
    const assetInRefPrices = dbResponse.priceData.get(
      `${assetInUnifiedId}:${appConfig.ASSET_PRICE_BASE_ASSET_ID}`
    );
    const assetOutRefPrices = dbResponse.priceData.get(
      `${assetOutUnifiedId}:${appConfig.ASSET_PRICE_BASE_ASSET_ID}`
    );

    for (const priceSnapshot of assetInRefPrices?.values() || []) {
      const assetInRefPrice = priceSnapshot.value;
      const assetOutRefPrice = assetOutRefPrices?.get(
        priceSnapshot.timestamp
      )?.value;

      if (assetOutRefPrice !== 0 && !assetOutRefPrice) continue;

      const price = BigNumber(assetInRefPrice).div(assetOutRefPrice).toFixed();
      const volume = dbResponse.volumeData.get(priceSnapshot.timestamp)?.value;

      finalResponseNode.buckets.push({
        timestamp: priceSnapshot.timestamp.toString(),
        priceAvrgNorm: price,
        priceMinNorm: price,
        priceMaxNorm: price,
        priceOpenNorm: price,
        priceCloseNorm: price,
        referenceAssetVolNorm:
          !!volume && !Number.isNaN(volume) ? volume.toString() : '0',
      } as AssetPairPriceBucket);
    }
  }

  return {
    nodes: [finalResponseNode],
    totalCount: 0,
  };
}
