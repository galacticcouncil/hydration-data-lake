export const getAssetSpotPriceHistDataByIds = `
  SELECT DISTINCT ON (asp.asset_in_id, asp.asset_out_id)
    asp.*
  FROM   asset_spot_price_historical_data AS asp
  WHERE  (asp.asset_in_id || '|' || asp.asset_out_id) = ANY($1::text[])
  ORDER  BY asp.asset_in_id,
    asp.asset_out_id,
    asp.para_block_height DESC;
`;
