module.exports = class Data1767802991261 {
    name = 'Data1767802991261'

    async up(db) {
        await db.query(`ALTER TABLE "mm_borrow" ALTER COLUMN "asset_id" SET NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" ALTER COLUMN "account_id" SET NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "mm_borrow" ALTER COLUMN "asset_id" DROP NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_liquidity_position" ALTER COLUMN "account_id" DROP NOT NULL`)
    }
}
