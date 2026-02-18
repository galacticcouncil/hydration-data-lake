module.exports = class Data1771436737389 {
  name = 'Data1771436737389';

  async up(db) {
    // Create index for optimization if not exists
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_account_total_balance_account_id_block
      ON account_total_balance_historical_data (account_id, para_block_height DESC)
    `);

    // Use more efficient subquery with ROW_NUMBER for large datasets
    await db.query(`
      INSERT INTO account_total_balance_latest (
        id,
        ref_asset_id,
        total_transferable_norm,
        total_locked_norm,
        total_debt_norm,
        para_block_height
      )
      SELECT
        account_id AS id,
        ref_asset_id,
        total_transferable_norm,
        total_locked_norm,
        total_debt_norm,
        para_block_height
      FROM (
        SELECT
          account_id,
          ref_asset_id,
          total_transferable_norm,
          total_locked_norm,
          total_debt_norm,
          para_block_height,
          ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY para_block_height DESC) AS rn
        FROM account_total_balance_historical_data
        WHERE account_id IS NOT NULL
      ) ranked
      WHERE rn = 1
      ON CONFLICT (id) DO UPDATE
        SET ref_asset_id = EXCLUDED.ref_asset_id,
            total_transferable_norm = EXCLUDED.total_transferable_norm,
            total_locked_norm = EXCLUDED.total_locked_norm,
            total_debt_norm = EXCLUDED.total_debt_norm,
            para_block_height = EXCLUDED.para_block_height
        WHERE EXCLUDED.para_block_height > account_total_balance_latest.para_block_height
    `);
  }

  async down(db) {}
};
