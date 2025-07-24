module.exports = class Data1753118470629 {
    name = 'Data1753118470629'

    async up(db) {
        await db.query(`CREATE TABLE "account_asset_balance_historical_data" ("id" character varying NOT NULL, "account_id" text NOT NULL, "asset_id" text NOT NULL, "transferable" text NOT NULL, "total_locked" text NOT NULL, "para_block_height" integer NOT NULL, CONSTRAINT "PK_8e6366a12aeb9840bed55c759c6" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ea5ffa2627d39535cf463998d3" ON "account_asset_balance_historical_data" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_aae70116750a3b7fa020d18564" ON "account_asset_balance_historical_data" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_508f3309210c595461e3d7f7e6" ON "account_asset_balance_historical_data" ("para_block_height") `)
        await db.query(`CREATE TABLE "account_mm_position_historical_data" ("id" character varying NOT NULL, "account_id" text NOT NULL, "account_bound_evm_address" text, "total_collateral_base" text NOT NULL, "total_debt_base" text NOT NULL, "available_borrows_base" text NOT NULL, "current_liquidation_threshold" text NOT NULL, "ltv" text NOT NULL, "health_factor" text, "pool_address" text NOT NULL, "para_block_height" integer NOT NULL, CONSTRAINT "PK_5065a7b1305290be9e3239ad588" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e18fdac6be5ef90a988891bae2" ON "account_mm_position_historical_data" ("para_block_height") `)
        await db.query(`ALTER TABLE "asset" ADD "resource_type" character varying(10)`)
    }

    async down(db) {
        await db.query(`DROP TABLE "account_asset_balance_historical_data"`)
        await db.query(`DROP INDEX "public"."IDX_ea5ffa2627d39535cf463998d3"`)
        await db.query(`DROP INDEX "public"."IDX_aae70116750a3b7fa020d18564"`)
        await db.query(`DROP INDEX "public"."IDX_508f3309210c595461e3d7f7e6"`)
        await db.query(`DROP TABLE "account_mm_position_historical_data"`)
        await db.query(`DROP INDEX "public"."IDX_e18fdac6be5ef90a988891bae2"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "resource_type"`)
    }
}
