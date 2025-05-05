import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { stableswapYieldMetricsResolver } from './resolvers';

export const OmnipoolYieldMetricsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input OmnipoolAssetYieldMetricsFilter {
          interval: YieldMetricsInterval = _1MON_
          assetIds: [String!]!
          assetRegistryIds: [String!]!
        }

        type OmnipoolAssetYieldMetricsAggregated {
          assetId: String!
          assetRegistryId: String!
          projectedApyPerc: BigFloat!
          projectedAprPerc: BigFloat!
        }

        type OmnipoolAssetsYieldMetricsResponse {
          nodes: [OmnipoolAssetYieldMetricsAggregated]!
          totalCount: Int!
        }

        extend type Query {
          omnipoolAssetsYieldMetrics(
            filter: OmnipoolAssetsYieldMetricsFilter!
          ): OmnipoolAssetsYieldMetricsResponse!
        }
      `,
      resolvers: {
        Query: {
          omnipoolAssetsYieldMetrics: stableswapYieldMetricsResolver,
        },
      },
    };
  }
);
