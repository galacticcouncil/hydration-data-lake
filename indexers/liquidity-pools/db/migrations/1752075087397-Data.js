module.exports = class Data1752075087397 {
    name = 'Data1752075087397'

    async up(db) {
        await db.query(`ALTER TABLE "lbppool_historical_data" ADD "tvl_in_ref_asset_norm" text`)
        await db.query(`ALTER TABLE "xykpool_historical_data" ADD "tvl_in_ref_asset_norm" text`)
        await db.query(`ALTER TABLE "xykpool" ADD "tvl_in_ref_asset_norm" text`)
        await db.query(`ALTER TABLE "omnipool_historical_data" ADD "tvl_total_in_ref_asset_norm" text`)
        await db.query(`ALTER TABLE "omnipool_asset_historical_data" ADD "tvl_in_ref_asset_norm" text`)
        await db.query(`ALTER TABLE "stableswap_asset_historical_data" ADD "tvl_in_ref_asset_norm" text`)
        await db.query(`ALTER TABLE "stableswap_historical_data" ADD "tvl_total_in_ref_asset_norm" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "lbppool_historical_data" DROP COLUMN "tvl_in_ref_asset_norm"`)
        await db.query(`ALTER TABLE "xykpool_historical_data" DROP COLUMN "tvl_in_ref_asset_norm"`)
        await db.query(`ALTER TABLE "xykpool" DROP COLUMN "tvl_in_ref_asset_norm"`)
        await db.query(`ALTER TABLE "omnipool_historical_data" DROP COLUMN "tvl_total_in_ref_asset_norm"`)
        await db.query(`ALTER TABLE "omnipool_asset_historical_data" DROP COLUMN "tvl_in_ref_asset_norm"`)
        await db.query(`ALTER TABLE "stableswap_asset_historical_data" DROP COLUMN "tvl_in_ref_asset_norm"`)
        await db.query(`ALTER TABLE "stableswap_historical_data" DROP COLUMN "tvl_total_in_ref_asset_norm"`)
    }
}
