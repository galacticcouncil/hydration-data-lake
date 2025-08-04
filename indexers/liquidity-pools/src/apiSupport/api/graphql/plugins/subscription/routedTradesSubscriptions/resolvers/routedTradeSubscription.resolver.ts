import {
  QueryResolverContext,
  RoutedTradeAssetBalanceRaw,
  RoutedTradeGqlResponse,
  RoutedTradeSwapRaw,
} from '../../../../../../types';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { GraphileHelpers } from 'graphile-utils/node8plus/fieldHelpers';
import type { QueryBuilder, SQL } from 'graphile-build-pg';
import {
  routedTradeAssetBalanceSelectGraphQLResult,
  routedTradeSelectGraphQLResult,
  routeTradeSwapsSelectGraphQLResult,
} from '../utils';
import { convertObjectPropsSnakeCaseToCamelCase } from '../../../../../../../utils/helpers';

export async function routedTradeSubscriptionResolver(
  event: any,
  _args: any,
  _context: QueryResolverContext,
  resolveInfo: GraphQLResolveInfo & { graphile: GraphileHelpers<any> },
  sql: any
) {
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

  const routedTradeDecoratedRow = convertObjectPropsSnakeCaseToCamelCase(
    routedTradeRows[0] || {}
  );

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
      swapIds: routedTradeSwapsRows.map((swap: RoutedTradeSwapRaw) => swap.id),
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
}
