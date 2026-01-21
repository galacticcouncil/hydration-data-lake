export const getPreviousAssetAccountBalancesSql = `
  SELECT
    id,
    account_id,
    asset_id,
    transferable,
    total_locked,
    transferable_in_ref_asset_norm,
    total_locked_in_ref_asset_norm,
    para_block_height
  FROM account_asset_balance_latest
  WHERE account_id = $1
    AND (cardinality($2::text[]) = 0 OR NOT (asset_id = ANY($2::text[])));
`;
