DROP INDEX IF EXISTS idx_money_market_event_all_involved_asset_ids;
CREATE INDEX idx_money_market_event_all_involved_asset_ids
    ON money_market_event
    USING GIN (all_involved_asset_ids);

DROP INDEX IF EXISTS idx_money_market_event_all_involved_participants;
CREATE INDEX idx_money_market_event_all_involved_participants
    ON money_market_event
    USING GIN (all_involved_participants);

DROP INDEX IF EXISTS idx_asset_historical_data_asset_id_para_block_height;
CREATE INDEX idx_asset_historical_data_asset_id_para_block_height
    ON asset_historical_data (asset_id, para_block_height DESC);

DROP INDEX IF EXISTS idx_asset_spot_price_historical_data_assets_para_block_height;
CREATE INDEX idx_asset_spot_price_historical_data_assets_para_block_height
    ON asset_spot_price_historical_data (asset_in_id, asset_out_id, para_block_height DESC);

