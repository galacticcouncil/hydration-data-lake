CREATE INDEX IF NOT EXISTS idx_account_asset_balance_lookup
    ON account_asset_balance_historical_data (account_id, asset_id, para_block_height DESC);