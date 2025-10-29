CREATE INDEX IF NOT EXISTS idx_swap_all_involved_asset_registry_ids_gin
    ON "swap" USING GIN ("all_involved_asset_registry_ids");