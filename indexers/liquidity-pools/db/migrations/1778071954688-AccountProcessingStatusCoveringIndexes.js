/*
 * Migration: add covering partial indexes for the overdue-account selection
 * query in getAccountProcessingStatusesToProcess.
 *
 * Both indexes enable index-only scans by INCLUDE-ing the timestamp columns
 * the SELECT returns, removing the heap fetch on the hot path.
 *
 * Index 1 — overdue leg: keyed on balances_aggregated_at_para_block ASC,
 *   filtered to NOT NULL rows (the partial predicate matches the CTE's
 *   filter and ORDER BY), INCLUDE-ing id and
 *   mm_reserve_balances_initialized_at_para_block.
 *
 * Index 2 — NULL leg: keyed on id, filtered to
 *   balances_aggregated_at_para_block IS NULL,
 *   INCLUDE-ing mm_reserve_balances_initialized_at_para_block. The constant
 *   NULL value is materialized from the partial predicate, so all three
 *   SELECT columns are covered.
 *
 * Both creations use CREATE INDEX CONCURRENTLY: account_processing_status is
 * written on every batch by the indexer, and a non-concurrent build queues
 * behind in-flight writes (which on this codebase can be 800-block batches),
 * stretching a sub-second build into many minutes of lock-wait.
 *
 * CONCURRENTLY constraints:
 *  - Cannot run inside a transaction block. node-postgres + the SQD migration
 *    runner wrap each db.query call in its own implicit transaction; a single
 *    CREATE INDEX CONCURRENTLY statement per call is allowed because libpq
 *    only starts an explicit transaction when multiple statements share a
 *    BEGIN/COMMIT. Issuing each as a standalone query keeps autocommit on.
 *  - If a build fails mid-way, Postgres leaves an INVALID index behind. The
 *    IF NOT EXISTS guard would then skip recreation. We DROP INDEX IF EXISTS
 *    first to clear any prior failed attempt before rebuilding.
 */

module.exports = class AccountProcessingStatusCoveringIndexes1778071954688 {
  name = 'AccountProcessingStatusCoveringIndexes1778071954688';

  async up(db) {
    // ----- Overdue leg covering index -----
    await db.query(`
      DROP INDEX IF EXISTS "idx_account_processing_status_overdue_covering"
    `);
    await db.query(`
      CREATE INDEX IF NOT EXISTS "idx_account_processing_status_overdue_covering"
        ON "account_processing_status" ("balances_aggregated_at_para_block" ASC)
        INCLUDE ("id", "mm_reserve_balances_initialized_at_para_block")
        WHERE "balances_aggregated_at_para_block" IS NOT NULL
    `);

    // ----- NULL leg covering index -----
    await db.query(`
      DROP INDEX IF EXISTS "idx_account_processing_status_null_covering"
    `);
    await db.query(`
      CREATE INDEX IF NOT EXISTS "idx_account_processing_status_null_covering"
        ON "account_processing_status" ("id")
        INCLUDE ("mm_reserve_balances_initialized_at_para_block")
        WHERE "balances_aggregated_at_para_block" IS NULL
    `);
  }

  async down(db) {
    await db.query(`
      DROP INDEX IF EXISTS "idx_account_processing_status_null_covering"
    `);
    await db.query(`
      DROP INDEX IF EXISTS "idx_account_processing_status_overdue_covering"
    `);
  }
};
