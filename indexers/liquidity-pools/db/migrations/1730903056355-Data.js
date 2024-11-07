module.exports = class Data1730903056355 {
    name = 'Data1730903056355'

    async up(db) {
        await db.query(`CREATE TABLE "processor_status" ("id" character varying NOT NULL, "assets_actualised_at_block" integer NOT NULL, "initial_indexing_started_at_time" TIMESTAMP WITH TIME ZONE NOT NULL, "initial_indexing_finished_at_time" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_78e3a98adaf20813cd150d44f25" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "processor_status"`)
    }
}
