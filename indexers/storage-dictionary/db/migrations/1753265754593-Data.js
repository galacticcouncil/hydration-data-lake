module.exports = class Data1753265754593 {
    name = 'Data1753265754593'

    async up(db) {
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "account_type" character varying(10) NOT NULL, "bound_evm_address" text, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "asset" ADD "evm_address" text`)
        await db.query(`ALTER TABLE "asset" ADD "underlying_asset_id" character varying`)
        await db.query(`ALTER TABLE "asset" ADD "a_token_id" character varying`)
        await db.query(`ALTER TABLE "asset" ADD "variable_debt_token_id" character varying`)
        await db.query(`CREATE INDEX "IDX_3ece542ae21addb0cf35aeada2" ON "asset" ("underlying_asset_id") `)
        await db.query(`CREATE INDEX "IDX_f311ee39a80698a75e2b0dc731" ON "asset" ("a_token_id") `)
        await db.query(`CREATE INDEX "IDX_c1ad5b2dd6e571a2f6e2627d27" ON "asset" ("variable_debt_token_id") `)
        await db.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_3ece542ae21addb0cf35aeada2b" FOREIGN KEY ("underlying_asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_f311ee39a80698a75e2b0dc7318" FOREIGN KEY ("a_token_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_c1ad5b2dd6e571a2f6e2627d277" FOREIGN KEY ("variable_debt_token_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "account"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "evm_address"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "underlying_asset_id"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "a_token_id"`)
        await db.query(`ALTER TABLE "asset" DROP COLUMN "variable_debt_token_id"`)
        await db.query(`DROP INDEX "public"."IDX_3ece542ae21addb0cf35aeada2"`)
        await db.query(`DROP INDEX "public"."IDX_f311ee39a80698a75e2b0dc731"`)
        await db.query(`DROP INDEX "public"."IDX_c1ad5b2dd6e571a2f6e2627d27"`)
        await db.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_3ece542ae21addb0cf35aeada2b"`)
        await db.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_f311ee39a80698a75e2b0dc7318"`)
        await db.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_c1ad5b2dd6e571a2f6e2627d277"`)
    }
}
