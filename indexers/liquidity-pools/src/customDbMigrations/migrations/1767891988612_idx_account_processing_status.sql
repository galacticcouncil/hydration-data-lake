
CREATE INDEX idx_account_processing_status_null_balances
    ON account_processing_status (id)
    WHERE balances_aggregated_at_para_block IS NULL;

CREATE INDEX idx_account_processing_status_ordered_balances
    ON account_processing_status (balances_aggregated_at_para_block ASC)
    WHERE balances_aggregated_at_para_block IS NOT NULL;