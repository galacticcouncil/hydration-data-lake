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
        input XykpoolVolumeHistoricalDataSubscriptionFilter {
          poolIds: [String!]
        }          
        input XykpoolVolumeHistoricalDataByPeriodSubscriptionFilter {
          poolIds: [String!]
          period: AggregationTimeRange
        }

        type XykpoolVolumeHistoricalDataSubscriptionPayload {
          node: XykpoolHistoricalVolumeEntity
          event: String
        }
        type XykpoolVolumeHistoricalDataByPeriodSubscriptionPayload {
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
          xykpoolVolumeHistoricalData(
            filter: XykpoolVolumeHistoricalDataSubscriptionFilter
          ): XykpoolVolumeHistoricalDataSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:xykpool_volume_historical_data"
              filter: ${embed(xykpoolHistoricalVolumeSubscriptionFilter)}
            ),
          xykpoolVolumeHistoricalDataByPeriod(
                filter: XykpoolVolumeHistoricalDataByPeriodSubscriptionFilter
            ): XykpoolVolumeHistoricalDataByPeriodSubscriptionPayload
            @pgSubscription(
                topic: "postgraphile:state_changed:batch_xykpool_hist_vols_list"
                filter: ${embed(xykpoolHistoricalVolumeByPeriodSubscriptionFilter)}
            ),
        }
      `,
      resolvers: {
        Subscription: {
          xykpoolVolumeHistoricalData: async (
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
          xykpoolVolumeHistoricalDataByPeriod: async (
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
