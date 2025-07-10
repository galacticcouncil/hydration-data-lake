import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { xykPoolHistoricalVolumesByPeriodResolver } from './resolvers';

export const XykpoolsVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        input XykpoolVolumeHistoricalDataByPeriodFilter {
          poolIds: [String!]!
          startBlockNumber: Int
          endBlockNumber: Int
          period: AggregationTimeRange
        }

        type XykpoolVolumeHistoricalDataByPeriodResponse {
          nodes: [XykpoolVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          xykpoolVolumeHistoricalDataByPeriod(
            filter: XykpoolVolumeHistoricalDataByPeriodFilter!
          ): XykpoolVolumeHistoricalDataByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          xykpoolVolumeHistoricalDataByPeriod:
            xykPoolHistoricalVolumesByPeriodResolver,
        },
      },
    };
  }
);
