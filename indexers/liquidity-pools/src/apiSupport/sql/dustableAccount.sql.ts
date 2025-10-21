// Query to get latest balance for each account-asset pair
// where total balance > 0 AND total balance < existential deposit

export const query = `
  WITH latest_balances AS (
        SELECT DISTINCT ON (account_id, asset_id)
        account_id,
        asset_id,
        transferable,
        total_locked
      FROM account_asset_balance_historical_data
      WHERE (transferable + total_locked) > 0
      ORDER BY account_id, asset_id, para_block_height DESC
    )
    , pairs AS (
        SELECT DISTINCT lb.account_id, a.asset_registry_id
        FROM latest_balances lb
          JOIN asset a ON a.id = lb.asset_id
        WHERE a.asset_registry_id IS NOT NULL
          AND (lb.transferable + lb.total_locked) < a.existential_deposit
    )
  SELECT account_id AS "accountId",
         array_agg(asset_registry_id ORDER BY asset_registry_id) AS "assetRegistryIds"
  FROM pairs
  GROUP BY account_id
  ORDER BY account_id;
`;
