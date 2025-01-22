module.exports = class Data1735649819769 {
    name = 'Data1735649819769'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_60b3be7a7f33092b638316e029"`)
        await db.query(`ALTER TABLE "otc_order" DROP COLUMN "operation_id"`)
        await db.query(`ALTER TABLE "otc_order" DROP COLUMN "trace_ids"`)
        await db.query(`ALTER TABLE "otc_order_action" DROP COLUMN "status"`)
        await db.query(`ALTER TABLE "otc_order_action" ADD "kind" character varying(16)`)
        await db.query(`ALTER TABLE "otc_order_action" ADD "filler_id" character varying`)
        await db.query(`CREATE INDEX "IDX_8a94be0b3a732aef0ebd0eee5c" ON "otc_order_action" ("kind") `)
        await db.query(`CREATE INDEX "IDX_0d2ac36ac1f86ec683c9ebfe28" ON "otc_order_action" ("filler_id") `)
        await db.query(`ALTER TABLE "otc_order_action" ADD CONSTRAINT "FK_0d2ac36ac1f86ec683c9ebfe282" FOREIGN KEY ("filler_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_60b3be7a7f33092b638316e029" ON "otc_order_action" ("status") `)
        await db.query(`ALTER TABLE "otc_order" ADD "operation_id" text`)
        await db.query(`ALTER TABLE "otc_order" ADD "trace_ids" text array`)
        await db.query(`ALTER TABLE "otc_order_action" ADD "status" character varying(16)`)
        await db.query(`ALTER TABLE "otc_order_action" DROP COLUMN "kind"`)
        await db.query(`ALTER TABLE "otc_order_action" DROP COLUMN "filler_id"`)
        await db.query(`DROP INDEX "public"."IDX_8a94be0b3a732aef0ebd0eee5c"`)
        await db.query(`DROP INDEX "public"."IDX_0d2ac36ac1f86ec683c9ebfe28"`)
        await db.query(`ALTER TABLE "otc_order_action" DROP CONSTRAINT "FK_0d2ac36ac1f86ec683c9ebfe282"`)
    }
}
