ALTER TABLE support.api_state
    ADD COLUMN acc_total_balance_latest_proc_block INTEGER NOT NULL DEFAULT 0;

UPDATE support.api_state
SET acc_total_balance_latest_proc_block = 0;