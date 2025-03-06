DROP INDEX IF EXISTS idx_money_market_event_all_involved_asset_ids;

CREATE INDEX idx_money_market_event_all_involved_asset_ids
    ON money_market_event
    USING GIN (all_involved_asset_ids);

DROP INDEX IF EXISTS idx_money_market_event_all_involved_participants;

CREATE INDEX idx_money_market_event_all_involved_participants
    ON money_market_event
    USING GIN (all_involved_participants);