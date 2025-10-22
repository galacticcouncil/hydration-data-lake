module.exports = class Data1761069528451 {
    name = 'Data1761069528451'

    async up(db) {
        await db.query(`ALTER TABLE "asset_volume_historical_data" ADD "total_volume_in_norm" text NOT NULL DEFAULT '0';`)
        await db.query(`ALTER TABLE "asset_volume_historical_data" ADD "total_volume_out_norm" text NOT NULL DEFAULT '0';`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "asset_volume_historical_data" DROP COLUMN "total_volume_in_norm"`)
        await db.query(`ALTER TABLE "asset_volume_historical_data" DROP COLUMN "total_volume_out_norm"`)
    }
}
