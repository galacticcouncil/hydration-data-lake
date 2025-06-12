CREATE VIEW swap_inputs AS
SELECT * FROM swap_asset_balance WHERE asset_balance_type = 'Input';

CREATE VIEW swap_outputs AS
SELECT * FROM swap_asset_balance WHERE asset_balance_type = 'Output';
