CREATE INDEX IF NOT EXISTS idx_asset_historical_data_lookup
    ON asset_historical_data (asset_id, para_block_height DESC);