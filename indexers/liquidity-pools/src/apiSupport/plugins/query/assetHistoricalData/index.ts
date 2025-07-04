import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import {
  assetPairPricesAndVolumesByPeriodResolver,
  assetLatestSpotPricesResolver,
} from './resolvers';

export const AssetHistoricalDataPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input AssetLatestSpotPricesFilter {
          assetInIds: [String!]
          assetInRegistryIds: [String!]
          assetOutId: String
          assetOutRegistryId: String
        }

        input AssetPairPricesAndVolumesByPeriodFilter {
          bucketSize: TimeSeriesBucketTimeRange = _5M_
          startTimestamp: String
          endTimestamp: String
          assetInId: String
          assetOutId: String
          assetInRegistryId: String
          assetOutRegistryId: String
        }

        type AssetLatestSpotPrice {
          assetInId: String!
          assetInRegistryId: String
          assetOutId: String!
          assetOutRegistryId: String
          priceNorm: String!
          timestamp: String!
          paraBlockHeight: Int!
        }

        type AssetLatestSpotPricesResponse {
          nodes: [AssetLatestSpotPrice]!
          totalCount: Int!
        }

        type AssetPairPriceBucket {
          priceAvrgNorm: String!
          priceMinNorm: String!
          priceMaxNorm: String!
          priceOpenNorm: String!
          priceCloseNorm: String!
          referenceAssetVolNorm: String!
          timestamp: String!
        }

        type AssetPairPriceSnapshot {
          referenceAssetId: String!
          assetInId: String!
          assetInAssetRegistryId: String
          assetOutId: String!
          assetOutAssetRegistryId: String
          buckets: [AssetPairPriceBucket!]!
        }

        type AssetPairPricesAndVolumeByPeriodResponse {
          nodes: [AssetPairPriceSnapshot]!
          totalCount: Int!
        }

        extend type Query {
          assetLatestSpotPrices(
            filter: AssetLatestSpotPricesFilter
          ): AssetLatestSpotPricesResponse!

          assetPairPricesAndVolumesByPeriod(
            filter: AssetPairPricesAndVolumesByPeriodFilter
          ): AssetPairPricesAndVolumeByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          assetLatestSpotPrices: assetLatestSpotPricesResolver,
          assetPairPricesAndVolumesByPeriod:
            assetPairPricesAndVolumesByPeriodResolver,
        },
      },
    };
  }
);
