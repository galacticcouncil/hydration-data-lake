module.exports = class Data1752856763047 {
    name = 'Data1752856763047'

    async up(db) {
        await db.query(`ALTER TABLE "account_mm_position_historical_data" ADD "account_bound_evm_address" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "account_mm_position_historical_data" DROP COLUMN "account_bound_evm_address"`)
    }
}
