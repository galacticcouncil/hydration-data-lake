export const getAssetPairVolumesByBlocksRange = `
    SELECT
      aspvol.id AS id,
      asta.asset_registry_id AS asset_a_registry_id,
      astb.asset_registry_id AS asset_b_registry_id, 
      aspvol.total_volume_normalised AS total_volume_normalised, 
      (EXTRACT(EPOCH FROM b.timestamp) * 1000)::bigint AS block_timestamp,
      aspvol.para_block_height AS para_block_height
    FROM assets_pair_volume_historical_data aspvol
        JOIN block b ON b.height = aspvol.para_block_height
        JOIN asset asta ON asta.id = aspvol.asset_a_id
        JOIN asset astb ON astb.id = aspvol.asset_b_id
    WHERE aspvol.para_block_height >= $1 AND aspvol.para_block_height <= $2
`;
