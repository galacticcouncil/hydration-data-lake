export const getXykpoolsTvl = `
  SELECT
    xhdl.pool_id AS pool_id,
    xhdl.tvl_in_ref_asset_norm AS tvl_in_ref_asset_norm,
    xhdl.para_block_height AS para_block_height
  FROM
    xykpool_historical_data_latest xhdl
  WHERE xhdl.pool_id = ANY($1);
`;

export const getAllXykpoolsTvl = `
  SELECT
    xhdl.pool_id AS pool_id,
    xhdl.tvl_in_ref_asset_norm AS tvl_in_ref_asset_norm,
    xhdl.para_block_height AS para_block_height
  FROM
    xykpool_historical_data_latest xhdl
      JOIN asset asset_a ON asset_a.id = xhdl.asset_a_id
      JOIN asset asset_b ON asset_b.id = xhdl.asset_b_id
  WHERE
    (asset_a.existential_deposit > 1 OR asset_b.existential_deposit > 1);
`;
