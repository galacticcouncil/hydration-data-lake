module.exports = class Data1736702149041 {
    name = 'Data1736702149041'

    async up(db) {
        await db.query(`ALTER TABLE "swap" DROP CONSTRAINT "FK_cdeb57fc49ab9df38808386f1fa"`)
        await db.query(`DROP INDEX "public"."IDX_cdeb57fc49ab9df38808386f1f"`)
        await db.query(`ALTER TABLE "swap" RENAME COLUMN "dca_schedule_execution_id" TO "dca_schedule_execution_action_id"`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" ADD "swap_id" character varying`)
        await db.query(`CREATE INDEX "IDX_2ea29fabaf7e05c3546723086e" ON "dca_schedule_execution_action" ("swap_id") `)
        await db.query(`CREATE INDEX "IDX_01a8428ecd73bbd9809d8b243a" ON "swap" ("dca_schedule_execution_action_id") `)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" ADD CONSTRAINT "FK_2ea29fabaf7e05c3546723086e2" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "swap" ADD CONSTRAINT "FK_01a8428ecd73bbd9809d8b243ad" FOREIGN KEY ("dca_schedule_execution_action_id") REFERENCES "dca_schedule_execution_action"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "swap" ADD CONSTRAINT "FK_cdeb57fc49ab9df38808386f1fa" FOREIGN KEY ("dca_schedule_execution_id") REFERENCES "dca_schedule_execution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`CREATE INDEX "IDX_cdeb57fc49ab9df38808386f1f" ON "swap" ("dca_schedule_execution_id") `)
        await db.query(`ALTER TABLE "swap" RENAME COLUMN "dca_schedule_execution_action_id" TO "dca_schedule_execution_id"`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" DROP COLUMN "swap_id"`)
        await db.query(`DROP INDEX "public"."IDX_2ea29fabaf7e05c3546723086e"`)
        await db.query(`DROP INDEX "public"."IDX_01a8428ecd73bbd9809d8b243a"`)
        await db.query(`ALTER TABLE "dca_schedule_execution_action" DROP CONSTRAINT "FK_2ea29fabaf7e05c3546723086e2"`)
        await db.query(`ALTER TABLE "swap" DROP CONSTRAINT "FK_01a8428ecd73bbd9809d8b243ad"`)
    }
}
