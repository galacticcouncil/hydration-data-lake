import { gql, makeExtendSchemaPlugin, Plugin, embed } from 'postgraphile';
import {
  QueryResolverContext,
  RouteTradeAssetBalanceRaw,
  RouteTradeGqlResponse,
  RouteTradeSwapRaw,
} from '../../../types';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../../utils/helpers';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';
import {
  routeTradeAssetBalanceSelectGraphQLResult,
  routeTradeSelectGraphQLResult,
  routeTradesSubscriptionFilter,
  routeTradeSwapsSelectGraphQLResult,
} from './utils';

export const RouteTradesSubscriptionsPlugin: Plugin = makeExtendSchemaPlugin(
  (build, options) => {
    const schemas: string[] = options.stateSchemas || ['squid_processor'];
    const { pgSql: sql } = build;

    return {
      typeDefs: gql`
        input RouteTradeSubscriptionFilter {
            assetIds: [String!]
            participantIds: [String!]
            swapperIds: [String!]
            fillerIds: [String!]
            feeRecipientIds: [String!]
        }

        type RouteTradeSubscriptionPayload {
          node: RouteTradeEntity
          event: String
        }

        type RouteTradeAssetBalanceResponse {
            assetId: String!
            amount: BigInt!
        }
        
        type RouteTradeEntity {
          id: String!
          routeId: String
          allInvolvedAssetIds: [String!]!
          participantSwappers: [String!]!
          participantFillers: [String!]!
          feeRecipients: [String!]!
          swapIds: [String!]!
          inputs: [RouteTradeAssetBalanceResponse!]!
          outputs: [RouteTradeAssetBalanceResponse!]!
          
          paraBlockHeight: Int!
          relayBlockHeight: Int!
          blockId: String!
        }

        extend type Subscription {
          routeTrade(
            filter: RouteTradeSubscriptionFilter
          ): RouteTradeSubscriptionPayload
            @pgSubscription(
              topic: "postgraphile:state_changed:route_trade"
              filter: ${embed(routeTradesSubscriptionFilter)}
            )
        }
      `,
      resolvers: {
        Subscription: {
          routeTrade: async (
            event: any,
            _args: any,
            _context: QueryResolverContext,
            resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> }
          ) => {
            const routeTradeRows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.route_trade`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  routeTradeSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );
            const routeTradeAssetBalancesRows =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`public.route_trade_asset_balance`,
                (tableAlias: SQL, sqlBuilder: QueryBuilder) => {
                  routeTradeAssetBalanceSelectGraphQLResult({
                    sql,
                    event,
                    tableAlias,
                    sqlBuilder,
                  });
                }
              );
            const routeTradeSwapsRows =
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

            const routeTradeDecoratedRow =
              convertObjectPropsSnakeCaseToCamelCase(routeTradeRows[0] || {});

            return {
              node: {
                id: routeTradeDecoratedRow.id,
                routeId: routeTradeDecoratedRow.routeId,
                allInvolvedAssetIds: routeTradeDecoratedRow.allInvolvedAssetIds,
                participantSwappers: routeTradeDecoratedRow.participantSwappers,
                participantFillers: routeTradeDecoratedRow.participantFillers,
                feeRecipients: routeTradeDecoratedRow.feeRecipients,
                paraBlockHeight: routeTradeDecoratedRow.paraBlockHeight,
                relayBlockHeight: routeTradeDecoratedRow.relayBlockHeight,
                blockId: routeTradeDecoratedRow.blockId,
                swapIds: routeTradeSwapsRows.map(
                  (swap: RouteTradeSwapRaw) => swap.id
                ),
                inputs: routeTradeAssetBalancesRows
                  .filter(
                    (item: RouteTradeAssetBalanceRaw) =>
                      item.asset_balance_type === 'Input'
                  )
                  .map((input: RouteTradeAssetBalanceRaw) => ({
                    assetId: input.asset_id,
                    amount: input.amount,
                  })),
                outputs: routeTradeAssetBalancesRows
                  .filter(
                    (item: RouteTradeAssetBalanceRaw) =>
                      item.asset_balance_type === 'Output'
                  )
                  .map((input: RouteTradeAssetBalanceRaw) => ({
                    assetId: input.asset_id,
                    amount: input.amount,
                  })),
              } as RouteTradeGqlResponse,
              event: event.__node__.event_name,
            };
          },
        },
      },
    };
  }
);
