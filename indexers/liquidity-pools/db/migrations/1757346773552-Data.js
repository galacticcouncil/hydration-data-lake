module.exports = class Data1757346773552 {
    name = 'Data1757346773552'

    async up(db) {
        await db.query(`CREATE TABLE "transaction_payment_historical_data" ("id" character varying NOT NULL, "next_fee_multiplier" numeric, "para_block_height" integer NOT NULL, "relay_block_height" integer NOT NULL, "block_id" character varying, CONSTRAINT "PK_1c7b89eeb3a40c62b3a7e86bbec" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b35e2fa4ededc451604d02b553" ON "transaction_payment_historical_data" ("para_block_height") `)
        await db.query(`CREATE INDEX "IDX_b58fe2c6def98ee2fe9ca75a0a" ON "transaction_payment_historical_data" ("block_id") `)
        await db.query(`ALTER TABLE "transaction_payment_historical_data" ADD CONSTRAINT "FK_b58fe2c6def98ee2fe9ca75a0a0" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "transaction_payment_historical_data"`)
        await db.query(`DROP INDEX "public"."IDX_b35e2fa4ededc451604d02b553"`)
        await db.query(`DROP INDEX "public"."IDX_b58fe2c6def98ee2fe9ca75a0a"`)
        await db.query(`ALTER TABLE "transaction_payment_historical_data" DROP CONSTRAINT "FK_b58fe2c6def98ee2fe9ca75a0a0"`)
    }
}
