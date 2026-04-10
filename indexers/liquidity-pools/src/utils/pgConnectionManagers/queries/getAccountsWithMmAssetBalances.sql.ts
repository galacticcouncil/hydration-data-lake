export const getAccountsWithMmAssetBalancesSql = `
  SELECT DISTINCT
    account_id
  FROM account_asset_balance_latest
  WHERE account_id = ANY($1::text[])
    AND asset_id = ANY($2::text[]);
`;
