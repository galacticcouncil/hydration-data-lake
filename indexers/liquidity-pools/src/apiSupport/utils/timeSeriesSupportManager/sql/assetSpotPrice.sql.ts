export const getAssetSpotPricesByBlocksRange = `
    SELECT
        asp.id AS id, 
        asp.asset_in_asset_registry_id AS asset_in_asset_registry_id, 
        asp.asset_out_asset_registry_id AS asset_out_asset_registry_id, 
        asp.price_normalised AS price_normalised,
        (EXTRACT(EPOCH FROM b.timestamp) * 1000)::bigint AS block_timestamp,
        asp.para_block_height AS para_block_height
    FROM asset_spot_price_historical_data asp
        JOIN block b ON b.height = asp.para_block_height
    WHERE asp.para_block_height >= $1 AND asp.para_block_height <= $2;
`;

export const getFirstAvailableAssetSpotPriceEntity = `
    SELECT
        asp.id AS id, 
        asp.para_block_height AS para_block_height
    FROM asset_spot_price_historical_data asp
    ORDER BY id ASC
      LIMIT 1;
`;
