export const setApiState = `
  INSERT INTO support.api_state (id, asset_price_latest_processed_block)
  VALUES ($1, $2)
  ON CONFLICT (id)
    DO UPDATE
    SET asset_price_latest_processed_block = EXCLUDED.asset_price_latest_processed_block;
`;

export const getApiState = `
  SELECT * FROM support.api_state WHERE id = $1;
`;
