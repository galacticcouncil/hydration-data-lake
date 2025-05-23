module.exports = class Data1747857876334 {
    name = 'Data1747857876334'

    async up(db) {
        await db.query(`ALTER TABLE "lbppool" DROP COLUMN "repay_fee"`)
        await db.query(`ALTER TABLE "lbppool" DROP COLUMN "max_in_ratio"`)
        await db.query(`ALTER TABLE "lbppool" DROP COLUMN "max_out_ratio"`)
        await db.query(`ALTER TABLE "lbppool" DROP COLUMN "min_pool_liquidity"`)
        await db.query(`ALTER TABLE "lbppool" DROP COLUMN "min_trading_limit"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "lbppool" ADD "repay_fee" integer array NOT NULL`)
        await db.query(`ALTER TABLE "lbppool" ADD "max_in_ratio" numeric NOT NULL`)
        await db.query(`ALTER TABLE "lbppool" ADD "max_out_ratio" numeric NOT NULL`)
        await db.query(`ALTER TABLE "lbppool" ADD "min_pool_liquidity" numeric NOT NULL`)
        await db.query(`ALTER TABLE "lbppool" ADD "min_trading_limit" numeric NOT NULL`)
    }
}
