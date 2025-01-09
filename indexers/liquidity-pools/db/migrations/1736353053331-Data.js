module.exports = class Data1736353053331 {
    name = 'Data1736353053331'

    async up(db) {
        await db.query(`ALTER TABLE "omnipool_asset" ALTER COLUMN "initial_amount" DROP NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_asset" ALTER COLUMN "initial_price" DROP NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "omnipool_asset" ALTER COLUMN "initial_amount" SET NOT NULL`)
        await db.query(`ALTER TABLE "omnipool_asset" ALTER COLUMN "initial_price" SET NOT NULL`)
    }
}
