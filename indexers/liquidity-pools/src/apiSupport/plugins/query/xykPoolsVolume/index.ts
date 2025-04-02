import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { xykPoolHistoricalVolumesByPeriodResolver } from './resolvers';

export const XykpoolsVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        input XykpoolVolumesByPeriodFilter {
          poolIds: [String!]!
          startBlockNumber: Int
          endBlockNumber: Int
          period: AggregationTimeRange
        }

        type XykpoolVolumesByPeriodResponse {
          nodes: [XykpoolVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          xykpoolHistoricalVolumesByPeriod(
            filter: XykpoolVolumesByPeriodFilter!
          ): XykpoolVolumesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          xykpoolHistoricalVolumesByPeriod:
            xykPoolHistoricalVolumesByPeriodResolver,
        },
      },
    };
  }
);
