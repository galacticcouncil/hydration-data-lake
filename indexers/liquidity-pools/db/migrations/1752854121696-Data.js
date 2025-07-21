module.exports = class Data1752854121696 {
    name = 'Data1752854121696'

    async up(db) {
        await db.query(`CREATE TABLE "account_mm_position_historical_data" ("id" character varying NOT NULL, "total_collateral_base" text NOT NULL, "total_debt_base" text NOT NULL, "available_borrows_base" text NOT NULL, "current_liquidation_threshold" text NOT NULL, "ltv" text NOT NULL, "health_factor" text, "pool_address" text NOT NULL, "para_block_height" integer NOT NULL, "relay_block_height" integer NOT NULL, "account_id" character varying, "block_id" character varying, CONSTRAINT "PK_5065a7b1305290be9e3239ad588" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_be5a909cedcf1db8cda6c18cbc" ON "account_mm_position_historical_data" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_e18fdac6be5ef90a988891bae2" ON "account_mm_position_historical_data" ("para_block_height") `)
        await db.query(`CREATE INDEX "IDX_05c671451b27bdea5ca504c4f1" ON "account_mm_position_historical_data" ("block_id") `)
        await db.query(`ALTER TABLE "money_market_event" ADD "contract_name" character varying(12)`)
        await db.query(`ALTER TABLE "account_mm_position_historical_data" ADD CONSTRAINT "FK_be5a909cedcf1db8cda6c18cbc4" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "account_mm_position_historical_data" ADD CONSTRAINT "FK_05c671451b27bdea5ca504c4f19" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "account_mm_position_historical_data"`)
        await db.query(`DROP INDEX "public"."IDX_be5a909cedcf1db8cda6c18cbc"`)
        await db.query(`DROP INDEX "public"."IDX_e18fdac6be5ef90a988891bae2"`)
        await db.query(`DROP INDEX "public"."IDX_05c671451b27bdea5ca504c4f1"`)
        await db.query(`ALTER TABLE "money_market_event" DROP COLUMN "contract_name"`)
        await db.query(`ALTER TABLE "account_mm_position_historical_data" DROP CONSTRAINT "FK_be5a909cedcf1db8cda6c18cbc4"`)
        await db.query(`ALTER TABLE "account_mm_position_historical_data" DROP CONSTRAINT "FK_05c671451b27bdea5ca504c4f19"`)
    }
}
