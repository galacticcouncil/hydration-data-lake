import { gql, makeExtendSchemaPlugin, Plugin } from 'postgraphile';
import {
  omnipoolAssetsYieldMetricsResolver,
  OmnipoolAssetYieldMetricsFilter,
} from './resolvers';
import { QueryResolverContext } from '../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';

export const OmnipoolYieldMetricsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    return {
      typeDefs: gql`
        input OmnipoolAssetsYieldMetricsFilter {
          interval: YieldMetricsInterval = _1MON_
          assetIds: [String!]
        }

        type OmnipoolAssetYieldMetricsAggregated {
          assetId: String!
          assetRegistryId: String!
          projectedApyPerc: BigFloat!
          projectedAprPerc: BigFloat!
        }

        type OmnipoolAssetsYieldMetricsResponse {
          nodes: [OmnipoolAssetYieldMetricsAggregated]!
          totalCount: Int!
        }

        extend type Query {
          omnipoolAssetsYieldMetrics(
            filter: OmnipoolAssetsYieldMetricsFilter
          ): OmnipoolAssetsYieldMetricsResponse!
        }
      `,
      resolvers: {
        Query: {
          omnipoolAssetsYieldMetrics: async (
            parentObject: any,
            args: { filter: OmnipoolAssetYieldMetricsFilter },
            context: QueryResolverContext,
            info: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) => {
            return omnipoolAssetsYieldMetricsResolver(
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
