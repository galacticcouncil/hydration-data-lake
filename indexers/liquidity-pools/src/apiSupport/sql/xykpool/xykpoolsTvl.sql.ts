
export const getXykpoolsTvl = `
  SELECT
    xhd.pool_id AS pool_id,
    xhd.tvl_in_ref_asset_norm AS tvl_in_ref_asset_norm,
    xhd.para_block_height AS para_block_height
  FROM
    xykpool_historical_data xhd
  WHERE
    xhd.para_block_height = (SELECT xykpool_hist_data_latest_block FROM processor_status WHERE id = $1 LIMIT 1)
    AND xhd.pool_id = ANY($2);
`;

export const getAllXykpoolsTvl = `
  SELECT
    xhd.pool_id AS pool_id,
    xhd.tvl_in_ref_asset_norm AS tvl_in_ref_asset_norm,
    xhd.para_block_height AS para_block_height
  FROM
    xykpool_historical_data xhd
      JOIN asset asset_a ON asset_a.id = xhd.asset_a_id
      JOIN asset asset_b ON asset_b.id = xhd.asset_b_id
  WHERE
    xhd.para_block_height = (SELECT xykpool_hist_data_latest_block FROM processor_status WHERE id = $1 LIMIT 1)
    AND (asset_a.existential_deposit > 1 OR asset_b.existential_deposit > 1);
`;
