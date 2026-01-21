CREATE INDEX IF NOT EXISTS idx_omnipool_asset_data_lookup
    ON omnipool_asset_data (asset_id, para_block_height DESC);