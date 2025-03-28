
export const aggregateSwapAssetFeesByBlocksRange = `
    WITH fee_data AS (
        SELECT asset_id, para_block_height, amount, total_amount
        FROM historical_asset_swap_fee
        WHERE para_block_height BETWEEN $1 AND $2
    ),
    start_data AS (
       SELECT
           f.*,
           ROW_NUMBER() OVER (
              PARTITION BY asset_id
              ORDER BY para_block_height ASC
        ) AS rn
        FROM fee_data f
    ),
    end_data AS (
       SELECT
           f.*,
           ROW_NUMBER() OVER (
            PARTITION BY asset_id
            ORDER BY para_block_height DESC
        ) AS rn
        FROM fee_data f
    )
    SELECT json_build_object(
       'group_start',
       (
           SELECT json_agg(row_to_json(sd))
           FROM start_data sd
           WHERE sd.rn = 1
       ),
       'group_end',
       (
           SELECT json_agg(row_to_json(ed))
           FROM end_data ed
           WHERE ed.rn = 1
       )
    ) AS grouped_result;
`;
// export const aggregateSwapAssetFeesByBlocksRange = `
//     WITH heights AS (
//         SELECT
//             MIN(para_block_height) AS min_height,
//             MAX(para_block_height) AS max_height
//         FROM historical_asset_swap_fee
//         WHERE para_block_height BETWEEN $1 AND $2
//     )
//     SELECT json_build_object(
//              'group_start',
//              (
//                  SELECT json_agg(row_to_json(t))
//                  FROM historical_asset_swap_fee t
//                           JOIN heights h ON t.para_block_height = h.min_height
//              ),
//              'group_end',
//              (
//                  SELECT json_agg(row_to_json(t))
//                  FROM historical_asset_swap_fee t
//                           JOIN heights h ON t.para_block_height = h.max_height
//              )
//      ) AS grouped_result;
// `;

export const aggregateSwapAssetFeesWithAssetRegistryIdByBlocksRange = `
    WITH heights AS (
        SELECT
            MIN(para_block_height) AS min_height,
            MAX(para_block_height) AS max_height
        FROM historical_asset_swap_fee
        WHERE para_block_height BETWEEN $1 AND $2
    )
    SELECT json_build_object(
                   'group_start',
                   (
                       SELECT json_agg(
                                      row_to_json(t)::jsonb ||
        jsonb_build_object('asset_registry_id', a.asset_registry_id)
                              )
                       FROM historical_asset_swap_fee t
                                JOIN asset a ON t.asset_id = a.id
                                JOIN heights h ON t.para_block_height = h.min_height
                   ),
                   'group_end',
                   (
                       SELECT json_agg(
                                      row_to_json(t)::jsonb ||
        jsonb_build_object('asset_registry_id', a.asset_registry_id)
                              )
                       FROM historical_asset_swap_fee t
                                JOIN asset a ON t.asset_id = a.id
                                JOIN heights h ON t.para_block_height = h.max_height
                   )
           ) AS grouped_result;
`;
