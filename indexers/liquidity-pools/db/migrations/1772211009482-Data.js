module.exports = class Data1772211009482 {
  name = 'Data1772211009482';

  async up(db) {
    await db.query(
      `ALTER TABLE "dca_schedule" ALTER COLUMN "period" TYPE numeric`
    );
  }

  async down(db) {
    await db.query(
      `ALTER TABLE "dca_schedule" ALTER COLUMN "period" TYPE integer`
    );
  }
};
