export const getLatestXykpoolHistoricalData = `
  SELECT
    lateral_data.id,
    lateral_data.pool_id,
    lateral_data.asset_a_id,
    lateral_data.asset_b_id,
    lateral_data.asset_a_balance,
    lateral_data.asset_b_balance,
    lateral_data.tvl_in_ref_asset_norm,
    lateral_data.para_block_height
  FROM UNNEST($1::text[]) AS pool_id_param
  CROSS JOIN LATERAL (
    SELECT id, pool_id, asset_a_id, asset_b_id, asset_a_balance, asset_b_balance, tvl_in_ref_asset_norm, para_block_height
    FROM xykpool_historical_data
    WHERE pool_id = pool_id_param
      AND para_block_height < $2
    ORDER BY para_block_height DESC
    LIMIT 1
  ) AS lateral_data;
`;
