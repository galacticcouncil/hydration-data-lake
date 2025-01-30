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
