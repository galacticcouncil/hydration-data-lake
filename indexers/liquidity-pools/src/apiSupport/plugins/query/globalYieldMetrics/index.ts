import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { allAssetsYieldMetricsResolver } from './resolvers';

export const GlobalYieldMetricsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input AllAssetsYieldMetricsFilter {
          feeMetricsInterval: YieldMetricsInterval = _1MON_
        }

        type AssetYieldMetrics {
          id: String!
          poolType: String!
          feeApyPerc: BigFloat!
          incentivesApyPerc: BigFloat!
          incentivesTokens: [String!]!
        }

        type AllAssetsYieldMetricsResponse {
          nodes: [AssetYieldMetrics]!
          totalCount: Int!
        }

        extend type Query {
          allAssetsYieldMetrics(
            filter: AllAssetsYieldMetricsFilter
          ): AllAssetsYieldMetricsResponse!
        }
      `,
      resolvers: {
        Query: {
          allAssetsYieldMetrics: allAssetsYieldMetricsResolver,
        },
      },
    };
  }
);
