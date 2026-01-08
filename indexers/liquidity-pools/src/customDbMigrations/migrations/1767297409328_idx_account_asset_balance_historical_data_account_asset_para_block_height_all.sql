CREATE INDEX IF NOT EXISTS idx_account_asset_balance_historical_data_account_asset_para_block_height_all
    ON account_asset_balance_historical_data (account_id, asset_id, para_block_height DESC);
