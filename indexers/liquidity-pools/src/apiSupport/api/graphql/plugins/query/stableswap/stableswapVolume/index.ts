import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { stableswapHistoricalVolumesByPeriodResolver } from './resolvers';

export const StableswapVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input StableswapVolumeHistoricalDataByPeriodFilter {
          poolIds: [String!]
          startBlockNumber: Int
          endBlockNumber: Int
          period: AggregationTimeRange = _24H_
        }

        type StableswapVolumeHistoricalDataByPeriodResponse {
          nodes: [StableswapVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          stableswapVolumeHistoricalDataByPeriod(
            filter: StableswapVolumeHistoricalDataByPeriodFilter
          ): StableswapVolumeHistoricalDataByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          stableswapVolumeHistoricalDataByPeriod:
            stableswapHistoricalVolumesByPeriodResolver,
        },
      },
    };
  }
);
