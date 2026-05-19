module.exports = class Data1778000000000 {
  name = 'Data1778000000000';

  async up(db) {
    // Backfill account_owned_asset from account_asset_balance_historical_data.
    // One row per (account_id, asset_id) pair with first_seen_para_block_height
    // = MIN(para_block_height) over the historical table.
    //
    // Heavy on prod (~622M rows scanned with GROUP BY), schedule off-peak.
    // Idempotent on re-run via ON CONFLICT DO NOTHING.
    await db.query(`
      INSERT INTO account_owned_asset (
        id,
        account_id,
        asset_id,
        first_seen_para_block_height
      )
      SELECT
        account_id || '-' || asset_id AS id,
        account_id,
        asset_id,
        MIN(para_block_height) AS first_seen_para_block_height
      FROM account_asset_balance_historical_data
      WHERE account_id IS NOT NULL
        AND asset_id IS NOT NULL
      GROUP BY account_id, asset_id
      ON CONFLICT (id) DO NOTHING
    `);
  }

  async down(db) {
    await db.query(`TRUNCATE TABLE account_owned_asset`);
  }
};
