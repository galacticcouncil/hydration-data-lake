// export const getOmnipoolAssetsTvl = `
//   SELECT DISTINCT ON (asset_id)
//     ahd.asset_id as asset_id,
//     ahd.tvl_in_ref_asset_norm as tvl_in_ref_asset_norm,
//     ahd.para_block_height as para_block_height
//   FROM omnipool_asset_historical_data ahd
//   WHERE asset_id = ANY($1)
//   ORDER BY
//     asset_id,
//     para_block_height DESC;
// `;

// export const getOmnipoolTotalTvl = `
//   SELECT DISTINCT ON (pool_id)
//     ohd.tvl_total_in_ref_asset_norm as tvl_total_in_ref_asset_norm,
//     ohd.para_block_height as para_block_height
//   FROM omnipool_historical_data ohd
//   ORDER BY
//     pool_id,
//     para_block_height DESC;
// `;

// export const getOmnipoolAssetsTvl = `
//   SELECT
//     ahd.asset_id,
//     ahd.tvl_in_ref_asset_norm,
//     ahd.para_block_height
//   FROM (
//      SELECT
//        asset_id,
//        MAX(para_block_height) AS max_para_block_height
//      FROM
//        omnipool_asset_historical_data
//      WHERE
//        asset_id = ANY($1)
//      GROUP BY
//        asset_id
//   ) AS latest
//     JOIN omnipool_asset_historical_data ahd ON
//      ahd.asset_id = latest.asset_id AND ahd.para_block_height = latest.max_para_block_height;
// `;
//
// export const getOmnipoolTotalTvl = `
//   SELECT
//     ohd.pool_id,
//     ohd.tvl_total_in_ref_asset_norm,
//     ohd.para_block_height
//   FROM (
//      SELECT
//        pool_id,
//        MAX(para_block_height) AS max_para_block_height
//      FROM
//        omnipool_historical_data
//      GROUP BY
//        pool_id
//    ) AS latest
//      JOIN
//      omnipool_historical_data ohd
//      ON
//        ohd.pool_id = latest.pool_id
//          AND ohd.para_block_height = latest.max_para_block_height;
// `;
export const getOmnipoolAssetsTvl = `
  SELECT
    ahd.asset_id,
    ahd.tvl_in_ref_asset_norm,
    ahd.para_block_height
  FROM
    omnipool_asset_historical_data ahd
  WHERE
      ahd.para_block_height = (SELECT omnipool_hist_data_latest_block FROM processor_status)
      AND ahd.asset_id = ANY($1);
`;

export const getOmnipoolTotalTvl = `
  SELECT
    ohd.pool_id,
    ohd.tvl_total_in_ref_asset_norm,
    ohd.para_block_height
  FROM
    omnipool_historical_data ohd
  WHERE
    ohd.para_block_height = (SELECT omnipool_hist_data_latest_block FROM processor_status);
`;
