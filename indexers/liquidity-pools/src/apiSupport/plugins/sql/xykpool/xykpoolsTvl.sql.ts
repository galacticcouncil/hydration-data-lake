export const getXykpoolsTvl = `
  SELECT DISTINCT ON (pool_id)
    xhd.pool_id as pool_id,
    xhd.tvl_in_ref_asset_norm as tvl_in_ref_asset_norm,
    xhd.para_block_height as para_block_height
  FROM xykpool_historical_data xhd
  WHERE pool_id = ANY($1)
  ORDER BY
    pool_id,
    para_block_height DESC;
`;

export const getAllXykpoolsTvl = `
  SELECT DISTINCT ON (pool_id)
    xhd.pool_id as pool_id,
    xhd.tvl_in_ref_asset_norm as tvl_in_ref_asset_norm,
    xhd.para_block_height as para_block_height
  FROM xykpool_historical_data xhd
  ORDER BY
    pool_id,
    para_block_height DESC;
`;
