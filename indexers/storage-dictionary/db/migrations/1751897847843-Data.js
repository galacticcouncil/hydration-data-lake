module.exports = class Data1751897847843 {
    name = 'Data1751897847843'

    async up(db) {
        await db.query(`CREATE TABLE "mm_aggregator_oracle" ("id" character varying NOT NULL, "address" text NOT NULL, "price" text NOT NULL, "decimals" integer NOT NULL, "updated_at" integer NOT NULL, "para_block_height" integer NOT NULL, CONSTRAINT "PK_a39c8ebdb5fb625c59f8438b433" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_1f10509a155608385bd78ca9c1" ON "mm_aggregator_oracle" ("para_block_height") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "mm_aggregator_oracle"`)
        await db.query(`DROP INDEX "public"."IDX_1f10509a155608385bd78ca9c1"`)
    }
}
