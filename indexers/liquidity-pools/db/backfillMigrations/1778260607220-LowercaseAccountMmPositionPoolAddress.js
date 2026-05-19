/*
 * Migration: lowercase `pool_address` in `account_mm_position_historical_data`
 * for rows with `para_block_height > 12320000`.
 *
 * Reason: pool_address was being persisted with mixed-case H160 hex (checksum
 * form) for newer blocks, while the rest of the codebase compares EVM
 * addresses in lowercase. Normalising to lowercase aligns this column with
 * the convention used elsewhere and makes joins/lookups by pool_address
 * deterministic.
 *
 * Volume: ~956k rows on prod (verified via orca-prod-102-read-only). A single
 * blanket UPDATE would hold row locks for the entire run and bloat WAL; we
 * batch in chunks of 10k via repeated UPDATE ... WHERE id IN (SELECT ... LIMIT)
 * until no rows remain.
 *
 * Note on transactional shape: the SQD/TypeORM migration runner wraps each
 * migration in a single transaction, so we cannot COMMIT between batches the
 * way a plpgsql DO block could. Each iteration is still a separate statement,
 * which keeps individual lock-acquisition windows small; the surrounding
 * transaction is what the runner manages. If running this against a very busy
 * prod DB and the transaction-length is a concern, the equivalent batched SQL
 * can be executed manually outside the migration runner.
 *
 * Idempotency: the WHERE clause filters on `pool_address <> LOWER(pool_address)`,
 * so re-running the migration after completion is a no-op.
 *
 * No `down`: the original mixed-case values are not recoverable from the
 * lowercased form.
 */

const PARA_BLOCK_HEIGHT_THRESHOLD = 12320000;
const BATCH_SIZE = 10000;

module.exports = class LowercaseAccountMmPositionPoolAddress1778260607220 {
  name = 'LowercaseAccountMmPositionPoolAddress1778260607220';

  async up(db) {
    let totalUpdated = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = await db.query(
        `
        WITH cte AS (
          SELECT "id"
          FROM "account_mm_position_historical_data"
          WHERE "para_block_height" > ${PARA_BLOCK_HEIGHT_THRESHOLD}
            AND "pool_address" IS NOT NULL
            AND "pool_address" <> LOWER("pool_address")
          LIMIT ${BATCH_SIZE}
        )
        UPDATE "account_mm_position_historical_data" t
        SET "pool_address" = LOWER(t."pool_address")
        FROM cte
        WHERE t."id" = cte."id"
        `
      );

      const updated = typeof result === 'object' && result !== null && 'rowCount' in result
        ? Number(result.rowCount) || 0
        : Array.isArray(result) && typeof result[1] === 'number'
          ? result[1]
          : 0;

      totalUpdated += updated;
      console.log(
        `[LowercaseAccountMmPositionPoolAddress] batch updated: ${updated}, total: ${totalUpdated}`
      );

      if (updated === 0) break;
    }
  }

  async down(db) {
    // No reverse migration. See header comment.
  }
};