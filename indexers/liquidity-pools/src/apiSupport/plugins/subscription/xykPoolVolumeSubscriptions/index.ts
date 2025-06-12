import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import {
  xykpoolHistoricalVolumeSubscriptionResolver,
  xykpoolHistoricalVolumeByPeriodSubscriptionResolver,
} from './resolvers';
import {
  xykpoolHistoricalVolumeByPeriodSubscriptionFilter,
  xykpoolHistoricalVolumeSubscriptionFilter,
} from './filters';

export const XykpoolsVolumeSubscriptionsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        input XykpoolHistoricalVolumeSubscriptionFilter {
          poolIds: [String!]
        }          
        input XykpoolHistoricalVolumeByPeriodSubscriptionFilter {
          poolIds: [String!]
          period: AggregationTimeRange
        }

        type XykpoolHistoricalVolumeSubscriptionPayload {
          node: XykpoolHistoricalVolumeEntity
          event: String
        }
        type XykpoolHistoricalVolumeByPeriodSubscriptionPayload {
          nodes: [XykpoolVolumeAggregated!]
          event: String
        }
        type XykpoolHistoricalVolumeEntity {
          id: String!
          poolId: String!
          assetAId: String!
          assetBId: String!          
          assetAAssetRegistryId: String
          assetBAssetRegistryId: String
          assetAVolumeIn: BigInt!
          assetATotalVolumeIn: BigInt!
          assetAVolumeOut: BigInt!
          assetATotalVolumeOut: BigInt!
          assetBVolumeIn: BigInt!
          assetBTotalVolumeIn: BigInt!
          assetBVolumeOut: BigInt!
          assetBTotalVolumeOut: BigInt!
          assetAFee: BigInt!
          assetBFee: BigInt!
          assetATotalFees: BigInt!
          assetBTotalFees: BigInt!
          averagePrice: BigInt!
          paraBlockHeight: Int!
          relayBlockHeight: Int!
        }

        extend type Subscription {
          xykpoolHistoricalVolumes(
            filter: XykpoolHistoricalVolumeSubscriptionFilter
          ): XykpoolHistoricalVolumeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:xykpool_historical_volume"
              filter: ${embed(xykpoolHistoricalVolumeSubscriptionFilter)}
            ),
          xykpoolHistoricalVolumesByPeriod(
                filter: XykpoolHistoricalVolumeByPeriodSubscriptionFilter
            ): XykpoolHistoricalVolumeByPeriodSubscriptionPayload
            @pgSubscription(
                topic: "postgraphile:state_changed:batch_xykpool_hist_vols_list"
                filter: ${embed(xykpoolHistoricalVolumeByPeriodSubscriptionFilter)}
            ),
        }
      `,
      resolvers: {
        Subscription: {
          xykpoolHistoricalVolumes: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) =>
            xykpoolHistoricalVolumeSubscriptionResolver(
              event,
              _args,
              _context,
              resolveInfo,
              sql
            ),
          xykpoolHistoricalVolumesByPeriod: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) =>
            xykpoolHistoricalVolumeByPeriodSubscriptionResolver(
              event,
              _args,
              _context,
              resolveInfo,
              sql
            ),
        },
      },
    };
  }
);
