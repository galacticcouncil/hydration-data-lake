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

        type XykpoolVolumeAggregated {
          poolId: String!
          assetAId: Int!
          assetBId: Int!
          assetAVolume: BigFloat!
          assetBVolume: BigFloat!
        }

        type OmnipoolAssetVolumeAggregated {
          omnipoolAssetId: String!
          assetId: Int!
          assetVolume: BigFloat!
          assetFeeVolume: BigFloat!
        }

        type StablepoolAssetVolumeAggregated {
          assetId: Int!
          swapFee: BigFloat!
          swapVolume: BigFloat!
        }

        type StableswapVolumeAggregated {
          poolId: String!
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
      },
    };
  }
);
