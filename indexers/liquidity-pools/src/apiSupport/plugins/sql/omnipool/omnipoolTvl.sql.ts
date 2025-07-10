export const getOmnipoolAssetsTvl = `
  SELECT DISTINCT ON (asset_id)
    ahd.asset_id as asset_id,
    ahd.tvl_in_ref_asset_norm as tvl_in_ref_asset_norm,
    ahd.para_block_height as para_block_height
  FROM omnipool_asset_historical_data ahd
  WHERE asset_id = ANY($1)
  ORDER BY
    asset_id,
    para_block_height DESC;
`;

export const getOmnipoolTotalTvl = `
  SELECT DISTINCT ON (pool_id)
    ohd.tvl_total_in_ref_asset_norm as tvl_total_in_ref_asset_norm,
    ohd.para_block_height as para_block_height
  FROM omnipool_historical_data ohd
  ORDER BY
    pool_id,
    para_block_height DESC;
`;
