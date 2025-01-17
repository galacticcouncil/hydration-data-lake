module.exports = class Data1737049414394 {
    name = 'Data1737049414394'

    async up(db) {
        await db.query(`ALTER TABLE "swap" DROP CONSTRAINT "FK_8535ed5de6c43f2bd0a5eeded6f"`)
        await db.query(`DROP INDEX "public"."IDX_8535ed5de6c43f2bd0a5eeded6"`)
        await db.query(`ALTER TABLE "swap" DROP COLUMN "filler_context_id"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "swap" ADD CONSTRAINT "FK_8535ed5de6c43f2bd0a5eeded6f" FOREIGN KEY ("filler_context_id") REFERENCES "swap_filler_context"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`CREATE INDEX "IDX_8535ed5de6c43f2bd0a5eeded6" ON "swap" ("filler_context_id") `)
        await db.query(`ALTER TABLE "swap" ADD "filler_context_id" character varying`)
    }
}
