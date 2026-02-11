export const getLatestAccountAssetBalancesAtBlock = `
  SELECT
    accounts.account_id,
    json_agg(
      json_build_object(
        'asset_id', assets.asset_id,
        'transferable_in_ref_asset_norm', latest.transferable_in_ref_asset_norm,
        'total_locked_in_ref_asset_norm', latest.total_locked_in_ref_asset_norm
      )
    ) as assets
  FROM unnest($1::text[]) AS accounts(account_id)
     CROSS JOIN unnest($2::text[]) AS assets(asset_id)
     CROSS JOIN LATERAL (
          SELECT
            transferable_in_ref_asset_norm,
            total_locked_in_ref_asset_norm
          FROM account_asset_balance_historical_data
          WHERE
            account_asset_balance_historical_data.account_id = accounts.account_id
            AND account_asset_balance_historical_data.asset_id = assets.asset_id
            AND para_block_height < $3
          ORDER BY para_block_height DESC
            LIMIT 1
      ) latest
  GROUP BY accounts.account_id;
`;
