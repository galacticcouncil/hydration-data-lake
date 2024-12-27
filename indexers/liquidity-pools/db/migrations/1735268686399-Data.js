module.exports = class Data1735268686399 {
    name = 'Data1735268686399'

    async up(db) {
        await db.query(`CREATE TABLE "dca_randomness_generation_failed_error" ("id" character varying NOT NULL, "index_in_block" integer NOT NULL, "relay_chain_block_height" integer NOT NULL, "para_chain_block_height" integer NOT NULL, "error" text, CONSTRAINT "PK_3f913f04114bf821d5e9b390e57" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_2c4572c447bcb743b9dc7c257e" ON "dca_randomness_generation_failed_error" ("para_chain_block_height") `)
        await db.query(`ALTER TABLE "dca_schedule" ADD "relay_chain_block_height" integer NOT NULL`)
        await db.query(`ALTER TABLE "dca_schedule" ADD "para_chain_block_height" integer NOT NULL`)
        await db.query(`CREATE INDEX "IDX_2931a0595b42e0c36085dc3cd0" ON "dca_schedule" ("para_chain_block_height") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "dca_randomness_generation_failed_error"`)
        await db.query(`DROP INDEX "public"."IDX_2c4572c447bcb743b9dc7c257e"`)
        await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "relay_chain_block_height"`)
        await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "para_chain_block_height"`)
        await db.query(`DROP INDEX "public"."IDX_2931a0595b42e0c36085dc3cd0"`)
    }
}
