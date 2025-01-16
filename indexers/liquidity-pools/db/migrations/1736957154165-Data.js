module.exports = class Data1736957154165 {
    name = 'Data1736957154165'

    async up(db) {
        await db.query(`ALTER TABLE "otc_order" ADD "total_filled_amount_in" numeric`)
        await db.query(`ALTER TABLE "otc_order" ADD "total_filled_amount_out" numeric`)
        await db.query(`ALTER TABLE "dca_schedule" ADD "total_executed_amount_in" numeric`)
        await db.query(`ALTER TABLE "dca_schedule" ADD "total_executed_amount_out" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "otc_order" DROP COLUMN "total_filled_amount_in"`)
        await db.query(`ALTER TABLE "otc_order" DROP COLUMN "total_filled_amount_out"`)
        await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "total_executed_amount_in"`)
        await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "total_executed_amount_out"`)
    }
}
