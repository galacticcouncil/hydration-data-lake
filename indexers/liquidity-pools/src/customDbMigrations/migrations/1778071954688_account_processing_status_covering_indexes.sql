-- Covering partial indexes for the overdue-account selection query in
-- getAccountProcessingStatusesToProcess. Both indexes enable index-only scans
-- by INCLUDE-ing the timestamp columns the SELECT returns, removing the heap
-- fetch on the hot path.
--
-- Originally lived in db/migrations/1778071954688-AccountProcessingStatusCoveringIndexes.js
-- but TypeORM's migration generator doesn't see them (the indexes are not
-- declared on entities), so every subsequent `sqd migration:create` tried to
-- drop them. Moved here so the shadow-DB workflow never exposes them to the
-- generator.
--
-- Overdue leg: keyed on balances_aggregated_at_para_block ASC, filtered to
-- NOT NULL rows (matches the CTE's filter and ORDER BY), INCLUDE-ing id and
-- mm_reserve_balances_initialized_at_para_block.
--
-- NULL leg: keyed on id, filtered to balances_aggregated_at_para_block IS NULL,
-- INCLUDE-ing mm_reserve_balances_initialized_at_para_block. The constant NULL
-- value is materialized from the partial predicate, so all three SELECT
-- columns are covered.
--
-- node-pg-migrate wraps each .sql migration in a transaction, so CONCURRENTLY
-- cannot be used here (unlike the original JS version). On fresh DBs this is
-- fine because there are no concurrent writes yet. On existing production DBs
-- the indexes already exist from the original JS migration, so the
-- IF NOT EXISTS guards make this a no-op.

CREATE INDEX IF NOT EXISTS "idx_account_processing_status_overdue_covering"
    ON "account_processing_status" ("balances_aggregated_at_para_block" ASC)
    INCLUDE ("id", "mm_reserve_balances_initialized_at_para_block")
    WHERE "balances_aggregated_at_para_block" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_account_processing_status_null_covering"
    ON "account_processing_status" ("id")
    INCLUDE ("mm_reserve_balances_initialized_at_para_block")
    WHERE "balances_aggregated_at_para_block" IS NULL;