CREATE INDEX IF NOT EXISTS idx_lbppool_lookup
    ON lbppool (pool_address, para_block_height DESC);