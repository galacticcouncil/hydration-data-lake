CREATE INDEX IF NOT EXISTS idx_stableswap_lookup
    ON stableswap (pool_address, para_block_height DESC);