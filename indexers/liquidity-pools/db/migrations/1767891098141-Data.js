module.exports = class Data1767891098141 {
    name = 'Data1767891098141'

    async up(db) {
        await db.query(`CREATE TABLE "account_processing_status" ("id" character varying NOT NULL, "mm_reserve_balances_initialized_at_para_block" integer, "balances_aggregated_at_para_block" integer, CONSTRAINT "PK_8de22a6ab0dba093037dfffa490" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "account" DROP COLUMN "mm_reserve_balances_initialized"`)
    }

    async down(db) {
        await db.query(`DROP TABLE "account_processing_status"`)
        await db.query(`ALTER TABLE "account" ADD "mm_reserve_balances_initialized" boolean`)
    }
}
