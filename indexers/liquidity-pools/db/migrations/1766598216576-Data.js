module.exports = class Data1766598216576 {
    name = 'Data1766598216576'

    async up(db) {
        await db.query(`ALTER TABLE "asset_spot_price_historical_data" RENAME COLUMN "price_route" TO "price_route_id"`)
        await db.query(`CREATE TABLE "asset_spot_price_route" ("id" character varying NOT NULL, "route" jsonb NOT NULL, "filler_addresses" text array NOT NULL, "asset_path" text array NOT NULL, "hop_count" integer NOT NULL, CONSTRAINT "PK_c8f22c395207f69962e8a1ea0ee" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "asset_spot_price_historical_data" DROP COLUMN "price_route_id"`)
        await db.query(`ALTER TABLE "asset_spot_price_historical_data" ADD "price_route_id" character varying`)
        await db.query(`CREATE INDEX "IDX_6e40260a566cef4fc7c897fb09" ON "asset_spot_price_historical_data" ("price_route_id") `)
        await db.query(`ALTER TABLE "asset_spot_price_historical_data" ADD CONSTRAINT "FK_6e40260a566cef4fc7c897fb092" FOREIGN KEY ("price_route_id") REFERENCES "asset_spot_price_route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "asset_spot_price_historical_data" RENAME COLUMN "price_route_id" TO "price_route"`)
        await db.query(`DROP TABLE "asset_spot_price_route"`)
        await db.query(`ALTER TABLE "asset_spot_price_historical_data" ADD "price_route_id" jsonb NOT NULL`)
        await db.query(`ALTER TABLE "asset_spot_price_historical_data" DROP COLUMN "price_route_id"`)
        await db.query(`DROP INDEX "public"."IDX_6e40260a566cef4fc7c897fb09"`)
        await db.query(`ALTER TABLE "asset_spot_price_historical_data" DROP CONSTRAINT "FK_6e40260a566cef4fc7c897fb092"`)
    }
}
