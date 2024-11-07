export const aggregateXykPoolVolumesByBlocksRange = `
    WITH pool_start_block AS (
        SELECT 
            id,
            pool_id,
            asset_a_id,
            asset_a_volume_in,
            asset_a_total_volume_in,
            asset_a_volume_out,
            asset_a_total_volume_out,
            asset_b_id,
            asset_b_volume_in,
            asset_b_total_volume_in,
            asset_b_volume_out,
            asset_b_total_volume_out,
            para_chain_block_height,
            ROW_NUMBER() OVER (PARTITION BY pool_id ORDER BY para_chain_block_height ASC) AS rank
        FROM 
            xyk_pool_historical_volume
        WHERE 
            pool_id = ANY($1)
        AND 
            para_chain_block_height >= $2
        AND 
            para_chain_block_height <= $3
    ),
    pool_end_block AS (
        SELECT 
            id,
            pool_id,
            asset_a_id,
            asset_a_volume_in,
            asset_a_total_volume_in,
            asset_a_volume_out,
            asset_a_total_volume_out,
            asset_b_id,
            asset_b_volume_in,
            asset_b_total_volume_in,
            asset_b_volume_out,
            asset_b_total_volume_out,
            para_chain_block_height,
            ROW_NUMBER() OVER (PARTITION BY pool_id ORDER BY para_chain_block_height DESC) AS rank
        FROM 
            xyk_pool_historical_volume
        WHERE 
            pool_id = ANY($1)
        AND 
            para_chain_block_height <= $3
        AND 
            para_chain_block_height >= $2
    )
    SELECT 
        json_agg(ARRAY[start_entity, end_entity]) AS grouped_result
    FROM (
        SELECT 
            start_entity.pool_id AS pool_id, 
            start_entity, 
            end_entity
        FROM 
            (SELECT * FROM pool_start_block WHERE rank = 1) AS start_entity
        LEFT JOIN 
            (SELECT * FROM pool_end_block WHERE rank = 1) AS end_entity 
        ON start_entity.pool_id = end_entity.pool_id
    ) AS grouped_data
    GROUP BY 
        pool_id;
`;

export const getAssetIdsByPoolIds = `
  SELECT 
      id, 
      asset_a_id, 
      asset_b_id 
  FROM 
      xyk_pool 
  WHERE 
      id = ANY($1);
`;
