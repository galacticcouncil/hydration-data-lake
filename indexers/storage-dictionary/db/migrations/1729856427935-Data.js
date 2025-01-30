module.exports = class Data1729856427935 {
    name = 'Data1729856427935'

    async up(db) {
        await db.query(`CREATE TABLE "sub_processor_status" ("id" character varying NOT NULL, "from_block" integer NOT NULL, "to_block" integer NOT NULL, "height" integer NOT NULL, CONSTRAINT "PK_2bc596083d65dca3e7cd1eb7a7a" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "sub_processor_status"`)
    }
}
