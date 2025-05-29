export const aggregateXykPoolVolumesByBlocksRange = `
    WITH pool_start_block AS (SELECT v.id,
                                     v.pool_id,
                                     v.asset_a_id,
                                     v.asset_a_volume_in,
                                     v.asset_a_total_volume_in,
                                     v.asset_a_volume_out,
                                     v.asset_a_total_volume_out,
                                     v.asset_b_id,
                                     v.asset_b_volume_in,
                                     v.asset_b_total_volume_in,
                                     v.asset_b_volume_out,
                                     v.asset_b_total_volume_out,
                                     v.para_block_height,
                                     asset_a.asset_registry_id AS asset_a_registry_id,
                                     asset_b.asset_registry_id AS asset_b_registry_id,
                                     ROW_NUMBER() OVER (PARTITION BY v.pool_id ORDER BY v.para_block_height ASC) AS rank
                              FROM xykpool_historical_volume v
                                     JOIN asset asset_a ON asset_a.id = v.asset_a_id
                                     JOIN asset asset_b ON asset_b.id = v.asset_b_id
                              WHERE v.pool_id = ANY ($1)
                                AND v.para_block_height >= $2
                                AND v.para_block_height <= $3),
         pool_end_block AS (SELECT v.id,
                                   v.pool_id,
                                   v.asset_a_id,
                                   v.asset_a_volume_in,
                                   v.asset_a_total_volume_in,
                                   v.asset_a_volume_out,
                                   v.asset_a_total_volume_out,
                                   v.asset_b_id,
                                   v.asset_b_volume_in,
                                   v.asset_b_total_volume_in,
                                   v.asset_b_volume_out,
                                   v.asset_b_total_volume_out,
                                   v.para_block_height,
                                   asset_a.asset_registry_id AS asset_a_registry_id,
                                   asset_b.asset_registry_id AS asset_b_registry_id,
                                   ROW_NUMBER() OVER (PARTITION BY v.pool_id ORDER BY v.para_block_height DESC) AS rank
                            FROM xykpool_historical_volume v
                                   JOIN asset asset_a ON asset_a.id = v.asset_a_id
                                   JOIN asset asset_b ON asset_b.id = v.asset_b_id
                            WHERE v.pool_id = ANY ($1)
                              AND v.para_block_height <= $3
                              AND v.para_block_height >= $2)
    SELECT json_agg(ARRAY[start_entity, end_entity]) AS grouped_result
    FROM (SELECT start_entity.pool_id AS pool_id,
                 start_entity,
                 end_entity
          FROM (SELECT * FROM pool_start_block WHERE rank = 1) AS start_entity
                   LEFT JOIN
                   (SELECT * FROM pool_end_block WHERE rank = 1) AS end_entity
                   ON start_entity.pool_id = end_entity.pool_id) AS grouped_data
    GROUP BY pool_id;
`;

export const getAssetIdsByPoolIds = `
    SELECT xp.id,
           xp.asset_a_id,
           xp.asset_b_id,
           asset_a.asset_registry_id AS asset_a_registry_id,
           asset_b.asset_registry_id AS asset_b_registry_id
    FROM xykpool xp
           JOIN asset asset_a ON asset_a.id = xp.asset_a_id
           JOIN asset asset_b ON asset_b.id = xp.asset_b_id
    WHERE xp.id = ANY ($1);
`;
