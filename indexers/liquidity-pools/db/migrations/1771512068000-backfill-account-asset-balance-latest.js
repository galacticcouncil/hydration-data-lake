module.exports = class Data1771512068000 {
  name = 'Data1771512068000';

  async up(db) {
    // Create composite index for optimization if not exists
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_account_asset_balance_composite
      ON account_asset_balance_historical_data (account_id, asset_id, para_block_height DESC)
    `);

    // Use ROW_NUMBER for efficient deduplication on large datasets
    await db.query(`
      INSERT INTO account_asset_balance_latest (
        id,
        account_id,
        asset_id,
        transferable,
        total_locked,
        transferable_in_ref_asset_norm,
        total_locked_in_ref_asset_norm,
        total,
        para_block_height
      )
      SELECT
        account_id || '-' || asset_id AS id,
        account_id,
        asset_id,
        transferable,
        total_locked,
        transferable_in_ref_asset_norm,
        total_locked_in_ref_asset_norm,
        (transferable + total_locked) AS total,
        para_block_height
      FROM (
        SELECT
          account_id,
          asset_id,
          transferable,
          total_locked,
          transferable_in_ref_asset_norm,
          total_locked_in_ref_asset_norm,
          para_block_height,
          ROW_NUMBER() OVER (
            PARTITION BY account_id, asset_id
            ORDER BY para_block_height DESC
          ) AS rn
        FROM account_asset_balance_historical_data
        WHERE account_id IS NOT NULL
          AND asset_id IS NOT NULL
      ) ranked
      WHERE rn = 1
      ON CONFLICT (id) DO UPDATE
        SET transferable = EXCLUDED.transferable,
            total_locked = EXCLUDED.total_locked,
            transferable_in_ref_asset_norm = EXCLUDED.transferable_in_ref_asset_norm,
            total_locked_in_ref_asset_norm = EXCLUDED.total_locked_in_ref_asset_norm,
            total = EXCLUDED.total,
            para_block_height = EXCLUDED.para_block_height
        WHERE EXCLUDED.para_block_height > account_asset_balance_latest.para_block_height
    `);
  }

  async down(db) {}
};
