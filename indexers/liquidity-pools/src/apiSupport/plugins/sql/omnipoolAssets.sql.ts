export const getAllOmnipoolAssets = `
    SELECT 
        id
    FROM 
        omnipool_asset
    WHERE 
        pool_id = $1
        AND (
            NOT is_removed 
            OR (is_removed AND removed_at_para_block > $2)
        );
`;

export const getOmnipoolAssetsByAssetIds = `
    SELECT 
      omast.id AS omnipool_asset_id,
      ast.id AS asset_id,
      ast.asset_registry_id AS asset_registry_id,
      ast.decimals AS decimals
    FROM omnipool_asset omast
    JOIN asset ast ON ast.id = omast.asset_id
    WHERE ast.id = ANY ($1);
`;

export const getOmnipoolAssetsAll = `
    SELECT 
      omast.id AS omnipool_asset_id,
      ast.id AS asset_id,
      ast.asset_registry_id AS asset_registry_id,
      ast.decimals AS decimals
    FROM omnipool_asset omast
    JOIN asset ast ON ast.id = omast.asset_id
    WHERE NOT omast.is_removed;
`;
