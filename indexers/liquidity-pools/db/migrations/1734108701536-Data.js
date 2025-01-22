module.exports = class Data1734108701536 {
  name = 'Data1734108701536';

  async up(db) {
    await db.query(
      `ALTER TABLE "processor_status" ADD "pools_destroyed_check_point_at_block" integer`
    );
  }

  async down(db) {
    await db.query(
      `ALTER TABLE "processor_status" DROP COLUMN "pools_destroyed_check_point_at_block"`
    );
  }
};
