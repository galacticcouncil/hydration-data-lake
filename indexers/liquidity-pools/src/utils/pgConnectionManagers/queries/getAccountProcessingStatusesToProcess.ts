/**
 * Selects accounts due for periodical balances reaggregation.
 *
 * Two improvements over a single ORDER BY ... LIMIT:
 *
 * 1. NULL-preemption cap (~50%): Without a cap, a flood of newly-created
 *    accounts (balances_aggregated_at_para_block IS NULL) would monopolize
 *    every batch via NULLS FIRST and starve the overdue queue. We split the
 *    batch into two quotas — at most ~50% NULLs, the rest overdue — with the
 *    NULL leg's unused capacity spilling to the overdue leg. For BATCH_SIZE=1
 *    we alternate legs by current-block parity to avoid one leg always winning.
 *
 * 2. Random tie-break: Many accounts share the same
 *    balances_aggregated_at_para_block (e.g. cold-start backfill writes the
 *    same block to all). Deterministic tie-break by id causes the same prefix
 *    to win every call, starving the tail. random() at LIMIT-N cost is cheap.
 *
 * Params: $1 ignore-ids, $2 batch size, $3 min period blocks, $4 current block.
 */
export const getAccountProcessingStatusesToProcess = `
  WITH params AS (
    SELECT
      $2::int AS limit_total,
      CASE
        WHEN $2::int = 1 THEN ($4::int % 2)
        ELSE $2::int / 2
      END AS null_cap
  ),
  nulls_picked AS (
    SELECT id,
           mm_reserve_balances_initialized_at_para_block,
           balances_aggregated_at_para_block
    FROM account_processing_status
    WHERE id != ALL($1::text[])
      AND balances_aggregated_at_para_block IS NULL
    ORDER BY random()
    LIMIT (SELECT null_cap FROM params)
  ),
  overdue_picked AS (
    SELECT id,
           mm_reserve_balances_initialized_at_para_block,
           balances_aggregated_at_para_block
    FROM account_processing_status
    WHERE id != ALL($1::text[])
      AND balances_aggregated_at_para_block IS NOT NULL
      AND balances_aggregated_at_para_block + $3 <= $4
    ORDER BY balances_aggregated_at_para_block ASC, random()
    LIMIT (SELECT limit_total - (SELECT count(*)::int FROM nulls_picked) FROM params)
  )
  SELECT * FROM nulls_picked
  UNION ALL
  SELECT * FROM overdue_picked;
`;

export const getWhitelistedAccountProcessingStatusesToProcess = `
  SELECT id,
         mm_reserve_balances_initialized_at_para_block,
         balances_aggregated_at_para_block
  FROM account_processing_status
  WHERE id = ANY($1::text[])
    AND (
      balances_aggregated_at_para_block IS NULL
      OR balances_aggregated_at_para_block + $2 <= $3
    )
  ORDER BY
    CASE
        WHEN balances_aggregated_at_para_block IS NULL THEN 0
    ELSE 1
  END ASC,
    balances_aggregated_at_para_block ASC NULLS FIRST;
`;