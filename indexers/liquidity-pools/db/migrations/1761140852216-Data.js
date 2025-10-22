module.exports = class Data1761140852216 {
  name = 'Data1761140852216';

  async up(db) {
    await db.query(
      `CREATE TABLE "account_asset_balance_latest" ("id" character varying NOT NULL, "account_id" text NOT NULL, "asset_id" text NOT NULL, "transferable" numeric NOT NULL, "total_locked" numeric NOT NULL, "transferable_in_ref_asset_norm" text, "total_locked_in_ref_asset_norm" text, "total" numeric NOT NULL, "para_block_height" integer NOT NULL, "block_id" text NOT NULL, CONSTRAINT "PK_26cac3022e83cd9e402f391a3bc" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE INDEX "IDX_c348accf5aae45241880b7067d" ON "account_asset_balance_latest" ("account_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_f59c03208fcf3eb5569a628453" ON "account_asset_balance_latest" ("asset_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_829143094d2db714f0ec343941" ON "account_asset_balance_latest" ("total") `
    );
  }

  async down(db) {
    await db.query(`DROP TABLE "account_asset_balance_latest"`);
    await db.query(`DROP INDEX "public"."IDX_c348accf5aae45241880b7067d"`);
    await db.query(`DROP INDEX "public"."IDX_f59c03208fcf3eb5569a628453"`);
    await db.query(`DROP INDEX "public"."IDX_829143094d2db714f0ec343941"`);
  }
};
