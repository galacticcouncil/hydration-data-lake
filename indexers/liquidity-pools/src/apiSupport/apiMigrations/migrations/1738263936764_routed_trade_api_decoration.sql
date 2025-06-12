CREATE VIEW routed_trade_inputs AS
SELECT * FROM routed_trade_asset_balance WHERE asset_balance_type = 'Input';

CREATE VIEW routed_trade_outputs AS
SELECT * FROM routed_trade_asset_balance WHERE asset_balance_type = 'Output';
