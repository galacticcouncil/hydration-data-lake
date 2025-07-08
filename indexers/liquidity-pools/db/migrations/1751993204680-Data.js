module.exports = class Data1751993204680 {
    name = 'Data1751993204680'

    async up(db) {
        await db.query(`ALTER TABLE "asset_historical_data" ADD "asset_registry_id" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "asset_historical_data" DROP COLUMN "asset_registry_id"`)
    }
}
