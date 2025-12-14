CREATE SCHEMA IF NOT EXISTS support;

CREATE TABLE IF NOT EXISTS support.api_state (
    id TEXT PRIMARY KEY
        NOT NULL,
    asset_price_latest_processed_block INTEGER
        NOT NULL
);

INSERT INTO support.api_state (id, asset_price_latest_processed_block)
VALUES ('1', 0)
    ON CONFLICT (id) DO UPDATE
        SET
            asset_price_latest_processed_block = EXCLUDED.asset_price_latest_processed_block;

