module.exports = class Data1735213662879 {
    name = 'Data1735213662879'

    async up(db) {
        await db.query(`CREATE TABLE "dca_schedule" ("id" character varying NOT NULL, "kind" character varying(4) NOT NULL, CONSTRAINT "PK_fde59ffc96a33c924c16b73be67" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "dca_schedule"`)
    }
}
