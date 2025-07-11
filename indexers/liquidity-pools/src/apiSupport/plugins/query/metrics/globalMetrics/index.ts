import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import {
  allAssetsYieldMetricsResolver,
  platformTotalTvlResolver,
} from './resolvers';

export const GlobalMetricsPlugin: Plugin = makeExtendSchemaPlugin(
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

        type PlatformTotalTvl {
          totalTvlNorm: String!
          omnipoolTvlNorm: String!
          stablepoolsTvlNorm: String!
          xykpoolsTvlNorm: String!
          paraBlockHeight: Int!
        }

        type PlatformTotalTvlResponse {
          nodes: [PlatformTotalTvl]!
          totalCount: Int!
        }

        extend type Query {
          allAssetsYieldMetrics(
            filter: AllAssetsYieldMetricsFilter
          ): AllAssetsYieldMetricsResponse!

          platformTotalTvl: PlatformTotalTvlResponse!
        }
      `,
      resolvers: {
        Query: {
          allAssetsYieldMetrics: allAssetsYieldMetricsResolver,
          platformTotalTvl: platformTotalTvlResolver,
        },
      },
    };
  }
);
