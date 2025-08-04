export const getLatestAavepoolHistData = `
  SELECT *
  FROM aavepool_historical_data
  WHERE a_token_registry_id = $2
    AND reserve_asset_registry_id = $1
  ORDER BY para_block_height DESC
    LIMIT 1;
`;
