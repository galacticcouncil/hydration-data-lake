module.exports = class Data1777828197757 {
    name = 'Data1777828197757'

    async up(db) {
        await db.query(`CREATE TABLE "account_owned_asset" ("id" character varying NOT NULL, "account_id" text NOT NULL, "asset_id" text NOT NULL, "first_seen_para_block_height" integer NOT NULL, CONSTRAINT "PK_de69a252bef9e5fa58be69252ac" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ee210efbd3f5996ff8b63fbfc6" ON "account_owned_asset" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_499707ef2e68a85fa9b24b54c2" ON "account_owned_asset" ("asset_id") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "account_owned_asset"`)
        await db.query(`DROP INDEX "public"."IDX_ee210efbd3f5996ff8b63fbfc6"`)
        await db.query(`DROP INDEX "public"."IDX_499707ef2e68a85fa9b24b54c2"`)
    }
}
