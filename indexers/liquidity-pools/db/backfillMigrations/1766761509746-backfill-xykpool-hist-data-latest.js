module.exports = class Data1766761509746 {
  name = 'Data1766761509746';

  async up(db) {
    await db.query(`
      INSERT INTO xykpool_historical_data_latest (
        id,
        asset_a_id,
        asset_b_id,
        asset_a_balance,
        asset_b_balance,
        tvl_in_ref_asset_norm,
        para_block_height,
        pool_id
      )
      WITH latest_per_pool AS (
        SELECT DISTINCT ON (pool_id)
        pool_id,
        asset_a_id,
        asset_b_id,
        asset_a_balance,
        asset_b_balance,
        tvl_in_ref_asset_norm,
        para_block_height
      FROM xykpool_historical_data
      WHERE pool_id IS NOT NULL
      ORDER BY pool_id, para_block_height DESC
        )
      SELECT
        lpp.pool_id AS id,
        lpp.asset_a_id,
        lpp.asset_b_id,
        lpp.asset_a_balance,
        lpp.asset_b_balance,
        lpp.tvl_in_ref_asset_norm,
        lpp.para_block_height,
        lpp.pool_id
      FROM latest_per_pool lpp
        ON CONFLICT (id) DO UPDATE
                              SET asset_a_id              = EXCLUDED.asset_a_id,
                              asset_b_id              = EXCLUDED.asset_b_id,
                              asset_a_balance         = EXCLUDED.asset_a_balance,
                              asset_b_balance         = EXCLUDED.asset_b_balance,
                              tvl_in_ref_asset_norm   = EXCLUDED.tvl_in_ref_asset_norm,
                              para_block_height       = EXCLUDED.para_block_height,
                              pool_id                 = EXCLUDED.pool_id
                            WHERE EXCLUDED.para_block_height > xykpool_historical_data_latest.para_block_height
    `);
  }

  async down(db) {}
};
