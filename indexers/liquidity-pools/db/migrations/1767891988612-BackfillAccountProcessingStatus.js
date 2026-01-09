module.exports = class BackfillAccountProcessingStatus1767891988612 {
  name = 'BackfillAccountProcessingStatus1767891988612';

  async up(db) {
    await db.query(`
      INSERT INTO account_processing_status (
        id,
        mm_reserve_balances_initialized_at_para_block,
        balances_aggregated_at_para_block
      )
      SELECT
        a.id,
        NULL,
        NULL
      FROM account a
      ON CONFLICT (id) DO NOTHING
    `);
  }

  async down(db) {
    // Rollback not implemented - backfilled data should be preserved
  }
};
