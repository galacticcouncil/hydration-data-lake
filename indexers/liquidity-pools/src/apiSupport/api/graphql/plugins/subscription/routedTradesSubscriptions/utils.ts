import type { QueryBuilder, SQL } from 'graphile-build-pg';

export function routedTradeSelectGraphQLResult({
  sql,
  event,
  tableAlias,
  sqlBuilder,
}: {
  sql: SQL & { fragment: any; value: any };
  event: any;
  tableAlias: any;
  sqlBuilder: QueryBuilder;
}) {
  sqlBuilder.where(
    sql.fragment`${tableAlias}.id = ${sql.value(event.__node__.node_id)}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.id`, 'id');
  sqlBuilder.select(sql.fragment`${tableAlias}.route_id`, 'route_id');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.all_involved_asset_ids`,
    'all_involved_asset_ids'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.participant_swappers`,
    'participant_swappers'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.participant_fillers`,
    'participant_fillers'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.fee_recipients`,
    'fee_recipients'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_block_height`,
    'para_block_height'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.block_id`, 'block_id');
}

export function routedTradeAssetBalanceSelectGraphQLResult({
  sql,
  event,
  tableAlias,
  sqlBuilder,
}: {
  sql: SQL & { fragment: any; value: any };
  event: any;
  tableAlias: any;
  sqlBuilder: QueryBuilder;
}) {
  sqlBuilder.where(
    sql.fragment`${tableAlias}.routed_trade_id = ${sql.value(event.__node__.node_id)}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_id`, 'asset_id');
  sqlBuilder.select(sql.fragment`${tableAlias}.amount`, 'amount');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_balance_type`,
    'asset_balance_type'
  );
}
export function routeTradeSwapsSelectGraphQLResult({
  sql,
  event,
  tableAlias,
  sqlBuilder,
}: {
  sql: SQL & { fragment: any; value: any };
  event: any;
  tableAlias: any;
  sqlBuilder: QueryBuilder;
}) {
  sqlBuilder.where(
    sql.fragment`${tableAlias}.routed_trade_id = ${sql.value(event.__node__.node_id)}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.id`, 'id');
}
