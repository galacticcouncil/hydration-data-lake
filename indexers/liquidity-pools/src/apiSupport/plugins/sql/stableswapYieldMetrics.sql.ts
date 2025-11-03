export const getStableswapAssetSwapFeesByPeriod = `
    WITH pool_data AS (
        SELECT pd."pool_id", pd."asset_ids"
        FROM jsonb_to_recordset($1::jsonb) AS pd("pool_id" text, "asset_ids" text[])
    ),
         pool_assets AS (
             SELECT pd."pool_id", asset_id
             FROM pool_data pd, unnest(pd."asset_ids") AS asset_id
         ),
         asset_fee AS (
             SELECT
                 pa."pool_id",
                 pa.asset_id,
                 COALESCE(SUM(sf.amount::numeric), 0)::text AS "total_fee_amount"
             FROM pool_assets pa
              JOIN stableswap ss ON ss.id = pa."pool_id"
              JOIN swap s ON s.filler_id = ss.account_id AND s.para_block_height >= $2
              JOIN swap_fee sf ON sf.swap_id = s.id AND sf.asset_id = pa.asset_id
             GROUP BY pa."pool_id", pa.asset_id
         )
    SELECT
        af."pool_id",
        jsonb_agg(
                jsonb_build_object(
                        'asset_id', af.asset_id,
                        'total_fee_amount', af."total_fee_amount"
                )
        ) AS "asset_amounts"
    FROM asset_fee af
    GROUP BY af."pool_id";
`;

export const getLatestStableswapAssetBalance = `
  SELECT sa.pool_id as pool_id,
         json_agg(jsonb_build_object(
           'asset_id', sa.asset_id,
           'free_balance', sa.free_balance,
           'para_block_height', sa.para_block_height
                  )) AS asset_balances
  FROM stableswap_asset_historical_data_latest sa
  WHERE sa.pool_id = ANY ($1)
  GROUP BY sa.pool_id;
`;
