module.exports = class Data1771436707915 {
    name = 'Data1771436707915'

    async up(db) {
        await db.query(`CREATE TABLE "account_total_balance_latest" ("id" character varying NOT NULL, "ref_asset_id" text NOT NULL, "total_transferable_norm" text NOT NULL, "total_locked_norm" text NOT NULL, "total_debt_norm" text, "para_block_height" integer NOT NULL, CONSTRAINT "PK_e5543f8c59c3275e8a509c33bff" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "account_total_balance_latest"`)
    }
}
