import { QueryResolverContext } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type * as pg from 'pg';
import {
  AssetLatestSpotPrice,
  AssetLatestSpotPricesFilter,
  AssetLatestSpotPricesResponse,
  AssetSpotPriceHistoricalDataRaw,
} from './types';
import { AppConfig } from '../../../../../appConfig';
import { getAssetsByAssetRegistryIds } from '../../../sql/asset.sql';
import { getAssetSpotPriceHistDataByIds } from '../../../sql/assetHistData.sql';
import BigNumber from 'bignumber.js';

const appConfig = AppConfig.getInstance();

export async function assetLatestSpotPricesResolver(
  parentObject: any,
  args: { filter: AssetLatestSpotPricesFilter },
  context: QueryResolverContext,
  info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
): Promise<AssetLatestSpotPricesResponse> {
  const pgClient: pg.Client = context.pgClient;

  const filter = args.filter || {};

  const queryResponse: AssetLatestSpotPricesResponse = {
    nodes: [],
    totalCount: 0,
  };

  if (
    (!filter.assetIdPairs || filter.assetIdPairs.length === 0) &&
    (!filter.assetRegistryIdPairs || filter.assetRegistryIdPairs.length === 0)
  )
    return queryResponse;

  const pairsToProcessMap = new Map(
    [...(filter.assetIdPairs || [])].map(([assetInId, assetOutId]) => [
      `${assetInId}:${assetOutId}`,
      [assetInId, assetOutId],
    ])
  );

  if (filter.assetRegistryIdPairs && filter.assetRegistryIdPairs.length > 0) {
    const assetRegistryIdsToFetch = filter.assetRegistryIdPairs.flat();

    const assetsMap = new Map(
      (
        await pgClient.query<{
          id: string;
          asset_registry_id: string;
        }>(getAssetsByAssetRegistryIds, [assetRegistryIdsToFetch])
      ).rows.map((a) => [a.asset_registry_id, a.id])
    );

    for (const [assetInId, assetOutId] of filter.assetRegistryIdPairs) {
      if (!assetsMap.has(assetInId) && !assetsMap.has(assetOutId)) continue;
      const inId = assetsMap.get(assetInId)!;
      const outId = assetsMap.get(assetOutId)!;
      pairsToProcessMap.set(`${inId}:${outId}`, [
        assetsMap.get(assetInId)!,
        assetsMap.get(assetOutId)!,
      ]);
    }
  }

  const idsToQuery = [];

  for (const [key, [assetInId, assetOutId]] of pairsToProcessMap.entries()) {
    if (assetOutId === appConfig.ASSET_PRICE_BASE_ASSET_ID) {
      idsToQuery.push(`${assetInId}|${assetOutId}`);
      continue;
    }
    idsToQuery.push(`${assetInId}|${appConfig.ASSET_PRICE_BASE_ASSET_ID}`);
    idsToQuery.push(`${assetOutId}|${appConfig.ASSET_PRICE_BASE_ASSET_ID}`);
  }

  const pricesMap = new Map(
    (
      await pgClient.query<AssetSpotPriceHistoricalDataRaw>(
        getAssetSpotPriceHistDataByIds,
        [idsToQuery]
      )
    ).rows.map((row) => [`${row.asset_in_id}:${row.asset_out_id}`, row])
  );

  for (const [assetInId, assetOutId] of pairsToProcessMap.values()) {
    if (assetOutId === appConfig.ASSET_PRICE_BASE_ASSET_ID) {
      const priceData = pricesMap.get(`${assetInId}:${assetOutId}`);
      if (!priceData) continue;

      queryResponse.nodes.push({
        assetInId,
        assetOutId,
        assetInRegistryId: priceData.asset_in_asset_registry_id,
        assetOutRegistryId: priceData.asset_out_asset_registry_id,
        priceNorm: priceData.price_normalised,
        paraBlockHeight: priceData.para_block_height,
      } as AssetLatestSpotPrice);

      continue;
    }

    const asstInPriceData =
      assetInId !== appConfig.ASSET_PRICE_BASE_ASSET_ID
        ? pricesMap.get(`${assetInId}:${appConfig.ASSET_PRICE_BASE_ASSET_ID}`)
        : {
            id: '',
            asset_in_id: appConfig.ASSET_PRICE_BASE_ASSET_ID,
            asset_out_id: appConfig.ASSET_PRICE_BASE_ASSET_ID,
            asset_in_asset_registry_id: appConfig.ASSET_PRICE_BASE_ASSET_ID,
            asset_out_asset_registry_id: appConfig.ASSET_PRICE_BASE_ASSET_ID,
            asset_out_decimals: 6,
            price: '1',
            price_normalised: '1',
            price_route: '',
            para_block_height: 0,
            asset_in_hist_data_id: 0,
          };

    const asstOutPriceData = pricesMap.get(
      `${assetOutId}:${appConfig.ASSET_PRICE_BASE_ASSET_ID}`
    );

    if (!asstInPriceData || !asstOutPriceData) continue;

    const priceNorm = BigNumber(asstInPriceData.price_normalised)
      .div(asstOutPriceData.price_normalised)
      .toFixed();

    queryResponse.nodes.push({
      assetInId,
      assetOutId,
      priceNorm,
      assetInRegistryId: asstInPriceData.asset_in_asset_registry_id,
      assetOutRegistryId: asstOutPriceData.asset_in_asset_registry_id,
      paraBlockHeight: asstInPriceData.para_block_height,
    } as AssetLatestSpotPrice);
  }

  return queryResponse;
}
