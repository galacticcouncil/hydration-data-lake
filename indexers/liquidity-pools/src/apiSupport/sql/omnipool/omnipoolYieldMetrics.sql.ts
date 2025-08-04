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
    DISTINCT ON (asthd.asset_id) 
    asthd.id, 
    asthd.asset_id, 
    asthd.para_block_height, 
    asthd.free_balance, 
    asthd.asset_hub_reserve
  FROM omnipool_asset_historical_data asthd
  WHERE asthd.asset_id = ANY ($1)
  ORDER BY asthd.asset_id, asthd.para_block_height DESC;
`;
