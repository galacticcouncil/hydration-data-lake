/*
 * Migration: rewrite account_mm_position_historical_data.id from the legacy
 * shape `${accountId}-${paraBlockHeight}` to
 * `${accountId}-${poolAddress}-${paraBlockHeight}`.
 *
 * Reason: with one Aave market the existing id was unique, but the loop in
 * `handleAccountMmPositionDataUpdate` already wrote one row per market into
 * `ctx.batchState.state.accountMmPositionHistoricalData`. The single-market
 * deployment masked a latent collision — once a second market is configured
 * the second iteration overwrites the first under the same id. Including
 * `poolAddress` in the id makes the key unique across markets.
 *
 * Performance: ~2M rows on prod. Pattern matches
 * `1777391124129-MoneyMarketReserveIdPrefixWithPoolImpl`:
 *   1) Drop the PK so the bulk UPDATE doesn't pay per-row PK index
 *      maintenance.
 *   2) Single UPDATE rewriting `id` from `account_id`, `pool_address`,
 *      `para_block_height` already on the row — no external lookup needed.
 *   3) Recreate the PK.
 *
 * The non-PK index `IDX_e18fdac6be5ef90a988891bae2` on `para_block_height` is
 * untouched — its column isn't being rewritten.
 *
 * No FKs reference `account_mm_position_historical_data.id` (verified across
 * all migration files).
 *
 * Idempotency: gate on hyphen count = 1 (legacy shape has exactly one hyphen
 * between account_id and para_block_height; both account_id and pool_address
 * contain no hyphens). After migration the row has 2 hyphens and is skipped
 * on re-run.
 *
 * No `down` — reverse would have to strip pool_address from id, but the legacy
 * id is no longer recoverable in a way that distinguishes it from rows that
 * were always written in the new shape after this migration ran.
 */

const HYPHEN_COUNT_EXPR = (col) =>
  `(LENGTH(${col}) - LENGTH(REPLACE(${col}, '-', '')))`;

const LEGACY_HYPHENS_ID = 1; // ${accountId}-${paraBlockHeight}

module.exports = class AccountMmPositionIdIncludePoolAddress1778260607224 {
  name = 'AccountMmPositionIdIncludePoolAddress1778260607224';

  async up(db) {
    // 1. Drop the PK constraint
    await db.query(`
      ALTER TABLE "account_mm_position_historical_data"
      DROP CONSTRAINT IF EXISTS "PK_5065a7b1305290be9e3239ad588"
    `);

    // 2. Bulk rewrite ids
    await db.query(`
      UPDATE "account_mm_position_historical_data"
      SET "id" = "account_id" || '-' || "pool_address" || '-' || "para_block_height"::text
      WHERE ${HYPHEN_COUNT_EXPR('"id"')} = ${LEGACY_HYPHENS_ID}
    `);

    // 3. Recreate the PK
    await db.query(`
      ALTER TABLE "account_mm_position_historical_data"
      ADD CONSTRAINT "PK_5065a7b1305290be9e3239ad588" PRIMARY KEY ("id")
    `);
  }

  async down(db) {
    // No reverse migration. See header comment.
  }
};
