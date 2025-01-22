module.exports = class Data1736784159931 {
    name = 'Data1736784159931'

    async up(db) {
        await db.query(`ALTER TABLE "dca_schedule_execution_action" DROP CONSTRAINT "FK_2ea29fabaf7e05c3546723086e2"`)
        await db.query(`DROP INDEX "public"."IDX_b5e76a3b57e6d4ce71262668c7"`)
        await db.query(`DROP INDEX "public"."IDX_2ea29fabaf7e05c3546723086e"`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" DROP COLUMN "swap_id"`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" DROP COLUMN "operation_id"`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" ADD "operation_ids" text array`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "dca_schedule_execution_action" ADD CONSTRAINT "FK_2ea29fabaf7e05c3546723086e2" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`CREATE INDEX "IDX_b5e76a3b57e6d4ce71262668c7" ON "dca_schedule_execution_action" ("operation_id") `)
        await db.query(`CREATE INDEX "IDX_2ea29fabaf7e05c3546723086e" ON "dca_schedule_execution_action" ("swap_id") `)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" ADD "swap_id" character varying`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" ADD "operation_id" text`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" DROP COLUMN "operation_ids"`)
    }
}
