// Query to get latest balance for each account-asset pair
// where total balance > 0 AND total balance < existential deposit

export const query = `
  SELECT lbl.account_id AS "accountId",
         array_agg(a.asset_registry_id ORDER BY a.asset_registry_id) AS "assetRegistryIds"
  FROM account_asset_balance_latest lbl
         JOIN asset a ON a.id = lbl.asset_id
  WHERE lbl.total > 0
    AND lbl.total < a.existential_deposit
  GROUP BY lbl.account_id
  ORDER BY lbl.account_id;
`;
