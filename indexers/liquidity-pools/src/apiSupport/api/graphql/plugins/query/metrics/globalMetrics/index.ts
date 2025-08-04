import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import {
  allAssetsYieldMetricsResolver,
  platformTotalTvlResolver,
  platformTotalVolumesByPeriodResolver,
} from './resolvers';

export const GlobalMetricsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input AllAssetsYieldMetricsFilter {
          feeMetricsInterval: YieldMetricsInterval = _1MON_
        }

        input PlatformTotalVolumesByPeriodFilter {
          startBlockNumber: Int
          endBlockNumber: Int
          period: AggregationTimeRange = _24H_
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
          totalTvlDecoratedNorm: String!
          omnipoolTvlNorm: String!
          stablepoolsTvlNorm: String!
          xykpoolsTvlNorm: String!
          mmSupplyTvlNorm: String!
          paraBlockHeight: Int!
        }

        type PlatformTotalVolumesByPeriod {
          totalVolNorm: String!
          omnipoolVolNorm: String!
          omnipoolFeeVolNorm: String!
          stableswapVolNorm: String!
          stableswapFeeVolNorm: String!
          xykpoolVolNorm: String!
          xykpoolFeeVolNorm: String!
          paraBlockHeight: Int!
        }

        type PlatformTotalTvlResponse {
          nodes: [PlatformTotalTvl]!
          totalCount: Int!
        }

        type PlatformTotalVolumesByPeriodResponse {
          nodes: [PlatformTotalVolumesByPeriod]!
          totalCount: Int!
        }

        extend type Query {
          allAssetsYieldMetrics(
            filter: AllAssetsYieldMetricsFilter
          ): AllAssetsYieldMetricsResponse!

          platformTotalTvl: PlatformTotalTvlResponse!

          platformTotalVolumesByPeriod(
            filter: PlatformTotalVolumesByPeriodFilter
          ): PlatformTotalVolumesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          allAssetsYieldMetrics: allAssetsYieldMetricsResolver,
          platformTotalTvl: platformTotalTvlResolver,
          platformTotalVolumesByPeriod: platformTotalVolumesByPeriodResolver,
        },
      },
    };
  }
);
