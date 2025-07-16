module.exports = class Data1752596495229 {
    name = 'Data1752596495229'

    async up(db) {
        await db.query(`CREATE TABLE "account_total_balance_historical_data" ("id" character varying NOT NULL, "total_transferable_norm" text NOT NULL, "total_locked_norm" text NOT NULL, "para_block_height" integer NOT NULL, "relay_block_height" integer NOT NULL, "account_id" character varying, "ref_asset_id" character varying, "block_id" character varying, CONSTRAINT "PK_bc0af68657cdea66829a44cee28" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_47d4a2754c7b4d23d756476ec1" ON "account_total_balance_historical_data" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_e23a6bd73cdb4f7e3778dc8aa7" ON "account_total_balance_historical_data" ("ref_asset_id") `)
        await db.query(`CREATE INDEX "IDX_4fd8abd64aeae7bb383b2fe3ba" ON "account_total_balance_historical_data" ("para_block_height") `)
        await db.query(`CREATE INDEX "IDX_82cb468fb3bcebd1dde8fd8fea" ON "account_total_balance_historical_data" ("block_id") `)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "transferable_in_ref_asset_norm" text`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "total_locked_in_ref_asset_norm" text`)
        await db.query(`ALTER TABLE "account_total_balance_historical_data" ADD CONSTRAINT "FK_47d4a2754c7b4d23d756476ec17" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "account_total_balance_historical_data" ADD CONSTRAINT "FK_e23a6bd73cdb4f7e3778dc8aa72" FOREIGN KEY ("ref_asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "account_total_balance_historical_data" ADD CONSTRAINT "FK_82cb468fb3bcebd1dde8fd8fead" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "account_total_balance_historical_data"`)
        await db.query(`DROP INDEX "public"."IDX_47d4a2754c7b4d23d756476ec1"`)
        await db.query(`DROP INDEX "public"."IDX_e23a6bd73cdb4f7e3778dc8aa7"`)
        await db.query(`DROP INDEX "public"."IDX_4fd8abd64aeae7bb383b2fe3ba"`)
        await db.query(`DROP INDEX "public"."IDX_82cb468fb3bcebd1dde8fd8fea"`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "transferable_in_ref_asset_norm"`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "total_locked_in_ref_asset_norm"`)
        await db.query(`ALTER TABLE "account_total_balance_historical_data" DROP CONSTRAINT "FK_47d4a2754c7b4d23d756476ec17"`)
        await db.query(`ALTER TABLE "account_total_balance_historical_data" DROP CONSTRAINT "FK_e23a6bd73cdb4f7e3778dc8aa72"`)
        await db.query(`ALTER TABLE "account_total_balance_historical_data" DROP CONSTRAINT "FK_82cb468fb3bcebd1dde8fd8fead"`)
    }
}
