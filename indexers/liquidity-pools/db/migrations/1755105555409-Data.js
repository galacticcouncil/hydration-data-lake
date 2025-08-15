module.exports = class Data1755105555409 {
    name = 'Data1755105555409'

    async up(db) {
        await db.query(`CREATE TABLE "aave_facilitator" ("id" character varying NOT NULL, "label" text NOT NULL, "is_removed" boolean NOT NULL, CONSTRAINT "PK_0cbd7c4da13ecf255f81e05edd7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "aave_facilitator_historical_data" ("id" character varying NOT NULL, "bucket_capacity" numeric NOT NULL, "bucket_level" numeric NOT NULL, "para_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "para_block_height" integer NOT NULL, "relay_block_height" integer NOT NULL, "facilitator_id" character varying, "block_id" character varying, CONSTRAINT "PK_ee322bf1ab03e20da68bbcdf04b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_78b8ff15d51bd5900fb7833a3f" ON "aave_facilitator_historical_data" ("facilitator_id") `)
        await db.query(`CREATE INDEX "IDX_80e7fb4e92228ab21fc9737053" ON "aave_facilitator_historical_data" ("para_timestamp") `)
        await db.query(`CREATE INDEX "IDX_e0a03ffb16bfceb23a6bc7dd97" ON "aave_facilitator_historical_data" ("para_block_height") `)
        await db.query(`CREATE INDEX "IDX_5a5e67cf83c6bf95faacf49853" ON "aave_facilitator_historical_data" ("block_id") `)
        await db.query(`ALTER TABLE "hsmpool" ADD "facilitator_id" character varying`)
        await db.query(`CREATE INDEX "IDX_16c6e7c489d652c684dfc33afb" ON "hsmpool" ("facilitator_id") `)
        await db.query(`ALTER TABLE "hsmpool" ADD CONSTRAINT "FK_16c6e7c489d652c684dfc33afbf" FOREIGN KEY ("facilitator_id") REFERENCES "aave_facilitator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "aave_facilitator_historical_data" ADD CONSTRAINT "FK_78b8ff15d51bd5900fb7833a3fd" FOREIGN KEY ("facilitator_id") REFERENCES "aave_facilitator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "aave_facilitator_historical_data" ADD CONSTRAINT "FK_5a5e67cf83c6bf95faacf49853e" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "aave_facilitator"`)
        await db.query(`DROP TABLE "aave_facilitator_historical_data"`)
        await db.query(`DROP INDEX "public"."IDX_78b8ff15d51bd5900fb7833a3f"`)
        await db.query(`DROP INDEX "public"."IDX_80e7fb4e92228ab21fc9737053"`)
        await db.query(`DROP INDEX "public"."IDX_e0a03ffb16bfceb23a6bc7dd97"`)
        await db.query(`DROP INDEX "public"."IDX_5a5e67cf83c6bf95faacf49853"`)
        await db.query(`ALTER TABLE "hsmpool" DROP COLUMN "facilitator_id"`)
        await db.query(`DROP INDEX "public"."IDX_16c6e7c489d652c684dfc33afb"`)
        await db.query(`ALTER TABLE "hsmpool" DROP CONSTRAINT "FK_16c6e7c489d652c684dfc33afbf"`)
        await db.query(`ALTER TABLE "aave_facilitator_historical_data" DROP CONSTRAINT "FK_78b8ff15d51bd5900fb7833a3fd"`)
        await db.query(`ALTER TABLE "aave_facilitator_historical_data" DROP CONSTRAINT "FK_5a5e67cf83c6bf95faacf49853e"`)
    }
}
