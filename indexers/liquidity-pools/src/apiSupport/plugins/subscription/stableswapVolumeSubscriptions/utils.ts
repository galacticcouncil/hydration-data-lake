import type { QueryBuilder, SQL } from 'graphile-build-pg';

export function stableswapHistoricalVolumeSelectGraphQLResult({
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
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_block_height`,
    'relay_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_block_height`,
    'para_block_height'
  );
}

export function stableswapAssetHistoricalVolumeSelectGraphQLResult({
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
    sql.fragment`${tableAlias}.volumes_collection_id = ${sql.value(event.__node__.node_id)}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.id`, 'id');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.volumes_collection_id`,
    'volumes_collection_id'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_id`, 'asset_id');
  sqlBuilder.select(sql.fragment`${tableAlias}.swap_fee`, 'swap_fee');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_total_fees`,
    'swap_total_fees'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_volume_in`,
    'swap_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_volume_out`,
    'swap_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_total_volume_in`,
    'swap_total_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.swap_total_volume_out`,
    'swap_total_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_block_height`,
    'para_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_block_height`,
    'relay_block_height'
  );
}

