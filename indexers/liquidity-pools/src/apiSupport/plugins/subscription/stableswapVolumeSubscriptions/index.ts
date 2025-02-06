import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { stablepoolHistoricalVolumeSubscriptionFilter } from './utils';
import { stableswapHistoricalVolumeSubscriptionResolver } from './resolvers/';

export const StableswapVolumeSubscriptionsPlugin: Plugin =
  makeExtendSchemaPlugin((build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        input StableswapHistoricalVolumeSubscriptionFilter {
          poolIds: [String!]
        }

        type StableswapHistoricalVolumeSubscriptionPayload {
          node: StableswapHistoricalVolumeEntity
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
        },
      },
    };
  });
