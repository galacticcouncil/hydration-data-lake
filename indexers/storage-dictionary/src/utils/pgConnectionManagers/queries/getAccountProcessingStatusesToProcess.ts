export const getAccountProcessingStatusesToProcess = `
  SELECT id,
         mm_reserve_balances_initialized_at_para_block,
         balances_aggregated_at_para_block
  FROM account_processing_status
  WHERE id != ALL($1::text[])  -- $1: array of account IDs to ignore
    AND (
    balances_aggregated_at_para_block IS NULL
     OR balances_aggregated_at_para_block + $3 <= $4  -- $3: period in blocks, $4: current block
    )
  ORDER BY
    CASE
        WHEN balances_aggregated_at_para_block IS NULL THEN 0
    ELSE 1
  END ASC,
    balances_aggregated_at_para_block ASC NULLS FIRST
  LIMIT $2;  -- $2: number of records to select
`;
