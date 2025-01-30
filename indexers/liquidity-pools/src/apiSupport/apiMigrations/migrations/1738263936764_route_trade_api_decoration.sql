CREATE VIEW route_trade_inputs AS
SELECT * FROM route_trade_asset_balance WHERE asset_balance_type = 'Input';

CREATE VIEW route_trade_outputs AS
SELECT * FROM route_trade_asset_balance WHERE asset_balance_type = 'Output';
