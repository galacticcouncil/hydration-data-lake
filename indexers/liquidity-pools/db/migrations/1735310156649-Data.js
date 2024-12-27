module.exports = class Data1735310156649 {
    name = 'Data1735310156649'

    async up(db) {
        await db.query(`CREATE TABLE "dca_schedule_execution_action" ("id" character varying NOT NULL, "operation_id" text, "trace_ids" text array, "status" character varying(8), "status_memo" jsonb, "relay_chain_block_height" integer NOT NULL, "para_chain_block_height" integer NOT NULL, "schedule_execution_id" character varying, CONSTRAINT "PK_1940f8cc1af97e1030f49eb6c87" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b5e76a3b57e6d4ce71262668c7" ON "dca_schedule_execution_action" ("operation_id") `)
        await db.query(`CREATE INDEX "IDX_22496859c9628ca39a1ed156a8" ON "dca_schedule_execution_action" ("schedule_execution_id") `)
        await db.query(`CREATE INDEX "IDX_a1e38808f07f899aa72e94ae74" ON "dca_schedule_execution_action" ("status") `)
        await db.query(`CREATE INDEX "IDX_5f3b87801c034148a4d0eafd1a" ON "dca_schedule_execution_action" ("para_chain_block_height") `)
        await db.query(`ALTER TABLE "dca_schedule_execution" DROP COLUMN "status_memo"`)
        await db.query(`ALTER TABLE "dca_schedule" ADD "operation_id" text`)
        await db.query(`ALTER TABLE "dca_schedule" ADD "trace_ids" text array`)
        await db.query(`ALTER TABLE "dca_randomness_generation_failed_error" ADD "operation_id" text`)
        await db.query(`ALTER TABLE "dca_randomness_generation_failed_error" ADD "trace_ids" text array`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" ADD CONSTRAINT "FK_22496859c9628ca39a1ed156a82" FOREIGN KEY ("schedule_execution_id") REFERENCES "dca_schedule_execution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "dca_schedule_execution_action"`)
        await db.query(`DROP INDEX "public"."IDX_b5e76a3b57e6d4ce71262668c7"`)
        await db.query(`DROP INDEX "public"."IDX_22496859c9628ca39a1ed156a8"`)
        await db.query(`DROP INDEX "public"."IDX_a1e38808f07f899aa72e94ae74"`)
        await db.query(`DROP INDEX "public"."IDX_5f3b87801c034148a4d0eafd1a"`)
        await db.query(`ALTER TABLE "dca_schedule_execution" ADD "status_memo" jsonb`)
        await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "operation_id"`)
        await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "trace_ids"`)
        await db.query(`ALTER TABLE "dca_randomness_generation_failed_error" DROP COLUMN "operation_id"`)
        await db.query(`ALTER TABLE "dca_randomness_generation_failed_error" DROP COLUMN "trace_ids"`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" DROP CONSTRAINT "FK_22496859c9628ca39a1ed156a82"`)
    }
}
