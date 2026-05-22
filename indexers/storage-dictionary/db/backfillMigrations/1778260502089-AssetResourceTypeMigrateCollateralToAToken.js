/*
 * Migration: rename existing `asset.resource_type = 'Collateral'` rows to
 * `'aToken'`. The schema enum was extended (Underlying, Collateral, Debt → +
 * aToken) so aTokens can be distinguished from regular collateral. Historically
 * the indexer assigned `Collateral` to aTokens; that bucket is being repurposed
 * to mean only "aToken" going forward.
 *
 * `asset.resource_type` is `varchar(10)` so 'aToken' (6 chars) fits without
 * any column-type change.
 *
 * Idempotent: gating on the legacy value means a rerun is a no-op.
 */
module.exports = class AssetResourceTypeMigrateCollateralToAToken1778260502089 {
  name = 'AssetResourceTypeMigrateCollateralToAToken1778260502089';

  async up(db) {
    await db.query(
      `UPDATE "asset" SET "resource_type" = 'aToken' WHERE "resource_type" = 'Collateral'`
    );
  }

  async down(db) {
    await db.query(
      `UPDATE "asset" SET "resource_type" = 'Collateral' WHERE "resource_type" = 'aToken'`
    );
  }
};
