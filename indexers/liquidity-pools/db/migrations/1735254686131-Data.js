module.exports = class Data1735254686131 {
    name = 'Data1735254686131'

    async up(db) {
        await db.query(`ALTER TABLE "event" ALTER COLUMN "group" DROP NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "event" ALTER COLUMN "group" SET NOT NULL`)
    }
}
