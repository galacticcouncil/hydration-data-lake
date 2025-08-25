module.exports = class Data1755711230238 {
    name = 'Data1755711230238'

    async up(db) {
        await db.query(`CREATE TABLE "batch_hsmpool_asset_hist_vols_list" ("id" character varying NOT NULL, "asset_ids" text array, "batch_start_para_block_height" integer NOT NULL, "batch_end_para_block_height" integer NOT NULL, CONSTRAINT "PK_bc56beb14148c4c461fcf5132e7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_675c503142d248670cf564f607" ON "batch_hsmpool_asset_hist_vols_list" ("batch_start_para_block_height") `)
        await db.query(`CREATE INDEX "IDX_ee4baaef7e78b9a6a634842e14" ON "batch_hsmpool_asset_hist_vols_list" ("batch_end_para_block_height") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "batch_hsmpool_asset_hist_vols_list"`)
        await db.query(`DROP INDEX "public"."IDX_675c503142d248670cf564f607"`)
        await db.query(`DROP INDEX "public"."IDX_ee4baaef7e78b9a6a634842e14"`)
    }
}
