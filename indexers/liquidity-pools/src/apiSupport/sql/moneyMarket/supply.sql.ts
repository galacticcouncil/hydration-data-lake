
export const getLatestTotalPlatformSupplyAmount = `
  SELECT
    ahd.pool_id AS pool_id,
    ahd.tvl_in_ref_asset_norm AS tvl_in_ref_asset_norm,
    ahd.para_block_height AS para_block_height
  FROM
    aavepool_historical_data ahd
  WHERE
    ahd.para_block_height = (SELECT aavepool_hist_data_latest_block FROM processor_status WHERE id = $1 LIMIT 1);
`;
