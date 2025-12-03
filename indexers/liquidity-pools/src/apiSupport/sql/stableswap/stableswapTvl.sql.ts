export const getStableswapsTvl = `
  WITH latest_parent AS (
    SELECT
      shd.id AS id,
      shd.pool_id AS pool_id,
      shd.tvl_total_in_ref_asset_norm AS tvl_total_in_ref_asset_norm,
      shd.para_block_height AS para_block_height
    FROM
      stableswap_historical_data shd
    WHERE
      shd.para_block_height = (SELECT stableswap_hist_data_latest_block FROM processor_status WHERE id = $1 LIMIT 1)
      AND shd.pool_id = ANY($2)
  )
  SELECT
    lp.*,
    COALESCE(children.asset_tvls, '[]'::jsonb) AS asset_tvls
  FROM
    latest_parent lp
      LEFT JOIN LATERAL (
      SELECT
        jsonb_agg(
          jsonb_build_object(
            'asset_id', sahd.asset_id,
            'tvl_in_ref_asset_norm', sahd.tvl_in_ref_asset_norm
          )
        ) AS asset_tvls
      FROM
        stableswap_asset_historical_data sahd
      WHERE
        sahd.pool_historical_data_id = lp.id
        ) AS children
                ON TRUE;
`;

export const getStableswapsTotalTvl = `
  SELECT
    shd.id AS id,
    shd.pool_id AS pool_id,
    shd.tvl_total_in_ref_asset_norm AS tvl_total_in_ref_asset_norm,
    shd.para_block_height AS para_block_height
  FROM
    stableswap_historical_data shd
  WHERE
    shd.para_block_height = (SELECT stableswap_hist_data_latest_block FROM processor_status WHERE id = $1 LIMIT 1);
`;
