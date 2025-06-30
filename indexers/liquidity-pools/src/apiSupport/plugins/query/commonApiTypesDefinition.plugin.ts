import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import type { Build } from 'graphile-build';

export const CommonApiTypesDefinitionPlugin: Plugin = makeExtendSchemaPlugin(
  (build: Build, options) => {
    return {
      typeDefs: gql`
        enum AggregationTimeRange {
          _1H_
          _24H_
          _1W_
          _1M_
          _1Y_
          _ALL_
        }

        enum YieldMetricsInterval {
          _1D_
          _1W_
          _1MON_
          _1Y_
        }

        enum AssetsPairPriceTimeRange {
          _5M_
          _15M_
          _30M_
          _1H_
          _4H_
          _24H_
          _1W_
          _1MON_
          _1Y_
          _ALL_
        }

        type XykpoolVolumeAggregated {
          poolId: String!
          assetAId: String!
          assetBId: String!
          assetAAssetRegistryId: String
          assetBAssetRegistryId: String
          assetAVol: BigFloat!
          assetBVol: BigFloat!
          assetAVolNorm: String!
          assetBVolNorm: String!
          assetAFeeVol: BigFloat!
          assetBFeeVol: BigFloat!
          assetAFeeVolNorm: String!
          assetBFeeVolNorm: String!
        }

        type OmnipoolAssetVolumeAggregated {
          omnipoolAssetId: String!
          assetId: String!
          assetRegistryId: String
          assetVol: BigFloat!
          assetFeeVol: BigFloat!
          assetVolNormalized: String!
          assetFeeVolNormalized: String!
        }

        type StablepoolAssetVolumeAggregated {
          assetId: String!
          assetRegistryId: String
          assetFeeVol: BigFloat!
          assetVol: BigFloat!
          assetFeeVolNorm: String!
          assetVolNorm: String!
        }

        type StableswapVolumeAggregated {
          poolId: String!
          poolVolNorm: String!
          poolFeeVolNorm: String!
          assetVolumes: [StablepoolAssetVolumeAggregated!]!
        }
      `,
      resolvers: {
        AggregationTimeRange: {
          _1H_: '1H',
          _24H_: '24H',
          _1W_: '1W',
          _1M_: '1M',
          _1Y_: '1Y',
          _ALL_: 'ALL',
        },

        YieldMetricsInterval: {
          _1D_: '1D',
          _1W_: '1W',
          _1MON_: '1MON',
          _1Y_: '1Y',
        },

        AssetsPairPriceTimeRange: {
          _5M_: '_5M_',
          _15M_: '_15M_',
          _30M_: '_30M_',
          _1H_: '_1H_',
          _4H_: '_4H_',
          _24H_: '_24H_',
          _1W_: '_1W_',
          _1MON_: '_1MON_',
          _1Y_: '_1Y_',
          _ALL_: '_ALL_',
        },
      },
    };
  }
);
