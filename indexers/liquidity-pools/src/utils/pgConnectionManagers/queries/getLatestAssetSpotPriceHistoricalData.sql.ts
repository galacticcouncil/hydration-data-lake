export const getLatestAssetSpotPriceHistoricalData = `
  SELECT DISTINCT ON (asset_in_id)
    id,
    asset_in_id,
    asset_out_id,
    price,
    price_normalised,
    price_route_id,
    para_block_height
  FROM asset_spot_price_historical_data
  WHERE asset_in_id = ANY($1::text[])
    AND para_block_height < $2
  ORDER BY asset_in_id, para_block_height DESC;
`;

export const getLatestAssetSpotPriceHistoricalDataByAssetRegistryId = `
  SELECT DISTINCT ON (asphd.asset_in_id)
    asphd.id AS id,
    asphd.asset_in_id AS asset_in_id,
    asphd.asset_out_id AS asset_out_id,
    asphd.price AS price,
    asphd.price_normalised AS price_normalised,
    asphd.price_route_id AS price_route_id,
    asphd.para_block_height AS para_block_height
  FROM asset_spot_price_historical_data asphd
    JOIN asset asset_in ON asset_in.id = asphd.asset_in_id
  WHERE asset_in.asset_registry_id = ANY($1::text[])
    AND asphd.para_block_height < $2
  ORDER BY asphd.asset_in_id, asphd.para_block_height DESC;
`;
