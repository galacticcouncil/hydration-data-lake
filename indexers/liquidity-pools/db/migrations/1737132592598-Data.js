module.exports = class Data1737132592598 {
    name = 'Data1737132592598'

    async up(db) {
        await db.query(`ALTER TABLE "swap" DROP COLUMN "trade_id"`)
        await db.query(`ALTER TABLE "account" ADD "account_type" character varying(10) NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "swap" ADD "trade_id" text`)
        await db.query(`ALTER TABLE "account" DROP COLUMN "account_type"`)
    }
}
