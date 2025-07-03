import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import {
  omnipoolAssetHistoricalVolumesByPeriodResolver,
  OmnipoolAssetVolumesByPeriodFilter,
} from './resolvers';

export const OmnipoolAssetVolumePlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];

    return {
      typeDefs: gql`
        input OmnipoolAssetVolumesByPeriodFilter {
          assetIds: [String!]
          assetRegistryIds: [String!]
          startBlockNumber: Int
          endBlockNumber: Int
          period: AggregationTimeRange
        }

        type OmnipoolAssetVolumesByPeriodResponse {
          nodes: [OmnipoolAssetVolumeAggregated]!
          totalCount: Int!
        }

        extend type Query {
          omnipoolAssetHistoricalVolumesByPeriod(
            filter: OmnipoolAssetVolumesByPeriodFilter!
          ): OmnipoolAssetVolumesByPeriodResponse!
        }
      `,
      resolvers: {
        Query: {
          omnipoolAssetHistoricalVolumesByPeriod: async (
            parentObject: any,
            args: { filter: OmnipoolAssetVolumesByPeriodFilter },
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
