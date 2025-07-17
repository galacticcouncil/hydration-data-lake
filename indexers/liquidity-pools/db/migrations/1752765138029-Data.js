module.exports = class Data1752765138029 {
    name = 'Data1752765138029'

    async up(db) {
        await db.query(`ALTER TABLE "account_total_balance_historical_data" ADD "total_debt_norm" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "account_total_balance_historical_data" DROP COLUMN "total_debt_norm"`)
    }
}
