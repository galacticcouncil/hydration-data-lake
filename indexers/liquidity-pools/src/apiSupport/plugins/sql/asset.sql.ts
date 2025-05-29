export const getAssetsByIds = `
    SELECT
      a.id AS asset_id,
      a.asset_registry_id AS asset_registry_id,
      a.decimals AS decimals
    FROM asset a
    WHERE a.id = ANY ($1)
`;
