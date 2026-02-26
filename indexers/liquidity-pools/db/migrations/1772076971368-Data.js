module.exports = class Data1772076971368 {
    name = 'Data1772076971368'

    async up(db) {
        await db.query(`CREATE TABLE "account_liquidity_balance_historical_data" ("id" character varying NOT NULL, "liquidity_type" character varying(16) NOT NULL, "account_id" text NOT NULL, "asset_id" text NOT NULL, "position_id" text, "deposit_id" text, "liquidity_amount" numeric NOT NULL, "hub_liquidity_amount" numeric, "liquidity_amount_norm" text, "hub_liquidity_amount_norm" text, "para_block_height" integer NOT NULL, CONSTRAINT "PK_f7717c31db8f82d1db7b483917c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_15274d9f917779fea21974458c" ON "account_liquidity_balance_historical_data" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_6079b9f9321b1f8dad65ba660a" ON "account_liquidity_balance_historical_data" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_20a94c4a9224677b1bcc962723" ON "account_liquidity_balance_historical_data" ("para_block_height") `)
        await db.query(`CREATE TABLE "account_liquidity_balance_latest" ("id" character varying NOT NULL, "liquidity_type" character varying(16) NOT NULL, "account_id" text NOT NULL, "asset_id" text NOT NULL, "position_id" text, "deposit_id" text, "liquidity_amount" numeric NOT NULL, "hub_liquidity_amount" numeric, "liquidity_amount_norm" text, "hub_liquidity_amount_norm" text, "para_block_height" integer NOT NULL, CONSTRAINT "PK_065becdf3097190cf998b11f9df" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_124954cd7dc7c552f0f2d0e96e" ON "account_liquidity_balance_latest" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_2bd676cd0226c4e9a4f8b30ed9" ON "account_liquidity_balance_latest" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_e4880e877f81a76b997b765b06" ON "account_liquidity_balance_latest" ("para_block_height") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "account_liquidity_balance_historical_data"`)
        await db.query(`DROP INDEX "public"."IDX_15274d9f917779fea21974458c"`)
        await db.query(`DROP INDEX "public"."IDX_6079b9f9321b1f8dad65ba660a"`)
        await db.query(`DROP INDEX "public"."IDX_20a94c4a9224677b1bcc962723"`)
        await db.query(`DROP TABLE "account_liquidity_balance_latest"`)
        await db.query(`DROP INDEX "public"."IDX_124954cd7dc7c552f0f2d0e96e"`)
        await db.query(`DROP INDEX "public"."IDX_2bd676cd0226c4e9a4f8b30ed9"`)
        await db.query(`DROP INDEX "public"."IDX_e4880e877f81a76b997b765b06"`)
    }
}
