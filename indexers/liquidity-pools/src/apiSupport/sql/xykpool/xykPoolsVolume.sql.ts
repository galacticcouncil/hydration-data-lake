export const aggregateXykPoolVolumesByBlocksRange = `
    WITH pool_start_block AS (SELECT *,
                                     asset_a.asset_registry_id AS asset_a_registry_id,
                                     asset_b.asset_registry_id AS asset_b_registry_id,
                                     ROW_NUMBER() OVER (PARTITION BY pool_id ORDER BY para_block_height ASC) AS rank
                              FROM xykpool_volume_historical_data
                                     JOIN asset asset_a ON asset_a.id = xykpool_volume_historical_data.asset_a_id
                                     JOIN asset asset_b ON asset_b.id = xykpool_volume_historical_data.asset_b_id
                              WHERE pool_id = ANY ($1)
                                AND para_block_height >= $2
                                AND para_block_height <= $3),
         pool_end_block AS (SELECT *,
                                   asset_a.asset_registry_id AS asset_a_registry_id,
                                   asset_b.asset_registry_id AS asset_b_registry_id,
                                   ROW_NUMBER() OVER (PARTITION BY pool_id ORDER BY para_block_height DESC) AS rank
                            FROM xykpool_volume_historical_data
                                   JOIN asset asset_a ON asset_a.id = xykpool_volume_historical_data.asset_a_id
                                   JOIN asset asset_b ON asset_b.id = xykpool_volume_historical_data.asset_b_id
                            WHERE pool_id = ANY ($1)
                              AND para_block_height <= $3
                              AND para_block_height >= $2)
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
