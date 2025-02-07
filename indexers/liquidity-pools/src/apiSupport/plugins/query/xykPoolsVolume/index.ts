import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { xykPoolHistoricalVolumesByPeriodResolver } from './resolvers';

export const XykpoolsVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        input XykPoolVolumesByPeriodFilter {
          poolIds: [String!]!
          startBlockNumber: Int!
          endBlockNumber: Int
        }

        type XykPoolVolumeAggregated {
          poolId: String!
          assetAId: Int!
          assetBId: Int!
          assetAVolume: BigFloat!
          assetBVolume: BigFloat!
        }

        type XykPoolVolumesByPeriodResponse {
          nodes: [XykPoolVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          xykPoolHistoricalVolumesByPeriod(
            filter: XykPoolVolumesByPeriodFilter!
          ): XykPoolVolumesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          xykPoolHistoricalVolumesByPeriod:
            xykPoolHistoricalVolumesByPeriodResolver,
        },
      },
    };
  }
);
