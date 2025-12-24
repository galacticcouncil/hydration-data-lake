module.exports = class Data1766506404569 {
    name = 'Data1766506404569'

    async up(db) {
        await db.query(`ALTER TABLE "account" ADD "mm_reserve_balances_initialized" boolean`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "account" DROP COLUMN "mm_reserve_balances_initialized"`)
    }
}
