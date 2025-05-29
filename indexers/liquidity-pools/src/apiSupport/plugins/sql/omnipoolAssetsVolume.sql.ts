export const aggregateOmnipoolAssetsVolumesByBlocksRange = `
    WITH omnipool_asset_start_block AS (
        SELECT 
            v.id,
            v.omnipool_asset_id,
            v.asset_volume_in,
            v.asset_total_volume_in,
            v.asset_volume_out,
            v.asset_total_volume_out,
            v.asset_fee,
            v.asset_total_fees,
            v.asset_total_volume_out,
            v.para_block_height,
            a.asset_registry_id,
            ROW_NUMBER() OVER (PARTITION BY v.omnipool_asset_id ORDER BY v.para_block_height ASC) AS rank
        FROM 
            omnipool_asset_historical_volume v
        LEFT JOIN
            asset a ON a.id = SPLIT_PART(v.omnipool_asset_id, '-', 2)
        WHERE 
            v.omnipool_asset_id = ANY($1)
        AND 
            v.para_block_height >= $2
        AND 
            v.para_block_height <= $3
    ),
    omnipool_asset_end_block AS (
        SELECT 
            v.id,
            v.omnipool_asset_id,
            v.asset_volume_in,
            v.asset_total_volume_in,
            v.asset_volume_out,
            v.asset_total_volume_out,
            v.asset_fee,
            v.asset_total_fees,
            v.asset_total_volume_out,
            v.para_block_height,
            a.asset_registry_id,
            ROW_NUMBER() OVER (PARTITION BY v.omnipool_asset_id ORDER BY v.para_block_height DESC) AS rank
        FROM 
            omnipool_asset_historical_volume v
        LEFT JOIN
            asset a ON a.id = SPLIT_PART(v.omnipool_asset_id, '-', 2)
        WHERE 
            v.omnipool_asset_id = ANY($1)
        AND 
            v.para_block_height <= $3
        AND 
            v.para_block_height >= $2
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
