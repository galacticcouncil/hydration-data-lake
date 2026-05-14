/*
 * Migration: prefix existing money_market_reserve ids (and all dependent ids)
 * with the legacy pool implementation proxy address so the schema becomes
 * `${poolImplementationProxyAddress}-${underlyingAssetAddress}` to support
 * multiple deployed Aave money markets.
 *
 * Affected tables:
 *  - money_market_reserve.id
 *  - mm_reserve_config_historical_data.id, .reserve_id  (~22 rows local, low volume in prod)
 *  - mm_reserve_indexes_historical_data.id, .reserve_id (~1M rows in prod — main perf concern)
 *  - aavepool.money_market_reserve_id
 *
 * Idempotency / safety check:
 *  Each row's id is detected as already-migrated by counting hyphens — old
 *  ids contain exactly the structure they were originally written with:
 *    money_market_reserve.id                      → 0 hyphens (raw underlying)
 *    aavepool.money_market_reserve_id             → 0 hyphens (FK to above)
 *    mm_reserve_config_historical_data.id         → 1 hyphen  (`${reserve_id}-${block}`)
 *    mm_reserve_indexes_historical_data.id        → 1 hyphen  (same shape)
 *  After migration each gains exactly one extra hyphen from the prefix join.
 *  We use `LENGTH(id) - LENGTH(REPLACE(id, '-', ''))` as the hyphen counter
 *  because it stays in C-level string ops and avoids per-row array allocation.
 *  Rows with the post-migration hyphen count are skipped — robust against
 *  partial reruns and against the prefix coincidentally matching some legacy
 *  id (which can't happen with the parts-count check).
 *
 * Strategy:
 *  1. Drop the three foreign key constraints so child rows can be rewritten
 *     independently of the parent.
 *  2. Update the parent (money_market_reserve.id) for any row that does not
 *     yet carry the extra hyphen.
 *  3. For the 1M-row mm_reserve_indexes_historical_data:
 *       - Drop the secondary index on reserve_id and the PK BEFORE the bulk
 *         UPDATE so the update is sequential I/O instead of HOT-update +
 *         per-row index thrash.
 *       - Run a single UPDATE that rewrites both id and reserve_id.
 *       - Rebuild the PK and the reserve_id index.
 *     The other two child tables are tiny — straightforward UPDATE is fine.
 *  4. Recreate the foreign keys.
 *
 * No `down` migration is provided. Reversing this would rewrite the same
 * 1M-row table again with no automated way to verify the originals weren't
 * intentionally already prefixed by code running after this migration ran.
 */

const POOL_IMPL_PROXY_ADDRESS = '0x1b02e051683b5cfac5929c25e84adb26ecf87b38';

// Hyphen counts for the *legacy* (pre-migration) shape of each column.
// A row whose count exceeds the legacy value is treated as already migrated.
const LEGACY_HYPHENS_PARENT_ID = 0;       // money_market_reserve.id
const LEGACY_HYPHENS_AAVEPOOL_FK = 0;     // aavepool.money_market_reserve_id
const LEGACY_HYPHENS_HISTDATA_ID = 1;     // ${reserve_id}-${block}
const LEGACY_HYPHENS_HISTDATA_FK = 0;     // mm_reserve_*.reserve_id

const HYPHEN_COUNT_EXPR = (col) =>
  `(LENGTH(${col}) - LENGTH(REPLACE(${col}, '-', '')))`;

