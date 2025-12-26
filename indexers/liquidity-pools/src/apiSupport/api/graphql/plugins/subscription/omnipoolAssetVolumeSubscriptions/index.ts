import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../../../types';
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
        input OmnipoolAssetVolumeHistoricalDataSubscriptionFilter {
          assetIds: [String!]
        }
        
        input OmnipoolAssetVolumeHistoricalDataByPeriodSubscriptionFilter {
          assetIds: [String!]
          period: AggregationTimeRange
        }

        type OmnipoolAssetVolumeHistoricalDataSubscriptionPayload {
          node: OmnipoolAssetHistoricalVolumeEntity
          event: String
        }
        type OmnipoolAssetVolumeHistoricalDataByPeriodSubscriptionPayload {
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
        }

        extend type Subscription {
          omnipoolAssetVolumeHistoricalData(
            filter: OmnipoolAssetVolumeHistoricalDataSubscriptionFilter
          ): OmnipoolAssetVolumeHistoricalDataSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:omnipool_asset_vol_hist_data"
              filter: ${embed(omnipoolAssetHistoricalVolumeSubscriptionFilter)}
            )

          omnipoolAssetVolumeHistoricalDataByPeriod(
              filter: OmnipoolAssetVolumeHistoricalDataByPeriodSubscriptionFilter
          ): OmnipoolAssetVolumeHistoricalDataByPeriodSubscriptionPayload
            @pgSubscription(
                topic: "postgraphile:state_changed:batch_omnipool_asset_hist_vols_list"
                filter: ${embed(omnipoolAssetHistoricalVolumeByPeriodSubscriptionFilter)}
            ),
        }
      `,
      resolvers: {
        Subscription: {
          /**
           * Returns newest item in table omnipool_asset_volume_historical_data
           */
          omnipoolAssetVolumeHistoricalData: async (
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
          omnipoolAssetVolumeHistoricalDataByPeriod: async (
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
