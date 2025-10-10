DROP INDEX IF EXISTS idx_asset_historical_data_asset_id_para_block_height;
CREATE INDEX idx_asset_historical_data_asset_id_para_block_height
    ON asset_historical_data (asset_id, para_block_height DESC);
