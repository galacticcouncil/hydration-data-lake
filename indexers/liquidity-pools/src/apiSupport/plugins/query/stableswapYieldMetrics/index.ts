import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { stableswapYieldMetricsResolver } from './resolvers';

export const StableswapYieldMetricsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input StableswapYieldMetricsFilter {
          interval: YieldMetricsInterval = _1MON_
          poolIds: [String!]!
        }

        type StableswapYieldMetricsAggregated {
          poolId: String!
          projectedApyPerc: BigFloat!
          projectedAprPerc: BigFloat!
        }

        type StableswapYieldMetricsResponse {
          nodes: [StableswapYieldMetricsAggregated]!
          totalCount: Int!
        }

        extend type Query {
          stableswapYieldMetrics(
            filter: StableswapYieldMetricsFilter!
          ): StableswapYieldMetricsResponse!
        }
      `,
      resolvers: {
        Query: {
          stableswapYieldMetrics: stableswapYieldMetricsResolver,
        },
      },
    };
  }
);
