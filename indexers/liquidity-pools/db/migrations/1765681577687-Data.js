module.exports = class Data1765681577687 {
    name = 'Data1765681577687'

    async up(db) {
        await db.query(`ALTER TABLE "asset_volume_historical_data" ALTER COLUMN "total_volume_in_norm" DROP DEFAULT`)
        await db.query(`ALTER TABLE "asset_volume_historical_data" ALTER COLUMN "total_volume_out_norm" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "asset_volume_historical_data" ALTER COLUMN "total_volume_in_norm" SET DEFAULT '0'`)
        await db.query(`ALTER TABLE "asset_volume_historical_data" ALTER COLUMN "total_volume_out_norm" SET DEFAULT '0'`)
    }
}
