export const getAccTotalBalancesByBlocksRange = `
    SELECT
      atb.id AS id,
      atb.account_id AS account_id,
      atb.total_transferable_norm AS total_transferable_norm,
      atb.total_locked_norm AS total_locked_norm,
      atb.total_debt_norm AS total_debt_norm,
      (EXTRACT(EPOCH FROM b.timestamp) * 1000)::bigint AS block_timestamp,
      atb.para_block_height AS para_block_height
    FROM account_total_balance_historical_data atb
        JOIN block b ON b.height = atb.para_block_height
    WHERE atb.para_block_height >= $1 AND atb.para_block_height <= $2
    ORDER BY atb.para_block_height ASC;
`;

export const getFirstAvailableAccTotalBalanceEntity = `
    SELECT
        atb.id AS id,
        atb.para_block_height AS para_block_height
    FROM account_total_balance_historical_data atb
    ORDER BY atb.para_block_height ASC
      LIMIT 1;
`;