module.exports = class MoneyMarketReserveIdPrefixWithPoolImpl1777391124129 {
  name = 'MoneyMarketReserveIdPrefixWithPoolImpl1777391124129';

  async up(db) {
    // ----- 1. Drop foreign keys -----
    await db.query(`
      ALTER TABLE "aavepool"
      DROP CONSTRAINT IF EXISTS "FK_50218a357bb16db3279d205f405"
    `);
    await db.query(`
      ALTER TABLE "mm_reserve_config_historical_data"
      DROP CONSTRAINT IF EXISTS "FK_5d6690e9f25d7e5dc3e5575b471"
    `);
    await db.query(`
      ALTER TABLE "mm_reserve_indexes_historical_data"
      DROP CONSTRAINT IF EXISTS "FK_31be250211fef14ca5b2912357e"
    `);

    // ----- 2. Update parent: money_market_reserve -----
    await db.query(
      `
      UPDATE "money_market_reserve"
      SET "id" = $1 || '-' || LOWER("id")
      WHERE ${HYPHEN_COUNT_EXPR('"id"')} = ${LEGACY_HYPHENS_PARENT_ID}
      `,
      [POOL_IMPL_PROXY_ADDRESS]
    );

    // ----- 3a. aavepool.money_market_reserve_id (small) -----
    await db.query(
      `
      UPDATE "aavepool"
      SET "money_market_reserve_id" = $1 || '-' || LOWER("money_market_reserve_id")
      WHERE "money_market_reserve_id" IS NOT NULL
        AND ${HYPHEN_COUNT_EXPR('"money_market_reserve_id"')} = ${LEGACY_HYPHENS_AAVEPOOL_FK}
      `,
      [POOL_IMPL_PROXY_ADDRESS]
    );

    // ----- 3b. mm_reserve_config_historical_data (small) -----
    // id was `${reserve_id}-${block}` (1 hyphen) → becomes 2 hyphens.
    // reserve_id was raw underlying (0 hyphens) → becomes 1 hyphen.
    // We gate on reserve_id's legacy count so the row passes the check
    // when *both* columns are still in legacy shape. id and reserve_id
    // are written together, so they stay in sync after migration.
    await db.query(
      `
      UPDATE "mm_reserve_config_historical_data"
      SET
        "id" = $1 || '-' || LOWER("id"),
        "reserve_id" = $1 || '-' || LOWER("reserve_id")
      WHERE ${HYPHEN_COUNT_EXPR('"reserve_id"')} = ${LEGACY_HYPHENS_HISTDATA_FK}
        AND ${HYPHEN_COUNT_EXPR('"id"')} = ${LEGACY_HYPHENS_HISTDATA_ID}
      `,
      [POOL_IMPL_PROXY_ADDRESS]
    );

    // ----- 3c. mm_reserve_indexes_historical_data (large, ~1M rows in prod) -----
    // Drop indexes first, do the bulk rewrite, recreate them. Rewriting the
    // PK column with the index in place would force a per-row index update;
    // dropping & rebuilding is dramatically faster on large tables.
    await db.query(`
      DROP INDEX IF EXISTS "IDX_31be250211fef14ca5b2912357"
    `);
    await db.query(`
      ALTER TABLE "mm_reserve_indexes_historical_data"
      DROP CONSTRAINT IF EXISTS "PK_68630dee5ca4012e569bdc139a8"
    `);

    await db.query(
      `
      UPDATE "mm_reserve_indexes_historical_data"
      SET
        "id" = $1 || '-' || LOWER("id"),
        "reserve_id" = $1 || '-' || LOWER("reserve_id")
      WHERE ${HYPHEN_COUNT_EXPR('"reserve_id"')} = ${LEGACY_HYPHENS_HISTDATA_FK}
        AND ${HYPHEN_COUNT_EXPR('"id"')} = ${LEGACY_HYPHENS_HISTDATA_ID}
      `,
      [POOL_IMPL_PROXY_ADDRESS]
    );

    await db.query(`
      ALTER TABLE "mm_reserve_indexes_historical_data"
      ADD CONSTRAINT "PK_68630dee5ca4012e569bdc139a8" PRIMARY KEY ("id")
    `);
    await db.query(`
      CREATE INDEX "IDX_31be250211fef14ca5b2912357"
      ON "mm_reserve_indexes_historical_data" ("reserve_id")
    `);

    // ----- 4. Recreate foreign keys -----
    await db.query(`
      ALTER TABLE "aavepool"
      ADD CONSTRAINT "FK_50218a357bb16db3279d205f405"
      FOREIGN KEY ("money_market_reserve_id")
      REFERENCES "money_market_reserve"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await db.query(`
      ALTER TABLE "mm_reserve_config_historical_data"
      ADD CONSTRAINT "FK_5d6690e9f25d7e5dc3e5575b471"
      FOREIGN KEY ("reserve_id")
      REFERENCES "money_market_reserve"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await db.query(`
      ALTER TABLE "mm_reserve_indexes_historical_data"
      ADD CONSTRAINT "FK_31be250211fef14ca5b2912357e"
      FOREIGN KEY ("reserve_id")
      REFERENCES "money_market_reserve"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  async down(db) {
    // No reverse migration. See header comment.
  }
};
