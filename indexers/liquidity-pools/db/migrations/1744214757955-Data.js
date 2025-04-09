module.exports = class Data1744214757955 {
    name = 'Data1744214757955'

    async up(db) {
        await db.query(`ALTER TABLE "omnipool_asset_historical_data" ADD "pool_historical_data_id" character varying`)
        await db.query(`CREATE INDEX "IDX_3ac9fc37331b184364dc356628" ON "omnipool_asset_historical_data" ("pool_historical_data_id") `)
        await db.query(`ALTER TABLE "omnipool_asset_historical_data" ADD CONSTRAINT "FK_3ac9fc37331b184364dc356628c" FOREIGN KEY ("pool_historical_data_id") REFERENCES "omnipool_historical_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "omnipool_asset_historical_data" DROP COLUMN "pool_historical_data_id"`)
        await db.query(`DROP INDEX "public"."IDX_3ac9fc37331b184364dc356628"`)
        await db.query(`ALTER TABLE "omnipool_asset_historical_data" DROP CONSTRAINT "FK_3ac9fc37331b184364dc356628c"`)
    }
}
