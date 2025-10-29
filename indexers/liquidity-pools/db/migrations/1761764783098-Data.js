module.exports = class Data1761764783098 {
    name = 'Data1761764783098'

    async up(db) {
        await db.query(`CREATE TABLE "stableswap_asset_historical_data_latest" ("id" character varying NOT NULL, "asset_id" text NOT NULL, "pool_id" text NOT NULL, "stableswap_asset_id" text NOT NULL, "pool_historical_data_id" text NOT NULL, "free_balance" numeric NOT NULL, "tradable" integer, "tvl_in_ref_asset_norm" text, "para_block_height" integer NOT NULL, "block_id" text NOT NULL, CONSTRAINT "PK_6ef98ab91280a0719d9fe30690e" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "stableswap_asset_historical_data_latest"`)
    }
}
