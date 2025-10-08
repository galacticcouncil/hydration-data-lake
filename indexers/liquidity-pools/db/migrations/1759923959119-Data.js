module.exports = class Data1759923959119 {
    name = 'Data1759923959119'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_2e4f9e0bf465bff05ec5d31d13" ON "asset" ("asset_registry_id") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_2e4f9e0bf465bff05ec5d31d13"`)
    }
}
