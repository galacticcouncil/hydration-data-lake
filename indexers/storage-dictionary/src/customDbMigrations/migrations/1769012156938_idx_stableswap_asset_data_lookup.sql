CREATE INDEX IF NOT EXISTS idx_stableswap_asset_data_lookup
    ON stableswap_asset_data (asset_id, pool_id, para_block_height DESC);