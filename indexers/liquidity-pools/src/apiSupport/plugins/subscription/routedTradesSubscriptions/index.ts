import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import { QueryResolverContext } from '../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import { routedTradeSubscriptionResolver } from './resolvers';
import { routedTradesSubscriptionFilter } from './filters';

export const RoutedTradesSubscriptionsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        input RoutedTradeSubscriptionFilter {
            assetIds: [String!]
            participantIds: [String!]
            swapperIds: [String!]
            fillerIds: [String!]
            feeRecipientIds: [String!]
        }

        type RoutedTradeSubscriptionPayload {
          node: RoutedTradeEntity
          event: String
        }

        type RoutedTradeAssetBalanceResponse {
            assetId: String!
            amount: BigInt!
        }
        
        type RoutedTradeEntity {
          id: String!
          routeId: String
          allInvolvedAssetIds: [String!]!
          participantSwappers: [String!]!
          participantFillers: [String!]!
          feeRecipients: [String!]!
          swapIds: [String!]!
          inputs: [RoutedTradeAssetBalanceResponse!]!
          outputs: [RoutedTradeAssetBalanceResponse!]!
          
          paraBlockHeight: Int!
          relayBlockHeight: Int!
          blockId: String!
        }

        extend type Subscription {
          routedTrades(
            filter: RoutedTradeSubscriptionFilter
          ): RoutedTradeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:routed_trade"
              filter: ${embed(routedTradesSubscriptionFilter)}
            )
        }
      `,
      resolvers: {
        Subscription: {
          routedTrades: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) =>
            routedTradeSubscriptionResolver(
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
