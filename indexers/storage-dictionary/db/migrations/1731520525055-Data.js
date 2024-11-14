module.exports = class Data1731520525055 {
    name = 'Data1731520525055'

    async up(db) {
        await db.query(`CREATE TABLE "asset" ("id" character varying NOT NULL, "asset_type" character varying(10) NOT NULL, "name" text, "symbol" text, "decimals" integer, "xcm_rate_limit" numeric, "is_sufficient" boolean NOT NULL, "existential_deposit" numeric NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "sub_processor_status" ADD "assets_actualised_at_block" integer`)
    }

    async down(db) {
        await db.query(`DROP TABLE "asset"`)
        await db.query(`ALTER TABLE "sub_processor_status" DROP COLUMN "assets_actualised_at_block"`)
    }
}
