module.exports = class Data1735225025311 {
    name = 'Data1735225025311'

    async up(db) {
        await db.query(`ALTER TABLE "event" ADD "group" character varying(14)`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "event" DROP COLUMN "group"`)
    }
}
