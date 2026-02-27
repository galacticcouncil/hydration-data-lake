module.exports = class Data1772210254311 {
    name = 'Data1772210254311'

    async up(db) {
        await db.query(`ALTER TABLE "dca_schedule" ALTER COLUMN "period" TYPE numeric`);
    }

    async down(db) {
      await db.query(`ALTER TABLE "dca_schedule" ALTER COLUMN "period" TYPE integer`);

    }
}
