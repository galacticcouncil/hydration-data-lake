export const getLatestAssetSpotPriceHistoricalData = `
  SELECT
    lateral_data.id,
    lateral_data.asset_in_id,
    lateral_data.asset_out_id,
    lateral_data.price,
    lateral_data.price_normalised,
    lateral_data.price_route_id,
    lateral_data.para_block_height
  FROM UNNEST($1::text[]) AS asset_in_id_param
  CROSS JOIN LATERAL (
    SELECT id, asset_in_id, asset_out_id, price, price_normalised, price_route_id, para_block_height
    FROM asset_spot_price_historical_data
    WHERE asset_in_id = asset_in_id_param
      AND asset_out_id = $2
      AND para_block_height < $3
    ORDER BY para_block_height DESC
      LIMIT 1
  ) AS lateral_data;
`;

export const getLatestAssetSpotPriceHistoricalDataByAssetRegistryId = `
  SELECT
    lateral_data.id,
    lateral_data.asset_in_id,
    lateral_data.asset_out_id,
    lateral_data.price,
    lateral_data.price_normalised,
    lateral_data.price_route_id,
    lateral_data.para_block_height
  FROM UNNEST($1::text[]) AS asset_registry_id_param
  CROSS JOIN LATERAL (
    SELECT asphd.id, asphd.asset_in_id, asphd.asset_out_id, asphd.price,
           asphd.price_normalised, asphd.price_route_id, asphd.para_block_height
    FROM asset_spot_price_historical_data asphd
           JOIN asset asset_in ON asset_in.id = asphd.asset_in_id
    WHERE asset_in.asset_registry_id = asset_registry_id_param
      AND asphd.asset_out_id = $2
      AND asphd.para_block_height < $3
    ORDER BY asphd.para_block_height DESC
      LIMIT 1
  ) AS lateral_data;
`;
