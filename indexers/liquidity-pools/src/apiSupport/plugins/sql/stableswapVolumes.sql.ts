export const aggregateStablepoolVolumesByBlocksRange = `
    WITH stableswap_volume_start_block AS (
        SELECT 
            id,
            pool_id,
            relay_chain_block_height,
            para_chain_block_height,
            ROW_NUMBER() OVER (PARTITION BY pool_id ORDER BY para_chain_block_height ASC) AS rank
        FROM 
            stableswap_historical_volume
        WHERE 
            pool_id = ANY($1)
        AND 
            para_chain_block_height >= $2
        AND 
            para_chain_block_height <= $3
    ),
    stableswap_volume_end_block AS (
        SELECT 
            id,
            pool_id,
            relay_chain_block_height,
            para_chain_block_height,
            ROW_NUMBER() OVER (PARTITION BY pool_id ORDER BY para_chain_block_height DESC) AS rank
        FROM 
            stableswap_historical_volume
        WHERE 
            pool_id = ANY($1)
        AND 
            para_chain_block_height <= $3
        AND 
            para_chain_block_height >= $2
    ),
    asset_volumes AS (
        SELECT
            sahv.volumes_collection_id,
            json_agg(
                json_build_object(
                    'id', sahv.id,
                    'volumes_collection_id', sahv.volumes_collection_id,
                    'asset_id', sahv.asset_id,
                    'swap_fee', sahv.swap_fee,
                    'swap_total_fees', sahv.swap_total_fees,
                    'swap_volume_in', sahv.swap_volume_in,
                    'swap_volume_out', sahv.swap_volume_out,
                    'swap_total_volume_in', sahv.swap_total_volume_in,
                    'swap_total_volume_out', sahv.swap_total_volume_out,
                    'para_chain_block_height', sahv.para_chain_block_height,
                    'relay_chain_block_height', sahv.relay_chain_block_height
                )
            ) AS asset_volumes
        FROM
            stableswap_asset_historical_volume sahv
        WHERE
            para_chain_block_height <= $3
        AND 
            para_chain_block_height >= $2
        GROUP BY
            sahv.volumes_collection_id
    )
    SELECT 
        json_agg(
            json_build_object(
                'pool_id', grouped_data.pool_id,
                'start_entity', grouped_data.start_entity,
                'end_entity', grouped_data.end_entity,
                'start_entity_asset_volumes', av_start_entity.asset_volumes,
                'end_entity_asset_volumes', av_end_entity.asset_volumes
            )
        ) AS grouped_result
    FROM (
        SELECT 
            start_entity.pool_id AS pool_id, 
            start_entity.id AS start_entity_id,
            end_entity.id AS end_entity_id,
            start_entity, 
            end_entity
        FROM 
            (SELECT * FROM stableswap_volume_start_block WHERE rank = 1) AS start_entity
        LEFT JOIN 
            (SELECT * FROM stableswap_volume_end_block WHERE rank = 1) AS end_entity 
        ON start_entity.pool_id = end_entity.pool_id
    ) AS grouped_data
    LEFT JOIN asset_volumes av_start_entity ON grouped_data.start_entity_id = av_start_entity.volumes_collection_id
    LEFT JOIN asset_volumes av_end_entity ON grouped_data.end_entity_id = av_end_entity.volumes_collection_id
    GROUP BY 
        grouped_data.pool_id;
`;

export const getAssetIdsByStableswapIds = `
  SELECT 
      pool_id,
      json_agg(asset_id) AS assets
  FROM 
      stableswap_asset
  WHERE 
      pool_id = ANY($1)
  GROUP BY 
      pool_id;
`;
