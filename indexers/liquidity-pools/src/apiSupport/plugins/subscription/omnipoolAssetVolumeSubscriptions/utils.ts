import type { QueryBuilder, SQL } from 'graphile-build-pg';

export function omnipoolAssetHistoricalVolumeSelectGraphQLResult({
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
  sqlBuilder.select(
    sql.fragment`${tableAlias}.omnipool_asset_id`,
    'omnipool_asset_id'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_volume_in`,
    'asset_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_volume_in`,
    'asset_total_volume_in'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_volume_out`,
    'asset_volume_out'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_volume_out`,
    'asset_total_volume_out'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_fee`, 'asset_fee');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_total_fees`,
    'asset_total_fees'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_block_height`,
    'relay_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_block_height`,
    'para_block_height'
  );
}
