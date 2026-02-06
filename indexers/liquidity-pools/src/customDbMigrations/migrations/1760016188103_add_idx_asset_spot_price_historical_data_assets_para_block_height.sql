CREATE INDEX IF NOT EXISTS idx_asset_spot_price_historical_data_assets_para_block_height
    ON asset_spot_price_historical_data (asset_in_id, asset_out_id, para_block_height DESC)
    INCLUDE (id, asset_out_id, price, price_normalised, price_route_id);
