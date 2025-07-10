export const getStableswapsTvl = `
    WITH latest_parent AS (
        SELECT DISTINCT ON (pool_id)
            shd.id as id,
            shd.pool_id as pool_id,
            shd.tvl_total_in_ref_asset_norm as tvl_total_in_ref_asset_norm,
            shd.para_block_height as para_block_height
        FROM stableswap_historical_data shd
        WHERE shd.pool_id = ANY($1)
        ORDER BY
            shd.pool_id,
            shd.para_block_height DESC
        )
    SELECT
        lp.*,
        COALESCE(children.asset_tvls, '[]'::jsonb) AS asset_tvls
    FROM latest_parent lp
        LEFT JOIN LATERAL (
            SELECT
                jsonb_agg(
                    jsonb_build_object(
                        'asset_id', sahd.asset_id,
                        'tvl_in_ref_asset_norm', sahd.tvl_in_ref_asset_norm
                    )
                ) AS asset_tvls
            FROM stableswap_asset_historical_data sahd
            WHERE sahd.pool_historical_data_id = lp.id
        ) AS children ON TRUE;

`;

export const getStableswapsTotalTvl = `
  SELECT DISTINCT ON (pool_id)
    shd.id as id,
    shd.pool_id as pool_id,
    shd.tvl_total_in_ref_asset_norm as tvl_total_in_ref_asset_norm,
    shd.para_block_height as para_block_height
  FROM stableswap_historical_data shd
  ORDER BY
    shd.pool_id,
    shd.para_block_height DESC;
`;
