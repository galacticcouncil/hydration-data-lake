DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE indexname = 'idx_swap_all_involved_asset_registry_ids_gin'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_swap_all_involved_asset_registry_ids_gin
        ON "swap" USING GIN ("all_involved_asset_registry_ids");
    END IF;
END
$$;