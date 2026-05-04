-- Covering partial index for the overdue-account selection query in
-- getAccountProcessingStatusesToProcess. Enables index-only scans by including
-- both timestamp columns returned by the SELECT, removing the heap fetch.
--
-- Complements the existing idx_account_processing_status_ordered_balances by
-- being a covering variant; the planner will pick whichever is cheaper for the
-- specific query shape (with random() tie-break + LIMIT).
CREATE INDEX IF NOT EXISTS idx_account_processing_status_overdue_covering
    ON account_processing_status (balances_aggregated_at_para_block ASC)
    INCLUDE (id, mm_reserve_balances_initialized_at_para_block)
    WHERE balances_aggregated_at_para_block IS NOT NULL;

-- Covering partial index for the NULL leg, returning id plus the second
-- timestamp column directly from the index. Complements the existing
-- idx_account_processing_status_null_balances.
CREATE INDEX IF NOT EXISTS idx_account_processing_status_null_covering
    ON account_processing_status (id)
    INCLUDE (mm_reserve_balances_initialized_at_para_block)
    WHERE balances_aggregated_at_para_block IS NULL;