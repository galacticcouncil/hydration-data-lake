CREATE INDEX IF NOT EXISTS idx_routed_trade_participant_swappers_gin
    ON "routed_trade" USING GIN ("participant_swappers");