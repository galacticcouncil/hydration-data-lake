import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import {
  omnipoolAssetHistoricalVolumesByPeriodResolver,
  OmnipoolAssetVolumeHistoricalDataByPeriodFilter,
} from './resolvers';

export const OmnipoolAssetVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        input OmnipoolAssetVolumeHistoricalDataByPeriodFilter {
          assetIds: [String!]
          startBlockNumber: Int
          endBlockNumber: Int
          period: AggregationTimeRange
        }

        type OmnipoolAssetVolumeHistoricalDataByPeriodResponse {
          nodes: [OmnipoolAssetVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          omnipoolAssetVolumeHistoricalDataByPeriod(
            filter: OmnipoolAssetVolumeHistoricalDataByPeriodFilter!
          ): OmnipoolAssetVolumeHistoricalDataByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          omnipoolAssetVolumeHistoricalDataByPeriod: async (
            parentObject: any,
            args: { filter: OmnipoolAssetVolumeHistoricalDataByPeriodFilter },
            context: QueryResolverContext,
            info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) => {
            return omnipoolAssetHistoricalVolumesByPeriodResolver(
              parentObject,
              args,
              context,
              info,
              options.omnipoolAddress
            );
          },
        },
      },
    };
  }
);
