import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import {
  omnipoolAssetHistoricalVolumeSubscriptionResolver,
  omnipoolAssetHistoricalVolumeByPeriodSubscriptionResolver,
} from './resolvers';
import {
  omnipoolAssetHistoricalVolumeByPeriodSubscriptionFilter,
  omnipoolAssetHistoricalVolumeSubscriptionFilter,
} from './filters';

export const OmnipoolAssetVolumeSubscriptionsPlugin: Plugin =
  makeExtendSchemaPlugin((build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        input OmnipoolAssetHistoricalVolumeSubscriptionFilter {
          assetIds: [String!]
        }
        
        input OmnipoolAssetHistoricalVolumeByPeriodSubscriptionFilter {
          assetIds: [String!]
          period: AggregationTimeRange
        }

        type OmnipoolAssetHistoricalVolumeSubscriptionPayload {
          node: OmnipoolAssetHistoricalVolumeEntity
          event: String
        }
        type OmnipoolAssetHistoricalVolumeByPeriodSubscriptionPayload {
          nodes: [OmnipoolAssetVolumeAggregated!]
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
          omnipoolAssetHistoricalVolumes(
            filter: OmnipoolAssetHistoricalVolumeSubscriptionFilter
          ): OmnipoolAssetHistoricalVolumeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:omnipool_asset_historical_volume"
              filter: ${embed(omnipoolAssetHistoricalVolumeSubscriptionFilter)}
            )

          omnipoolAssetHistoricalVolumesByPeriod(
              filter: OmnipoolAssetHistoricalVolumeByPeriodSubscriptionFilter
          ): OmnipoolAssetHistoricalVolumeByPeriodSubscriptionPayload
            @pgSubscription(
                topic: "postgraphile:state_changed:batch_omnipool_asset_hist_vols_list"
                filter: ${embed(omnipoolAssetHistoricalVolumeByPeriodSubscriptionFilter)}
            ),
        }
      `,
      resolvers: {
        Subscription: {
          /**
           * Returns newest item in table omnipool_asset_historical_volume
           */
          omnipoolAssetHistoricalVolumes: async (
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
          /**
           * Returns total volume for requested asset by specific period
           */
          omnipoolAssetHistoricalVolumesByPeriod: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) =>
            omnipoolAssetHistoricalVolumeByPeriodSubscriptionResolver(
              event,
              _args,
              _context,
              resolveInfo,
              sql,
              options.omnipoolAddress
            ),
        },
      },
    };
  });
