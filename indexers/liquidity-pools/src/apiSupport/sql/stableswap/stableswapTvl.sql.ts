// export const getStableswapsTvl = `
//     WITH latest_parent AS (
//         SELECT DISTINCT ON (pool_id)
//             shd.id as id,
//             shd.pool_id as pool_id,
//             shd.tvl_total_in_ref_asset_norm as tvl_total_in_ref_asset_norm,
//             shd.para_block_height as para_block_height
//         FROM stableswap_historical_data shd
//         WHERE shd.pool_id = ANY($1)
//         ORDER BY
//             shd.pool_id,
//             shd.para_block_height DESC
//         )
//     SELECT
//         lp.*,
//         COALESCE(children.asset_tvls, '[]'::jsonb) AS asset_tvls
//     FROM latest_parent lp
//         LEFT JOIN LATERAL (
//             SELECT
//                 jsonb_agg(
//                     jsonb_build_object(
//                         'asset_id', sahd.asset_id,
//                         'tvl_in_ref_asset_norm', sahd.tvl_in_ref_asset_norm
//                     )
//                 ) AS asset_tvls
//             FROM stableswap_asset_historical_data sahd
//             WHERE sahd.pool_historical_data_id = lp.id
//         ) AS children ON TRUE;
//
// `;

// export const getStableswapsTvl = `
//   WITH latest_parent AS (
//     SELECT
//       shd.id as id,
//       shd.pool_id as pool_id,
//       shd.tvl_total_in_ref_asset_norm as tvl_total_in_ref_asset_norm,
//       shd.para_block_height as para_block_height
//     FROM (
//        SELECT
//          pool_id,
//          MAX(para_block_height) AS max_para_block_height
//        FROM
//          stableswap_historical_data
//        WHERE
//          pool_id = ANY($1)
//        GROUP BY
//          pool_id
//      ) AS latest
//        JOIN stableswap_historical_data shd
//             ON shd.pool_id = latest.pool_id AND shd.para_block_height = latest.max_para_block_height
//   )
//   SELECT
//     lp.*,
//     COALESCE(children.asset_tvls, '[]'::jsonb) AS asset_tvls
//   FROM latest_parent lp
//    LEFT JOIN LATERAL (
//     SELECT
//       jsonb_agg(
//         jsonb_build_object(
//           'asset_id', sahd.asset_id,
//           'tvl_in_ref_asset_norm', sahd.tvl_in_ref_asset_norm
//         )
//       ) AS asset_tvls
//     FROM
//       stableswap_asset_historical_data sahd
//     WHERE
//       sahd.pool_historical_data_id = lp.id
//       ) AS children ON TRUE;
// `;

// export const getStableswapsTotalTvl = `
//   SELECT DISTINCT ON (pool_id)
//     shd.id as id,
//     shd.pool_id as pool_id,
//     shd.tvl_total_in_ref_asset_norm as tvl_total_in_ref_asset_norm,
//     shd.para_block_height as para_block_height
//   FROM stableswap_historical_data shd
//   ORDER BY
//     shd.pool_id,
//     shd.para_block_height DESC;
// `;

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
      shd.para_block_height = (SELECT stableswap_hist_data_latest_block FROM processor_status)
      AND shd.pool_id = ANY($1)
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
    shd.para_block_height = (SELECT stableswap_hist_data_latest_block FROM processor_status);
`;
