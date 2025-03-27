import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { swapAssetFeesByPeriodResolver } from './resolvers';

export const SwapPlugin: Plugin = makeExtendSchemaPlugin((build, options) => {
  return {
    typeDefs: gql`
      input SwapAssetFeesByPeriodFilter {
        period: AggregationTimeRange
        startBlockNumber: Int
        endBlockNumber: Int
      }

      type SwapAssetFeeAggregated {
        assetId: String!
        assetRegistryId: String
        amount: BigFloat!
      }

      type SwapAssetFeesByPeriodResponse {
        nodes: [SwapAssetFeeAggregated]!
        totalCount: Int!
      }

      extend type Query {
        swapAssetFeesByPeriod(
          filter: SwapAssetFeesByPeriodFilter!
        ): SwapAssetFeesByPeriodResponse!
      }
    `,
    resolvers: {
      Query: {
        swapAssetFeesByPeriod: swapAssetFeesByPeriodResolver,
      },
    },
  };
});
