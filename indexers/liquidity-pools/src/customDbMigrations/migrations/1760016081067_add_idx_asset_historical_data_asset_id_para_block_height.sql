CREATE INDEX IF NOT EXISTS idx_asset_historical_data_asset_id_para_block_height
    ON asset_historical_data ((asset->>'id'), para_block_height DESC);
