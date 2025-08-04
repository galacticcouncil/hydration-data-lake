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
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_fee_vol`, 'asset_fee_vol');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_fees_vol`,
    'asset_total_fees_vol'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_vol_in`,
    'asset_vol_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_vol_out`,
    'asset_vol_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_vol_in`,
    'asset_total_vol_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_vol_out`,
    'asset_total_vol_out'
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

