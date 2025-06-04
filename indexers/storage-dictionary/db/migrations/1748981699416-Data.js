module.exports = class Data1748981699416 {
    name = 'Data1748981699416'

    async up(db) {
        await db.query(`CREATE TABLE "block_compressed_data" ("id" character varying NOT NULL, "algo" text NOT NULL, "comp_str_format" text NOT NULL, "data" text NOT NULL, "para_block_height" integer NOT NULL, CONSTRAINT "PK_1c4c4755d43d0ab4670042ee6d9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_489ab0e3aa381424e52af223cd" ON "block_compressed_data" ("para_block_height") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "block_compressed_data"`)
        await db.query(`DROP INDEX "public"."IDX_489ab0e3aa381424e52af223cd"`)
    }
}
