import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { xykpoolHistoricalVolumeSubscriptionFilter } from './utils';
import { xykpoolHistoricalVolumeSubscriptionResolver } from './resolvers';

export const XykpoolsVolumeSubscriptionsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        enum AggregationTimeRange {
          _1H_
          _24H_
          _1W_
          _1M_
          _1Y_
          _ALL_
        }
          
        input XykpoolHistoricalVolumeSubscriptionFilter {
          poolIds: [String!]
        }

        type XykpoolHistoricalVolumeSubscriptionPayload {
          node: XykpoolHistoricalVolumeEntity
          event: String
        }
        type XykpoolHistoricalVolumeEntity {
          id: String!
          poolId: String!
          assetAId: String!
          assetBId: String!
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
          xykpoolHistoricalVolume(
            filter: XykpoolHistoricalVolumeSubscriptionFilter
          ): XykpoolHistoricalVolumeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:xykpool_historical_volume"
              filter: ${embed(xykpoolHistoricalVolumeSubscriptionFilter)}
            )
        }
      `,
      resolvers: {
        AggregationTimeRange: {
          _1H_: '1H',
          _24H_: '24H',
          _1W_: '1W',
          _1M_: '1M',
          _1Y_: '1Y',
          _ALL_: 'ALL',
        },
        Subscription: {
          xykpoolHistoricalVolume: async (
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
        },
      },
    };
  }
);
