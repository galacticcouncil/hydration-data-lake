module.exports = class Data1735308293537 {
    name = 'Data1735308293537'

    async up(db) {
        await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "status_memo"`)
        await db.query(`ALTER TABLE "dca_schedule" ADD "status_memo" jsonb`)
        await db.query(`ALTER TABLE "dca_schedule_execution" DROP COLUMN "status_memo"`)
        await db.query(`ALTER TABLE "dca_schedule_execution" ADD "status_memo" jsonb`)
        await db.query(`ALTER TABLE "dca_randomness_generation_failed_error" DROP COLUMN "error"`)
        await db.query(`ALTER TABLE "dca_randomness_generation_failed_error" ADD "error" jsonb`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "dca_schedule" ADD "status_memo" text`)
        await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "status_memo"`)
        await db.query(`ALTER TABLE "dca_schedule_execution" ADD "status_memo" text`)
        await db.query(`ALTER TABLE "dca_schedule_execution" DROP COLUMN "status_memo"`)
        await db.query(`ALTER TABLE "dca_randomness_generation_failed_error" ADD "error" text`)
        await db.query(`ALTER TABLE "dca_randomness_generation_failed_error" DROP COLUMN "error"`)
    }
}
