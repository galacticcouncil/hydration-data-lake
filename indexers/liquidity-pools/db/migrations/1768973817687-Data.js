module.exports = class Data1768973817687 {
    name = 'Data1768973817687'

    async up(db) {
        await db.query(`CREATE TABLE "liquidation_liquidated_event" ("id" character varying NOT NULL, "trace_ids" text array, "account_id" text NOT NULL, "collateral_asset_id" text NOT NULL, "debt_asset_id" text NOT NULL, "profit" numeric NOT NULL, "para_block_height" integer NOT NULL, "event_id" character varying, CONSTRAINT "PK_ee0afb1841c0e2b62c4f1dc4241" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_3dcb1bcb4877b5e0940a74f6e8" ON "liquidation_liquidated_event" ("para_block_height") `)
        await db.query(`CREATE INDEX "IDX_957694138c299331b07e2e936c" ON "liquidation_liquidated_event" ("event_id") `)
        await db.query(`ALTER TABLE "liquidation_liquidated_event" ADD CONSTRAINT "FK_957694138c299331b07e2e936c3" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "liquidation_liquidated_event"`)
        await db.query(`DROP INDEX "public"."IDX_3dcb1bcb4877b5e0940a74f6e8"`)
        await db.query(`DROP INDEX "public"."IDX_957694138c299331b07e2e936c"`)
        await db.query(`ALTER TABLE "liquidation_liquidated_event" DROP CONSTRAINT "FK_957694138c299331b07e2e936c3"`)
    }
}
