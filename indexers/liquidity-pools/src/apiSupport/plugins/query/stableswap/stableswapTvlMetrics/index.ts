import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { stableswapsLatestTvlResolver } from './resolvers';

export const StableswapTvlMetricsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input StableswapLatestTvlFilter {
          poolIds: [String!]
        }

        type StableswapAssetLatestTvl {
          assetId: String!
          assetRegistryId: String!
          tvlInRefAssetNorm: String!
        }

        type StableswapLatestTvl {
          poolId: String!
          tvlTotalInRefAssetNorm: String!
          assetsTvl: [StableswapAssetLatestTvl!]!
          paraBlockHeight: Int!
        }

        type StableswapsLatestTvlResponse {
          nodes: [StableswapLatestTvl]!
          totalCount: Int!
        }

        extend type Query {
          stableswapsLatestTvl(
            filter: StableswapLatestTvlFilter
          ): StableswapsLatestTvlResponse!
        }
      `,
      resolvers: {
        Query: {
          stableswapsLatestTvl: stableswapsLatestTvlResolver,
        },
      },
    };
  }
);
