export const getLatestAssetHistoricalData = `
  SELECT DISTINCT ON (asset_id)
    id,
    asset_id,
    total_issuance,
    dynamic_fee,
    usd_price_normalised,
    para_block_height
  FROM asset_historical_data
  WHERE asset_id = ANY($1::text[])
    AND para_block_height < $2
  ORDER BY asset_id, para_block_height DESC;
`;
