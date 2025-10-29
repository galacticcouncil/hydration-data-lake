DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE indexname = 'idx_routed_trade_participant_swappers_gin'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_routed_trade_participant_swappers_gin
        ON "routed_trade" USING GIN ("participant_swappers");
    END IF;
END
$$;