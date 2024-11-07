export const aggregateOmnipoolAssetsVolumesByBlocksRange = `
    WITH omnipool_asset_start_block AS (
        SELECT 
            id,
            omnipool_asset_id,
            asset_volume_in,
            asset_total_volume_in,
            asset_volume_out,
            asset_total_volume_out,
            asset_fee,
            asset_total_fees,
            asset_total_volume_out,
            para_chain_block_height,
            ROW_NUMBER() OVER (PARTITION BY omnipool_asset_id ORDER BY para_chain_block_height ASC) AS rank
        FROM 
            omnipool_asset_historical_volume
        WHERE 
            omnipool_asset_id = ANY($1)
        AND 
            para_chain_block_height >= $2
        AND 
            para_chain_block_height <= $3
    ),
    omnipool_asset_end_block AS (
        SELECT 
            id,
            omnipool_asset_id,
            asset_volume_in,
            asset_total_volume_in,
            asset_volume_out,
            asset_total_volume_out,
            asset_fee,
            asset_total_fees,
            asset_total_volume_out,
            para_chain_block_height,
            ROW_NUMBER() OVER (PARTITION BY omnipool_asset_id ORDER BY para_chain_block_height DESC) AS rank
        FROM 
            omnipool_asset_historical_volume
        WHERE 
            omnipool_asset_id = ANY($1)
        AND 
            para_chain_block_height <= $3
        AND 
            para_chain_block_height >= $2
    )
    SELECT 
        json_agg(ARRAY[start_entity, end_entity]) AS grouped_result
    FROM (
        SELECT 
            start_entity.omnipool_asset_id AS omnipool_asset_id, 
            start_entity, 
            end_entity
        FROM 
            (SELECT * FROM omnipool_asset_start_block WHERE rank = 1) AS start_entity
        LEFT JOIN 
            (SELECT * FROM omnipool_asset_end_block WHERE rank = 1) AS end_entity 
        ON start_entity.omnipool_asset_id = end_entity.omnipool_asset_id
    ) AS grouped_data
    GROUP BY 
        omnipool_asset_id;
`;
