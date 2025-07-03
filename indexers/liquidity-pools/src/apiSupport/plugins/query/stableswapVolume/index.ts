import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { stableswapHistoricalVolumesByPeriodResolver } from './resolvers';

export const StableswapVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input StableswapVolumesByPeriodFilter {
          poolIds: [String!]
          startBlockNumber: Int
          endBlockNumber: Int
          period: AggregationTimeRange
        }

        type StableswapVolumesByPeriodResponse {
          nodes: [StableswapVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          stableswapHistoricalVolumesByPeriod(
            filter: StableswapVolumesByPeriodFilter!
          ): StableswapVolumesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          stableswapHistoricalVolumesByPeriod:
            stableswapHistoricalVolumesByPeriodResolver,
        },
      },
    };
  }
);
