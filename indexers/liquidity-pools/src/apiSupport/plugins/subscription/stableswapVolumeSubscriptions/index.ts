import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import {
  stableswapHistoricalVolumeByPeriodSubscriptionResolver,
  stableswapHistoricalVolumeSubscriptionResolver,
} from './resolvers/';
import {
  stablepoolHistoricalVolumeSubscriptionFilter,
  stableswapHistoricalVolumeByPeriodSubscriptionFilter,
} from './filters';

export const StableswapVolumeSubscriptionsPlugin: Plugin =
  makeExtendSchemaPlugin((build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        input StableswapHistoricalVolumeSubscriptionFilter {
          poolIds: [String!]
        }
        input StableswapHistoricalVolumeByPeriodSubscriptionFilter {
          poolIds: [String!]
          period: AggregationTimeRange
        }

        type StableswapHistoricalVolumeSubscriptionPayload {
          node: StableswapHistoricalVolumeEntity
          event: String
        }
        type StableswapHistoricalVolumeByPeriodSubscriptionPayload {
            nodes: [StableswapVolumeAggregated!]
            event: String
        }

        type StableswapAssetHistoricalVolumeEntity {
            id: String!
            volumesCollectionId: String!
            assetId: Int!
            swapFee: BigInt!
            swapTotalFees: BigInt!
            swapVolumeIn: BigInt!
            swapVolumeOut: BigInt!
            swapTotalVolumeIn: BigInt!
            swapTotalVolumeOut: BigInt!
            paraBlockHeight: Int!
            relayBlockHeight: Int!
        }

        type StableswapHistoricalVolumeEntity {
          id: String!
          poolId: String!
          assetVolumes: [StableswapAssetHistoricalVolumeEntity]!
          paraBlockHeight: Int!
          relayBlockHeight: Int!
        }

        extend type Subscription {
          stableswapHistoricalVolume(
            filter: StableswapHistoricalVolumeSubscriptionFilter
          ): StableswapHistoricalVolumeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:stableswap_historical_volume"
              filter: ${embed(stablepoolHistoricalVolumeSubscriptionFilter)}
            )
          stableswapHistoricalVolumeByPeriod(
              filter: StableswapHistoricalVolumeByPeriodSubscriptionFilter
          ): StableswapHistoricalVolumeByPeriodSubscriptionPayload
            @pgSubscription(
                topic: "postgraphile:state_changed:batch_stableswap_hist_vols_list"
                filter: ${embed(stableswapHistoricalVolumeByPeriodSubscriptionFilter)}
            ),
        }
      `,
      resolvers: {
        Subscription: {
          stableswapHistoricalVolume: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) =>
            stableswapHistoricalVolumeSubscriptionResolver(
              event,
              _args,
              _context,
              resolveInfo,
              sql
            ),

          stableswapHistoricalVolumeByPeriod: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) =>
            stableswapHistoricalVolumeByPeriodSubscriptionResolver(
              event,
              _args,
              _context,
              resolveInfo,
              sql
            ),
        },
      },
    };
  });
