module.exports = class Data1766759140558 {
  name = 'Data1766759140558';

  async up(db) {
    // Drop foreign key constraints first
    await db.query(
      `ALTER TABLE "mm_borrow" DROP CONSTRAINT "FK_85c5cc7d0e5c8040b03c658e607"`
    );
    await db.query(
      `ALTER TABLE "omnipool_liquidity_position" DROP CONSTRAINT "FK_f816c476852b85c944f259c1913"`
    );
    await db.query(`DROP INDEX "public"."IDX_85c5cc7d0e5c8040b03c658e60"`);
    await db.query(`DROP INDEX "public"."IDX_f816c476852b85c944f259c191"`);

    // Create new table
    await db.query(
      `CREATE TABLE "xykpool_historical_data_latest" ("id" character varying NOT NULL, "asset_a_id" text NOT NULL, "asset_b_id" text NOT NULL, "asset_a_balance" numeric NOT NULL, "asset_b_balance" numeric NOT NULL, "tvl_in_ref_asset_norm" text, "para_block_height" integer NOT NULL, "pool_id" character varying, CONSTRAINT "PK_83b2f01dddbb335483317b8aba9" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE INDEX "IDX_7ecb0b7c0e73a67f8300923626" ON "xykpool_historical_data_latest" ("pool_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_a483666c8a0b2c28effdcf87fa" ON "xykpool_historical_data_latest" ("para_block_height") `
    );

    // For mm_borrow: preserve data by converting asset_id to text
    // Store the current asset_id values in a temporary column
    await db.query(`ALTER TABLE "mm_borrow" ADD "asset_id_temp" text`);
    await db.query(
      `UPDATE "mm_borrow" SET "asset_id_temp" = CAST("asset_id" AS text)`
    );
    await db.query(`ALTER TABLE "mm_borrow" DROP COLUMN "asset_id"`);
    await db.query(
      `ALTER TABLE "mm_borrow" RENAME COLUMN "asset_id_temp" TO "asset_id"`
    );

    // For omnipool_liquidity_position: preserve data by converting account_id to text
    await db.query(
      `ALTER TABLE "omnipool_liquidity_position" ADD "account_id_temp" text`
    );
    await db.query(
      `UPDATE "omnipool_liquidity_position" SET "account_id_temp" = CAST("account_id" AS text)`
    );
    await db.query(
      `ALTER TABLE "omnipool_liquidity_position" DROP COLUMN "account_id"`
    );
    await db.query(
      `ALTER TABLE "omnipool_liquidity_position" RENAME COLUMN "account_id_temp" TO "account_id"`
    );

    // Add the foreign key for xykpool_historical_data_latest
    await db.query(
      `ALTER TABLE "xykpool_historical_data_latest" ADD CONSTRAINT "FK_7ecb0b7c0e73a67f83009236260" FOREIGN KEY ("pool_id") REFERENCES "xykpool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(db) {
    await db.query(
      `ALTER TABLE "mm_borrow" ADD CONSTRAINT "FK_85c5cc7d0e5c8040b03c658e607" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "omnipool_liquidity_position" ADD CONSTRAINT "FK_f816c476852b85c944f259c1913" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `CREATE INDEX "IDX_85c5cc7d0e5c8040b03c658e60" ON "mm_borrow" ("asset_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_f816c476852b85c944f259c191" ON "omnipool_liquidity_position" ("account_id") `
    );
    await db.query(`DROP TABLE "xykpool_historical_data_latest"`);
    await db.query(`DROP INDEX "public"."IDX_7ecb0b7c0e73a67f8300923626"`);
    await db.query(`DROP INDEX "public"."IDX_a483666c8a0b2c28effdcf87fa"`);
    await db.query(`ALTER TABLE "mm_borrow" ADD "asset_id" character varying`);
    await db.query(`ALTER TABLE "mm_borrow" DROP COLUMN "asset_id"`);
    await db.query(
      `ALTER TABLE "omnipool_liquidity_position" ADD "account_id" character varying`
    );
    await db.query(
      `ALTER TABLE "omnipool_liquidity_position" DROP COLUMN "account_id"`
    );
    await db.query(
      `ALTER TABLE "xykpool_historical_data_latest" DROP CONSTRAINT "FK_7ecb0b7c0e73a67f83009236260"`
    );
  }
};
