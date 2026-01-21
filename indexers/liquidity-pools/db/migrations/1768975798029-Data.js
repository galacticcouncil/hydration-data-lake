module.exports = class Data1768975798029 {
    name = 'Data1768975798029'

    async up(db) {
        await db.query(`CREATE TABLE "mm_minted_to_treasury_event" ("id" character varying NOT NULL, "trace_ids" text array, "asset_id" text NOT NULL, "amount" numeric, "para_block_height" integer NOT NULL, "event_id" character varying, CONSTRAINT "PK_c250a7a2c36161b69313c685623" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7fcebf169811005659b6e40f72" ON "mm_minted_to_treasury_event" ("para_block_height") `)
        await db.query(`CREATE INDEX "IDX_4581c6474be70bc72afa4dc039" ON "mm_minted_to_treasury_event" ("event_id") `)
        await db.query(`ALTER TABLE "money_market_event" ADD "minted_to_treasury_id" character varying`)
        await db.query(`CREATE INDEX "IDX_4f80094e38e786da45f2a70846" ON "money_market_event" ("minted_to_treasury_id") `)
        await db.query(`ALTER TABLE "mm_minted_to_treasury_event" ADD CONSTRAINT "FK_4581c6474be70bc72afa4dc0395" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "money_market_event" ADD CONSTRAINT "FK_4f80094e38e786da45f2a70846e" FOREIGN KEY ("minted_to_treasury_id") REFERENCES "mm_minted_to_treasury_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "mm_minted_to_treasury_event"`)
        await db.query(`DROP INDEX "public"."IDX_7fcebf169811005659b6e40f72"`)
        await db.query(`DROP INDEX "public"."IDX_4581c6474be70bc72afa4dc039"`)
        await db.query(`ALTER TABLE "money_market_event" DROP COLUMN "minted_to_treasury_id"`)
        await db.query(`DROP INDEX "public"."IDX_4f80094e38e786da45f2a70846"`)
        await db.query(`ALTER TABLE "mm_minted_to_treasury_event" DROP CONSTRAINT "FK_4581c6474be70bc72afa4dc0395"`)
        await db.query(`ALTER TABLE "money_market_event" DROP CONSTRAINT "FK_4f80094e38e786da45f2a70846e"`)
    }
}
