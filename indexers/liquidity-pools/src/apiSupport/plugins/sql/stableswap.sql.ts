export const getAssetIdsByStableswapIds = `
    SELECT pool_id,
           json_agg(asset_id) AS asset_ids
    FROM stableswap_asset
    WHERE pool_id = ANY ($1)
    GROUP BY pool_id;
`;

export const getAssetsByStableswapIds = `
    SELECT sast.pool_id,
           json_agg(jsonb_build_object(
                   'asset_id', ast.id,
                   'asset_registry_id', ast.asset_registry_id,
                   'decimals', ast.decimals
                    )
           ) AS assets
    FROM stableswap_asset sast
    JOIN asset ast ON ast.id = sast.asset_id
    WHERE sast.pool_id = ANY ($1)
    GROUP BY sast.pool_id;
`;
