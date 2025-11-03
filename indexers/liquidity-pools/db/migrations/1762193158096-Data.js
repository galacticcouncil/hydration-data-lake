module.exports = class Data1762193158096 {
    name = 'Data1762193158096'

    async up(db) {
        await db.query(`CREATE TABLE "omnipool_asset_historical_data_latest" ("id" character varying NOT NULL, "omnipool_asset_id" text NOT NULL, "asset_id" text NOT NULL, "asset_cap" numeric NOT NULL, "asset_shares" numeric NOT NULL, "asset_hub_reserve" numeric NOT NULL, "asset_protocol_shares" numeric NOT NULL, "free_balance" numeric NOT NULL, "para_block_height" integer NOT NULL, "block_id" text NOT NULL, CONSTRAINT "PK_1dc6a4c78fab8b57369c2d00dfe" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_eed1b3d6cecaabcb69bc6ad65b" ON "omnipool_asset_historical_data_latest" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_7d3f0a0a8e6c534a76011102ac" ON "omnipool_asset_historical_data_latest" ("para_block_height") `)
        await db.query(`CREATE TABLE "stableswap_asset_historical_data_latest" ("id" character varying NOT NULL, "asset_id" text NOT NULL, "pool_id" text NOT NULL, "stableswap_asset_id" text NOT NULL, "pool_historical_data_id" text NOT NULL, "free_balance" numeric NOT NULL, "para_block_height" integer NOT NULL, "block_id" text NOT NULL, CONSTRAINT "PK_6ef98ab91280a0719d9fe30690e" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_8e98cbbe36f2abc6eccbacdadc" ON "stableswap_asset_historical_data_latest" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_1b643a2681cf43d67a7dfcfcc9" ON "stableswap_asset_historical_data_latest" ("para_block_height") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "omnipool_asset_historical_data_latest"`)
        await db.query(`DROP INDEX "public"."IDX_eed1b3d6cecaabcb69bc6ad65b"`)
        await db.query(`DROP INDEX "public"."IDX_7d3f0a0a8e6c534a76011102ac"`)
        await db.query(`DROP TABLE "stableswap_asset_historical_data_latest"`)
        await db.query(`DROP INDEX "public"."IDX_8e98cbbe36f2abc6eccbacdadc"`)
        await db.query(`DROP INDEX "public"."IDX_1b643a2681cf43d67a7dfcfcc9"`)
    }
}
