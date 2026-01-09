export const setApiState = `
  INSERT INTO support.api_state (id, asset_price_latest_processed_block, acc_total_balance_latest_proc_block)
  VALUES ($1, $2, $3)
  ON CONFLICT (id)
    DO UPDATE
    SET
      asset_price_latest_processed_block = COALESCE(EXCLUDED.asset_price_latest_processed_block, support.api_state.asset_price_latest_processed_block),
      acc_total_balance_latest_proc_block = COALESCE(EXCLUDED.acc_total_balance_latest_proc_block, support.api_state.acc_total_balance_latest_proc_block);

`;

export const getApiState = `
  SELECT * FROM support.api_state WHERE id = $1;
`;
