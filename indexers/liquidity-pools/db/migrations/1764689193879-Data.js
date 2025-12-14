module.exports = class Data1764689193879 {
    name = 'Data1764689193879'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_a43f6c5ad23ad480ddbeb15022"`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position_event" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" DROP COLUMN "para_block_height"`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "omnipool_asset_liquidity_event" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "omnipool_global_farm" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "omnipool_yield_farm" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "omnipool_yield_farm_deposit_event" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "omnipool_yield_farm_deposit" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "xyk_yield_farm" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "xyk_global_farm" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "xyk_yield_farm_deposit_event" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "xyk_yield_farm_deposit" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "transaction_payment_historical_data" DROP COLUMN "relay_block_height"`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" ADD "created_at_para_block_height" integer NOT NULL DEFAULT 0`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" ADD "destroyed_at_para_block_height" integer`)
        await db.query(`ALTER TABLE "asset_volume_historical_data" ALTER COLUMN "total_volume_in_norm" DROP NOT NULL`)
        await db.query(`ALTER TABLE "asset_volume_historical_data" ALTER COLUMN "total_volume_out_norm" DROP NOT NULL`)
        await db.query(`CREATE INDEX "IDX_9d9a9ff9ef0f407c1eadd76ad9" ON "omnipool_liquidity_position" ("created_at_para_block_height") `)
        await db.query(`CREATE INDEX "IDX_2277659d3fc2396ef01b014ebd" ON "omnipool_liquidity_position" ("destroyed_at_para_block_height") `)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_a43f6c5ad23ad480ddbeb15022" ON "omnipool_liquidity_position" ("para_block_height") `)
        await db.query(`ALTER TABLE "omnipool_liquidity_position_event" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" ADD "para_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_asset_liquidity_event" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_global_farm" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_yield_farm" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_yield_farm_deposit_event" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_yield_farm_deposit" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "xyk_yield_farm" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "xyk_global_farm" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "xyk_yield_farm_deposit_event" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "xyk_yield_farm_deposit" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "transaction_payment_historical_data" ADD "relay_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" DROP COLUMN "created_at_para_block_height"`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" DROP COLUMN "destroyed_at_para_block_height"`)
        await db.query(`ALTER TABLE "asset_volume_historical_data" ALTER COLUMN "total_volume_in_norm" SET NOT NULL`)
        await db.query(`ALTER TABLE "asset_volume_historical_data" ALTER COLUMN "total_volume_out_norm" SET NOT NULL`)
        await db.query(`DROP INDEX "public"."IDX_9d9a9ff9ef0f407c1eadd76ad9"`)
        await db.query(`DROP INDEX "public"."IDX_2277659d3fc2396ef01b014ebd"`)
    }
}
