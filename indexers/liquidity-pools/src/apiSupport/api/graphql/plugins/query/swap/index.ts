import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { swapAssetFeesByPeriodResolver } from './resolvers';

export const SwapPlugin: Plugin = makeExtendSchemaPlugin((build, options) => {
  return {
    typeDefs: gql`
      input AssetSwapFeeHistoricalDataByPeriodFilter {
        period: AggregationTimeRange
        startBlockNumber: Int
        endBlockNumber: Int
      }

      type AssetSwapFeeAggregated {
        assetId: String!
        assetRegistryId: String
        amount: BigFloat!
      }

      type AssetSwapFeeHistoricalDataByPeriodResponse {
        nodes: [AssetSwapFeeAggregated]!
        totalCount: Int!
      }

      extend type Query {
        assetSwapFeeHistoricalDataByPeriod(
          filter: AssetSwapFeeHistoricalDataByPeriodFilter!
        ): AssetSwapFeeHistoricalDataByPeriodResponse!
      }
    `,
    resolvers: {
      Query: {
        assetSwapFeeHistoricalDataByPeriod: swapAssetFeesByPeriodResolver,
      },
    },
  };
});
