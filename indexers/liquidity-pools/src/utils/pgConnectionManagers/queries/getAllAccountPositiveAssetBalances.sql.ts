export const getAllAccountPositiveAssetBalances = `
  WITH latest_balances AS (
    SELECT DISTINCT ON (account_id, asset_id)
    account_id,
    asset_id,
    transferable_in_ref_asset_norm,
    total_locked_in_ref_asset_norm,
    para_block_height
    FROM account_asset_balance_historical_data
    WHERE
      account_id = ANY($1::text[])
      AND asset_id = ANY($2::text[])
      AND para_block_height < $3
    ORDER BY account_id, asset_id, para_block_height DESC
    )
  SELECT
    account_id,
    json_agg(
      json_build_object(
        'asset_id', asset_id,
        'transferable_in_ref_asset_norm', transferable_in_ref_asset_norm,
        'total_locked_in_ref_asset_norm', total_locked_in_ref_asset_norm
      )
    ) as assets
  FROM latest_balances
  GROUP BY account_id;
`;
