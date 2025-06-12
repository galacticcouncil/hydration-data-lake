module.exports = class Data1744826755978 {
    name = 'Data1744826755978'

    async up(db) {
        await db.query(`ALTER TABLE "mm_supply" ADD "initiated_by_trade_id" character varying`)
        await db.query(`ALTER TABLE "mm_withdraw" ADD "initiated_by_trade_id" character varying`)
        await db.query(`CREATE INDEX "IDX_2e04f6906aabbad52eec983383" ON "mm_supply" ("initiated_by_trade_id") `)
        await db.query(`CREATE INDEX "IDX_3f8b06939980b2698d1caad0f6" ON "mm_withdraw" ("initiated_by_trade_id") `)
        await db.query(`ALTER TABLE "mm_supply" ADD CONSTRAINT "FK_2e04f6906aabbad52eec9833834" FOREIGN KEY ("initiated_by_trade_id") REFERENCES "routed_trade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "mm_withdraw" ADD CONSTRAINT "FK_3f8b06939980b2698d1caad0f66" FOREIGN KEY ("initiated_by_trade_id") REFERENCES "routed_trade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "mm_supply" DROP COLUMN "initiated_by_trade_id"`)
        await db.query(`ALTER TABLE "mm_withdraw" DROP COLUMN "initiated_by_trade_id"`)
        await db.query(`DROP INDEX "public"."IDX_2e04f6906aabbad52eec983383"`)
        await db.query(`DROP INDEX "public"."IDX_3f8b06939980b2698d1caad0f6"`)
        await db.query(`ALTER TABLE "mm_supply" DROP CONSTRAINT "FK_2e04f6906aabbad52eec9833834"`)
        await db.query(`ALTER TABLE "mm_withdraw" DROP CONSTRAINT "FK_3f8b06939980b2698d1caad0f66"`)
    }
}
