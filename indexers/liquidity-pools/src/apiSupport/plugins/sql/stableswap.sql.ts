// export const getAssetIdsByStableswapIds = `
//     SELECT pool_id,
//            json_agg(asset_id) AS assets
//     FROM stableswap_asset
//     WHERE pool_id = ANY ($1)
//     GROUP BY pool_id;
// `;

export const getAssetIdsByStableswapIds = `
    SELECT pool_id,
           json_agg(asset_id) AS asset_ids
    FROM stableswap_asset
    WHERE pool_id = ANY ($1)
    GROUP BY pool_id;
`;

export const getAssetsByStableswapIds = `
    SELECT pool_id,
           json_agg(jsonb_build_object(
                   'asset_id', sast.asset_id,
                   'decimals', ast.decimals
                    )
           ) AS assets
    FROM stableswap_asset sast
    JOIN asset ast ON ast.id = sast.asset_id
    WHERE pool_id = ANY ($1)
    GROUP BY pool_id;
`;
