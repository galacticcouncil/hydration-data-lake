module.exports = class Data1755617253995 {
    name = 'Data1755617253995'

    async up(db) {
        await db.query(`ALTER TABLE "hsmpool_asset_historical_data" ADD "facilitator_hist_data_id" character varying`)
        await db.query(`ALTER TABLE "money_market_event" DROP COLUMN "event_name"`)
        await db.query(`ALTER TABLE "money_market_event" ADD "event_name" character varying(32)`)
        await db.query(`CREATE INDEX "IDX_24168d44d86c910f7e4889ca26" ON "hsmpool_asset_historical_data" ("facilitator_hist_data_id") `)
        await db.query(`ALTER TABLE "hsmpool_asset_historical_data" ADD CONSTRAINT "FK_24168d44d86c910f7e4889ca269" FOREIGN KEY ("facilitator_hist_data_id") REFERENCES "aave_facilitator_historical_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "hsmpool_asset_historical_data" DROP COLUMN "facilitator_hist_data_id"`)
        await db.query(`ALTER TABLE "money_market_event" ADD "event_name" character varying(31) NOT NULL`)
        await db.query(`ALTER TABLE "money_market_event" DROP COLUMN "event_name"`)
        await db.query(`DROP INDEX "public"."IDX_24168d44d86c910f7e4889ca26"`)
        await db.query(`ALTER TABLE "hsmpool_asset_historical_data" DROP CONSTRAINT "FK_24168d44d86c910f7e4889ca269"`)
    }
}
