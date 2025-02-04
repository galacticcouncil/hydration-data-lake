export const getRouteTradeAssetBalanceItems = `
    SELECT asset_id,
           amount,
           asset_balance_type
    FROM route_trade_asset_balance
    WHERE route_trade_id = ANY ($1);
`;
