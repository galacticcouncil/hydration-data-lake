module.exports = class Data1778608574139 {
    name = 'Data1778608574139'

    async up(db) {
        await db.query(`CREATE TABLE "pending_redis_ts_commit" ("id" character varying NOT NULL, "job_name" text NOT NULL, "para_block_height" integer NOT NULL, "sample_timestamp_ms" numeric NOT NULL, "payload" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_9cfc27bf312fc7ac6ab1e9203fb" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_fa3a69d619581097b6d775ba06" ON "pending_redis_ts_commit" ("job_name") `)
        await db.query(`CREATE INDEX "IDX_fe6566ed5bb9f406a7cad075c8" ON "pending_redis_ts_commit" ("para_block_height") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "pending_redis_ts_commit"`)
        await db.query(`DROP INDEX "public"."IDX_fa3a69d619581097b6d775ba06"`)
        await db.query(`DROP INDEX "public"."IDX_fe6566ed5bb9f406a7cad075c8"`)
    }
}
