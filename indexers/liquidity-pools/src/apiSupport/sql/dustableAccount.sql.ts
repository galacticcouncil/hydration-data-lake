// Query to get latest balance for each account-asset pair
// where total balance > 0 AND total balance < existential deposit
    
export const query = `
      WITH latest_balances AS (
        SELECT DISTINCT ON (account_id, asset_id)
          account_id,
          asset_id,
          transferable,
          total_locked,
          para_block_height
        FROM account_asset_balance_historical_data
        ORDER BY account_id, asset_id, para_block_height DESC
      )
      SELECT
        lb.account_id as "accountId",
        array_agg(DISTINCT a.asset_registry_id) FILTER (WHERE a.asset_registry_id IS NOT NULL) as "assetRegistryIds"
      FROM latest_balances lb
      JOIN asset a ON lb.asset_id = a.id
      WHERE (lb.transferable + lb.total_locked) > 0
        AND (lb.transferable + lb.total_locked) < a.existential_deposit
      GROUP BY lb.account_id
      ORDER BY lb.account_id
    `;
