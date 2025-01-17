module.exports = class Data1737055089650 {
    name = 'Data1737055089650'

    async up(db) {
        await db.query(`ALTER TABLE "swap" DROP COLUMN "hub_amount_in"`)
        await db.query(`ALTER TABLE "swap" DROP COLUMN "hub_amount_out"`)
        await db.query(`ALTER TABLE "swap" ADD "trade_id" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "swap" ADD "hub_amount_in" numeric`)
        await db.query(`ALTER TABLE "swap" ADD "hub_amount_out" numeric`)
        await db.query(`ALTER TABLE "swap" DROP COLUMN "trade_id"`)
    }
}
