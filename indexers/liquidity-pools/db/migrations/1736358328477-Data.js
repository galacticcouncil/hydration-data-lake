module.exports = class Data1736358328477 {
    name = 'Data1736358328477'

    async up(db) {
        await db.query(`CREATE TABLE "swap_filler_context" ("id" character varying NOT NULL, "swap_id" character varying, "stablepool_id" character varying, "share_token_id" character varying, "otc_order_id" character varying, CONSTRAINT "PK_8535ed5de6c43f2bd0a5eeded6f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0265f867d67783ac376d5cd477" ON "swap_filler_context" ("swap_id") `)
        await db.query(`CREATE INDEX "IDX_542f63a65b94e1b3a2537f239e" ON "swap_filler_context" ("stablepool_id") `)
        await db.query(`CREATE INDEX "IDX_5f9040e9e46437a9bd75441872" ON "swap_filler_context" ("share_token_id") `)
        await db.query(`CREATE INDEX "IDX_a6b5f77093263e2d3a850f34b3" ON "swap_filler_context" ("otc_order_id") `)
        await db.query(`ALTER TABLE "swap" ADD "filler_context_id" character varying`)
        await db.query(`CREATE INDEX "IDX_8535ed5de6c43f2bd0a5eeded6" ON "swap" ("filler_context_id") `)
        await db.query(`ALTER TABLE "swap_filler_context" ADD CONSTRAINT "FK_0265f867d67783ac376d5cd4778" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "swap_filler_context" ADD CONSTRAINT "FK_542f63a65b94e1b3a2537f239e9" FOREIGN KEY ("stablepool_id") REFERENCES "stablepool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "swap_filler_context" ADD CONSTRAINT "FK_5f9040e9e46437a9bd754418725" FOREIGN KEY ("share_token_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "swap_filler_context" ADD CONSTRAINT "FK_a6b5f77093263e2d3a850f34b34" FOREIGN KEY ("otc_order_id") REFERENCES "otc_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "swap" ADD CONSTRAINT "FK_8535ed5de6c43f2bd0a5eeded6f" FOREIGN KEY ("filler_context_id") REFERENCES "swap_filler_context"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "swap_filler_context"`)
        await db.query(`DROP INDEX "public"."IDX_0265f867d67783ac376d5cd477"`)
        await db.query(`DROP INDEX "public"."IDX_542f63a65b94e1b3a2537f239e"`)
        await db.query(`DROP INDEX "public"."IDX_5f9040e9e46437a9bd75441872"`)
        await db.query(`DROP INDEX "public"."IDX_a6b5f77093263e2d3a850f34b3"`)
        await db.query(`ALTER TABLE "swap" DROP COLUMN "filler_context_id"`)
        await db.query(`DROP INDEX "public"."IDX_8535ed5de6c43f2bd0a5eeded6"`)
        await db.query(`ALTER TABLE "swap_filler_context" DROP CONSTRAINT "FK_0265f867d67783ac376d5cd4778"`)
        await db.query(`ALTER TABLE "swap_filler_context" DROP CONSTRAINT "FK_542f63a65b94e1b3a2537f239e9"`)
        await db.query(`ALTER TABLE "swap_filler_context" DROP CONSTRAINT "FK_5f9040e9e46437a9bd754418725"`)
        await db.query(`ALTER TABLE "swap_filler_context" DROP CONSTRAINT "FK_a6b5f77093263e2d3a850f34b34"`)
        await db.query(`ALTER TABLE "swap" DROP CONSTRAINT "FK_8535ed5de6c43f2bd0a5eeded6f"`)
    }
}
