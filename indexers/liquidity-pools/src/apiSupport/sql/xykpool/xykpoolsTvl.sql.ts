// export const getXykpoolsTvl = `
//   SELECT DISTINCT ON (pool_id)
//     xhd.pool_id as pool_id,
//     xhd.tvl_in_ref_asset_norm as tvl_in_ref_asset_norm,
//     xhd.para_block_height as para_block_height
//   FROM xykpool_historical_data xhd
//   WHERE pool_id = ANY($1)
//   ORDER BY
//     pool_id,
//     para_block_height DESC;
// `;
//
// export const getAllXykpoolsTvl = `
//   SELECT DISTINCT ON (pool_id)
//     xhd.pool_id as pool_id,
//     xhd.tvl_in_ref_asset_norm as tvl_in_ref_asset_norm,
//     xhd.para_block_height as para_block_height
//   FROM xykpool_historical_data xhd
//   ORDER BY
//     pool_id,
//     para_block_height DESC;
// `;
//
// export const getXykpoolsTvl = `
//   SELECT
//     xhd.pool_id as pool_id,
//     xhd.tvl_in_ref_asset_norm as tvl_in_ref_asset_norm,
//     xhd.para_block_height as para_block_height
//   FROM (
//      SELECT
//        pool_id,
//        MAX(para_block_height) AS max_para_block_height
//      FROM
//        xykpool_historical_data
//      WHERE
//        pool_id = ANY($1)
//      GROUP BY
//        pool_id
//    ) AS latest
//      JOIN
//      xykpool_historical_data xhd
//      ON
//        xhd.pool_id = latest.pool_id
//          AND xhd.para_block_height = latest.max_para_block_height;
// `;
//
// export const getAllXykpoolsTvl = `
//   SELECT
//     xhd.pool_id as pool_id,
//     xhd.tvl_in_ref_asset_norm as tvl_in_ref_asset_norm,
//     xhd.para_block_height as para_block_height
//   FROM (
//      SELECT
//        pool_id,
//        MAX(para_block_height) AS max_para_block_height
//      FROM
//        xykpool_historical_data
//      GROUP BY
//        pool_id
//    ) AS latest
//      JOIN
//      xykpool_historical_data xhd
//      ON
//        xhd.pool_id = latest.pool_id
//          AND xhd.para_block_height = latest.max_para_block_height;
// `;

export const getXykpoolsTvl = `
  SELECT
    xhd.pool_id AS pool_id,
    xhd.tvl_in_ref_asset_norm AS tvl_in_ref_asset_norm,
    xhd.para_block_height AS para_block_height
  FROM
    xykpool_historical_data xhd
  WHERE
    xhd.para_block_height = (SELECT xykpool_hist_data_latest_block FROM processor_status)
    AND xhd.pool_id = ANY($1);
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
    xhd.para_block_height = (SELECT xykpool_hist_data_latest_block FROM processor_status)
    AND (asset_a.existential_deposit > 1 OR asset_b.existential_deposit > 1);
`;
