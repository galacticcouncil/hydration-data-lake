import type { QueryBuilder, SQL } from 'graphile-build-pg';

export function xykpoolHistoricalVolumeSelectGraphQLResult({
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
  sqlBuilder.select(sql.fragment`${tableAlias}.pool_id`, 'pool_id');
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_a_id`, 'asset_a_id');
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_b_id`, 'asset_b_id');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_volume_in`,
    'asset_a_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_total_volume_in`,
    'asset_a_total_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_volume_out`,
    'asset_a_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_total_volume_out`,
    'asset_a_total_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_volume_in`,
    'asset_b_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_total_volume_in`,
    'asset_b_total_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_volume_out`,
    'asset_b_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_total_volume_out`,
    'asset_b_total_volume_out'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_a_fee`, 'asset_a_fee');
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_b_fee`, 'asset_b_fee');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_a_total_fees`,
    'asset_a_total_fees'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_b_total_fees`,
    'asset_b_total_fees'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.average_price`, 'average_price');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_block_height`,
    'para_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_block_height`,
    'relay_block_height'
  );
}

export function xykpoolHistoricalVolumeSubscriptionFilter(
  event: any,
  args: any
) {
  if (
    !args ||
    !args.filter ||
    !args.filter.poolIds ||
    !Array.isArray(args.filter.poolIds) ||
    args.filter.poolIds.length === 0
  )
    return true;

  return new Set(args.filter.poolIds).has(event.__node__.node_id.split('-')[0]);
}
