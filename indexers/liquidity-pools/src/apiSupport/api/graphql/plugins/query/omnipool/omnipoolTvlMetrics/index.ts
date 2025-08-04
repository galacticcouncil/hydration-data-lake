import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { omnipoolAssetsLatestTvlResolver } from './resolvers';

export const OmnipoolTvlMetricsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input OmnipoolAssetsLatestTvlFilter {
          assetIds: [String!]
          assetRegistryIds: [String!]
        }

        type OmnipoolAssetLatestTvl {
          assetId: String!
          assetRegistryId: String
          tvlInRefAssetNorm: String!
          paraBlockHeight: Int!
        }

        type OmnipoolAssetsLatestTvlResponse {
          nodes: [OmnipoolAssetLatestTvl]!
          totalCount: Int!
        }

        type OmnipoolLatestTvlTotal {
          poolAddress: String!
          tvlInRefAssetNorm: String!
          paraBlockHeight: Int!
        }

        type OmnipoolLatestTvlTotalResponse {
          nodes: [OmnipoolLatestTvlTotal]!
          totalCount: Int!
        }

        extend type Query {
          omnipoolAssetsLatestTvl(
            filter: OmnipoolAssetsLatestTvlFilter
          ): OmnipoolAssetsLatestTvlResponse!
        }
      `,
      resolvers: {
        Query: {
          omnipoolAssetsLatestTvl: omnipoolAssetsLatestTvlResolver,
        },
      },
    };
  }
);
