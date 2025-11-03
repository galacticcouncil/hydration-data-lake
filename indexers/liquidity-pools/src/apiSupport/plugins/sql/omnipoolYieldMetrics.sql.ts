export const getOmnipoolAssetSwapFeesByPeriod = `
  SELECT sf.asset_id AS asset_id,
         COALESCE(SUM(sf.amount::numeric(38,0)), 0)::text AS "total_fee_amount"
  FROM swap_fee sf
         JOIN swap s ON sf.swap_id = s.id
  WHERE s.filler_id = $1
    AND s.para_block_height >= $3
    AND sf.asset_id = ANY ($2)
  GROUP BY sf.asset_id;
`;

export const getLatestOmnipoolAssetBalance = `
  SELECT
    id,
    asset_id,
    para_block_height,
    free_balance,
    asset_hub_reserve
  FROM omnipool_asset_historical_data_latest
  WHERE asset_id = ANY ($1);
`;
