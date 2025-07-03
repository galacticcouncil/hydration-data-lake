export const getAssetsByIds = `
    SELECT a.id AS id,
           a.asset_registry_id AS asset_registry_id,
           a.decimals AS decimals
    FROM asset a
    WHERE a.id = ANY ($1)
`;

export const getAssetsByAssetRegistryIds = `
    SELECT a.id AS id,
           a.asset_registry_id AS asset_registry_id,
           a.decimals AS decimals
    FROM asset a
    WHERE a.asset_registry_id = ANY ($1)
`;
