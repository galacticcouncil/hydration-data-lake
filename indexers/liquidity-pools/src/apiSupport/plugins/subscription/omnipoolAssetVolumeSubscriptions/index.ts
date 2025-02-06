import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { omnipoolAssetHistoricalVolumeSubscriptionFilter } from './utils';
import { omnipoolAssetHistoricalVolumeSubscriptionResolver } from './resolvers';

export const OmnipoolAssetVolumeSubscriptionsPlugin: Plugin =
  makeExtendSchemaPlugin((build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        input OmnipoolAssetHistoricalVolumeSubscriptionFilter {
          omnipoolAssetIds: [String!]
        }

        type OmnipoolAssetHistoricalVolumeSubscriptionPayload {
          node: OmnipoolAssetHistoricalVolumeEntity
          event: String
        }
        type OmnipoolAssetHistoricalVolumeEntity {
          id: String!
          omnipoolAssetId: String!
          assetVolumeIn: BigInt!
          assetTotalVolumeIn: BigInt!
          assetVolumeOut: BigInt!
          assetTotalVolumeOut: BigInt!
          assetFee: BigInt!
          assetTotalFees: BigInt!
          paraBlockHeight: Int!
          relayBlockHeight: Int!
        }

        extend type Subscription {
          omnipoolAssetHistoricalVolume(
            filter: OmnipoolAssetHistoricalVolumeSubscriptionFilter
          ): OmnipoolAssetHistoricalVolumeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:omnipool_asset_historical_volume"
              filter: ${embed(omnipoolAssetHistoricalVolumeSubscriptionFilter)}
            )
        }
      `,
      resolvers: {
        Subscription: {
          omnipoolAssetHistoricalVolume: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) =>
            omnipoolAssetHistoricalVolumeSubscriptionResolver(
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
