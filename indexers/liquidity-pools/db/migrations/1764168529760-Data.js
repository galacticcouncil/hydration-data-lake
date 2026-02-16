module.exports = class Data1764168529760 {
  name = 'Data1764168529760';

  async up(db) {
    await db.query(
      `ALTER TABLE "asset_volume_historical_data" ADD "volume_in_norm" text`
    );
    await db.query(
      `ALTER TABLE "asset_volume_historical_data" ADD "volume_out_norm" text`
    );
    await db.query(
      `ALTER TABLE "asset_volume_historical_data" ADD "total_volume_in_norm" text NOT NULL`
    );
    await db.query(
      `ALTER TABLE "asset_volume_historical_data" ADD "total_volume_out_norm" text NOT NULL`
    );
  }

  async down(db) {
    await db.query(
      `ALTER TABLE "asset_volume_historical_data" DROP COLUMN "volume_in_norm"`
    );
    await db.query(
      `ALTER TABLE "asset_volume_historical_data" DROP COLUMN "volume_out_norm"`
    );
    await db.query(
      `ALTER TABLE "asset_volume_historical_data" DROP COLUMN "total_volume_in_norm"`
    );
    await db.query(
      `ALTER TABLE "asset_volume_historical_data" DROP COLUMN "total_volume_out_norm"`
    );
  }
};
