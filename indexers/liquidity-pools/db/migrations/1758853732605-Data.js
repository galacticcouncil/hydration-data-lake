module.exports = class Data1758853732605 {
    name = 'Data1758853732605'

    async up(db) {
        await db.query(`ALTER TABLE "asset" ADD "multi_locations" jsonb`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" ADD "initial_amount" numeric NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "asset" DROP COLUMN "multi_locations"`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" DROP COLUMN "initial_amount"`)
    }
}
