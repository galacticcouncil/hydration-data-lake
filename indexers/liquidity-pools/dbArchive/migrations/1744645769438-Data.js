module.exports = class Data1744645769438 {
    name = 'Data1744645769438'

    async up(db) {
        await db.query(`ALTER TABLE "stableswap_asset_historical_data" DROP COLUMN "peg"`)
        await db.query(`ALTER TABLE "stableswap_historical_data" ADD "pegs" jsonb NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "stableswap_asset_historical_data" ADD "peg" text array NOT NULL`)
        await db.query(`ALTER TABLE "stableswap_historical_data" DROP COLUMN "pegs"`)
    }
}
