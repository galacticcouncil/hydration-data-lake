CREATE INDEX IF NOT EXISTS idx_xykpool_assets_data_lookup
    ON xykpool_assets_data (asset_id, pool_id, para_block_height DESC);