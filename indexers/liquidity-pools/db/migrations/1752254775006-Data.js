module.exports = class Data1752254775006 {
    name = 'Data1752254775006'

    async up(db) {
        await db.query(`ALTER TABLE "processor_status" ADD "aavepool_hist_data_latest_block" integer`)
        await db.query(`ALTER TABLE "aavepool_historical_data" ADD "tvl_in_ref_asset_norm" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "processor_status" DROP COLUMN "aavepool_hist_data_latest_block"`)
        await db.query(`ALTER TABLE "aavepool_historical_data" DROP COLUMN "tvl_in_ref_asset_norm"`)
    }
}
