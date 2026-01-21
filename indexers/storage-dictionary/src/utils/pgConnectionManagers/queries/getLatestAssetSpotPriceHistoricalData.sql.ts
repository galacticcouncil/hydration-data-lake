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
