export const getAssetsByIds = `
    SELECT json_agg(jsonb_build_object(
                   'asset_id', ast.id,
                   'asset_registry_id', ast.asset_registry_id,
                   'decimals', ast.decimals
                    )
           ) AS assets
    FROM asset a
    WHERE a.id = ANY ($1)
`;
