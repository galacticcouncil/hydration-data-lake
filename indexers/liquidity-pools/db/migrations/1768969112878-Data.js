module.exports = class Data1768969112878 {
    name = 'Data1768969112878'

    async up(db) {
        await db.query(`CREATE TABLE "mm_minted_to_treasury" ("id" character varying NOT NULL, "trace_ids" text array, "asset_id" text NOT NULL, "amount" numeric, "para_block_height" integer NOT NULL, "event_id" character varying, CONSTRAINT "PK_6eabfde651d1ac22adad2d9b122" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_397142f25b4121c41862a0de81" ON "mm_minted_to_treasury" ("para_block_height") `)
        await db.query(`CREATE INDEX "IDX_c250a7a2c36161b69313c68562" ON "mm_minted_to_treasury" ("event_id") `)
        await db.query(`ALTER TABLE "money_market_event" ADD "minted_to_treasury_id" character varying`)
        await db.query(`CREATE INDEX "IDX_4f80094e38e786da45f2a70846" ON "money_market_event" ("minted_to_treasury_id") `)
        await db.query(`ALTER TABLE "mm_minted_to_treasury" ADD CONSTRAINT "FK_c250a7a2c36161b69313c685623" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "money_market_event" ADD CONSTRAINT "FK_4f80094e38e786da45f2a70846e" FOREIGN KEY ("minted_to_treasury_id") REFERENCES "mm_minted_to_treasury"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "mm_minted_to_treasury"`)
        await db.query(`DROP INDEX "public"."IDX_397142f25b4121c41862a0de81"`)
        await db.query(`DROP INDEX "public"."IDX_c250a7a2c36161b69313c68562"`)
        await db.query(`ALTER TABLE "money_market_event" DROP COLUMN "minted_to_treasury_id"`)
        await db.query(`DROP INDEX "public"."IDX_4f80094e38e786da45f2a70846"`)
        await db.query(`ALTER TABLE "mm_minted_to_treasury" DROP CONSTRAINT "FK_c250a7a2c36161b69313c685623"`)
        await db.query(`ALTER TABLE "money_market_event" DROP CONSTRAINT "FK_4f80094e38e786da45f2a70846e"`)
    }
}
