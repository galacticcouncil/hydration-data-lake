CREATE INDEX IF NOT EXISTS idx_account_mm_position_lookup
    ON account_mm_position_historical_data (account_id, para_block_height DESC);