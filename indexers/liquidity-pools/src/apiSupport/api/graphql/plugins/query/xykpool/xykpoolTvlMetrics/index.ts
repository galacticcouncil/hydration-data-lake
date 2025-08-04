import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import { xykpoolsLatestTvlResolver } from './resolvers';

export const XykpoolTvlMetricsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input XykpoolsLatestTvlFilter {
          poolIds: [String!]
        }

        type XykpoolLatestTvl {
          poolId: String!
          tvlInRefAssetNorm: String!
          paraBlockHeight: Int!
        }

        type XykpoolsLatestTvlResponse {
          nodes: [XykpoolLatestTvl]!
          totalCount: Int!
        }

        extend type Query {
          xykpoolsLatestTvl(
            filter: XykpoolsLatestTvlFilter
          ): XykpoolsLatestTvlResponse!
        }
      `,
      resolvers: {
        Query: {
          xykpoolsLatestTvl: xykpoolsLatestTvlResolver,
        },
      },
    };
  }
);
