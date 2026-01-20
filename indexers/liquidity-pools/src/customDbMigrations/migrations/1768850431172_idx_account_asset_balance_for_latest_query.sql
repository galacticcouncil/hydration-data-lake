CREATE INDEX idx_account_asset_balance_for_latest_query
    ON account_asset_balance_historical_data
        (account_id, asset_id, para_block_height DESC)
    INCLUDE (transferable_in_ref_asset_norm, total_locked_in_ref_asset_norm);