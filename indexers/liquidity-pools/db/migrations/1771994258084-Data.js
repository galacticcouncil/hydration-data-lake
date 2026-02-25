module.exports = class Data1771994258084 {
    name = 'Data1771994258084'

    async up(db) {
        await db.query(`CREATE TABLE "account_total_balance_historical_data_log" ("id" character varying NOT NULL, "account_id" text NOT NULL, "asset_id" text NOT NULL, "source" text NOT NULL, "memo" text, "transferable" numeric, "total_locked" numeric, "transferable_norm" text, "total_locked_norm" text, "para_block_height" integer NOT NULL, CONSTRAINT "PK_3454b9ff281f9bae1c8dede58b7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_6e6939d11f55b6c36e4d7fa74c" ON "account_total_balance_historical_data_log" ("para_block_height") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "account_total_balance_historical_data_log"`)
        await db.query(`DROP INDEX "public"."IDX_6e6939d11f55b6c36e4d7fa74c"`)
    }
}
