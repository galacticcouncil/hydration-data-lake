import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import {
  QueryResolverContext,
  RoutedTradeAssetBalanceRaw,
  RoutedTradeGqlResponse,
  RoutedTradeSwapRaw,
} from '../../../types';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../../utils/helpers';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';
import {
  routedTradeAssetBalanceSelectGraphQLResult,
  routedTradeSelectGraphQLResult,
  routedTradesSubscriptionFilter,
  routeTradeSwapsSelectGraphQLResult,
} from './utils';

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
          routedTrade(
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
          routedTrade: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) => {
            const routedTradeRows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.routed_trade`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  routedTradeSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );
            const routedTradeAssetBalancesRows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.routed_trade_asset_balance`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  routedTradeAssetBalanceSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );
            const routedTradeSwapsRows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.swap`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  routeTradeSwapsSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );

            const routedTradeDecoratedRow =
              convertObjectPropsSnakeCaseToCamelCase(routedTradeRows[0] || {});

            return {
              node: {
                id: routedTradeDecoratedRow.id,
                routeId: routedTradeDecoratedRow.routeId,
                allInvolvedAssetIds: routedTradeDecoratedRow.allInvolvedAssetIds,
                participantSwappers: routedTradeDecoratedRow.participantSwappers,
                participantFillers: routedTradeDecoratedRow.participantFillers,
                feeRecipients: routedTradeDecoratedRow.feeRecipients,
                paraBlockHeight: routedTradeDecoratedRow.paraBlockHeight,
                relayBlockHeight: routedTradeDecoratedRow.relayBlockHeight,
                blockId: routedTradeDecoratedRow.blockId,
                swapIds: routedTradeSwapsRows.map(
                  (swap: RoutedTradeSwapRaw) => swap.id
                ),
                inputs: routedTradeAssetBalancesRows
                  .filter(
                    (item: RoutedTradeAssetBalanceRaw) =>
                      item.asset_balance_type === 'Input'
                  )
                  .map((input: RoutedTradeAssetBalanceRaw) => ({
                    assetId: input.asset_id,
                    amount: input.amount,
                  })),
                outputs: routedTradeAssetBalancesRows
                  .filter(
                    (item: RoutedTradeAssetBalanceRaw) =>
                      item.asset_balance_type === 'Output'
                  )
                  .map((input: RoutedTradeAssetBalanceRaw) => ({
                    assetId: input.asset_id,
                    amount: input.amount,
                  })),
              } as RoutedTradeGqlResponse,
              event: event.__node__.event_name,
            };
          },
        },
      },
    };
  }
);
