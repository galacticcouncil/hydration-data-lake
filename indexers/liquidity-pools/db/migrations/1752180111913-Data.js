module.exports = class Data1752180111913 {
    name = 'Data1752180111913'

    async up(db) {
        await db.query(`ALTER TABLE "processor_status" ADD "stableswap_hist_data_latest_block" integer`)
        await db.query(`ALTER TABLE "processor_status" ADD "omnipool_hist_data_latest_block" integer`)
        await db.query(`ALTER TABLE "processor_status" ADD "xykpool_hist_data_latest_block" integer`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "processor_status" DROP COLUMN "stableswap_hist_data_latest_block"`)
        await db.query(`ALTER TABLE "processor_status" DROP COLUMN "omnipool_hist_data_latest_block"`)
        await db.query(`ALTER TABLE "processor_status" DROP COLUMN "xykpool_hist_data_latest_block"`)
    }
}
