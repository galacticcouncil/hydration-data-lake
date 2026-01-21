export const getLatestXykpoolHistoricalData = `
  SELECT DISTINCT ON (pool_id)
    id,
    pool_id,
    asset_a_id,
    asset_b_id,
    asset_a_balance,
    asset_b_balance,
    tvl_in_ref_asset_norm,
    para_block_height
  FROM xykpool_historical_data
  WHERE pool_id = ANY($1::text[])
    AND para_block_height < $2
  ORDER BY pool_id, para_block_height DESC;
`;
