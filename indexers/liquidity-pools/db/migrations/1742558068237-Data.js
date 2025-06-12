module.exports = class Data1742558068237 {
    name = 'Data1742558068237'

    async up(db) {
        await db.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_d1e21920952eec51e9626a210a1"`)
        await db.query(`DROP INDEX "public"."IDX_d1e21920952eec51e9626a210a"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "synthetic"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "active"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "asset_registry_asset_id"`)
        await db.query(`ALTER TABLE "asset" ADD "asset_registry_id" text`)
        await db.query(`ALTER TABLE "asset" ADD "multi_location_ids" text array`)
        await db.query(`ALTER TABLE "asset" ADD "multi_locations_metadata" jsonb`)
        await db.query(`ALTER TABLE "processor_status" ALTER COLUMN "latest_processed_block" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_d1e21920952eec51e9626a210a1" FOREIGN KEY ("asset_registry_asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`CREATE INDEX "IDX_d1e21920952eec51e9626a210a" ON "asset" ("asset_registry_asset_id") `)
        await db.query(`ALTER TABLE "asset" ADD "synthetic" boolean NOT NULL`)
        await db.query(`ALTER TABLE "asset" ADD "active" boolean NOT NULL`)
        await db.query(`ALTER TABLE "asset" ADD "asset_registry_asset_id" character varying`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "asset_registry_id"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "multi_location_ids"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "multi_locations_metadata"`)
        await db.query(`ALTER TABLE "processor_status" ALTER COLUMN "latest_processed_block" SET DEFAULT '0'`)
    }
}
