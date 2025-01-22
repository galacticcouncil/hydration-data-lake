module.exports = class Data1731937885668 {
    name = 'Data1731937885668'

    async up(db) {
        await db.query(`ALTER TABLE "lbp_pool_assets_data" ADD "relay_chain_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "lbp_pool" ADD "relay_chain_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "xyk_pool_assets_data" ADD "relay_chain_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "xyk_pool" ADD "relay_chain_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_asset_data" ADD "relay_chain_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "stablepool_asset_data" ADD "relay_chain_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "stablepool" ADD "relay_chain_block_height" integer NOT NULL`)
        await db.query(`CREATE INDEX "IDX_f9282a2174896418d2831e6275" ON "lbp_pool_assets_data" ("relay_chain_block_height") `)
        await db.query(`CREATE INDEX "IDX_cdd199915733a6b2d8140ae93c" ON "lbp_pool" ("relay_chain_block_height") `)
        await db.query(`CREATE INDEX "IDX_3dccbf4a3798e72035768e765e" ON "xyk_pool_assets_data" ("relay_chain_block_height") `)
        await db.query(`CREATE INDEX "IDX_00ad7a9187d91ffd467095de53" ON "xyk_pool" ("relay_chain_block_height") `)
        await db.query(`CREATE INDEX "IDX_4b2f1be3120c850e5310ddb333" ON "omnipool_asset_data" ("relay_chain_block_height") `)
        await db.query(`CREATE INDEX "IDX_3f92f60dae40bf58dcab920910" ON "stablepool_asset_data" ("relay_chain_block_height") `)
        await db.query(`CREATE INDEX "IDX_23d57c81e7f4fd458c4dc7f8a0" ON "stablepool" ("relay_chain_block_height") `)
    }

    async down(db) {
        await db.query(`ALTER TABLE "lbp_pool_assets_data" DROP COLUMN "relay_chain_block_height"`)
        await db.query(`ALTER TABLE "lbp_pool" DROP COLUMN "relay_chain_block_height"`)
        await db.query(`ALTER TABLE "xyk_pool_assets_data" DROP COLUMN "relay_chain_block_height"`)
        await db.query(`ALTER TABLE "xyk_pool" DROP COLUMN "relay_chain_block_height"`)
        await db.query(`ALTER TABLE "omnipool_asset_data" DROP COLUMN "relay_chain_block_height"`)
        await db.query(`ALTER TABLE "stablepool_asset_data" DROP COLUMN "relay_chain_block_height"`)
        await db.query(`ALTER TABLE "stablepool" DROP COLUMN "relay_chain_block_height"`)
        await db.query(`DROP INDEX "public"."IDX_f9282a2174896418d2831e6275"`)
        await db.query(`DROP INDEX "public"."IDX_cdd199915733a6b2d8140ae93c"`)
        await db.query(`DROP INDEX "public"."IDX_3dccbf4a3798e72035768e765e"`)
        await db.query(`DROP INDEX "public"."IDX_00ad7a9187d91ffd467095de53"`)
        await db.query(`DROP INDEX "public"."IDX_4b2f1be3120c850e5310ddb333"`)
        await db.query(`DROP INDEX "public"."IDX_3f92f60dae40bf58dcab920910"`)
        await db.query(`DROP INDEX "public"."IDX_23d57c81e7f4fd458c4dc7f8a0"`)
    }
}
