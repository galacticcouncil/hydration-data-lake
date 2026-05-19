module.exports = class Data1778551584746 {
    name = 'Data1778551584746'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_f816c476852b85c944f259c191" ON "omnipool_liquidity_position" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_12611a74c4fda79d26a2c3cecc" ON "omnipool_yield_farm_deposit" ("account_id") `)
        await db.query(`CREATE INDEX "IDX_dae4631f1949d8a3553f1e919d" ON "xyk_yield_farm_deposit" ("account_id") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_f816c476852b85c944f259c191"`)
        await db.query(`DROP INDEX "public"."IDX_12611a74c4fda79d26a2c3cecc"`)
        await db.query(`DROP INDEX "public"."IDX_dae4631f1949d8a3553f1e919d"`)
    }
}
