export const getRouteTradeAssetBalanceItems = `
    SELECT asset_id,
           amount,
           asset_balance_type
    FROM routed_trade_asset_balance
    WHERE routed_trade_id = ANY ($1);
`;
