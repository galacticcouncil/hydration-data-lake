CREATE INDEX IF NOT EXISTS aabhd_latest_pos_idx
    ON account_asset_balance_historical_data
    (account_id, asset_id, para_block_height DESC)
    INCLUDE (transferable, total_locked)
    WHERE (transferable + total_locked) > 0;