export const getLatestAssetHistoricalData = `
  SELECT
    lateral_data.id,
    lateral_data.asset_id,
    lateral_data.total_issuance,
    lateral_data.dynamic_fee,
    lateral_data.usd_price_normalised,
    lateral_data.para_block_height
  FROM UNNEST($1::text[]) AS asset_id_param
  CROSS JOIN LATERAL (
    SELECT id, asset_id, total_issuance, dynamic_fee, usd_price_normalised, para_block_height
    FROM asset_historical_data
    WHERE asset_id = asset_id_param
      AND para_block_height < $2
    ORDER BY para_block_height DESC
    LIMIT 1
  ) AS lateral_data;
`;
