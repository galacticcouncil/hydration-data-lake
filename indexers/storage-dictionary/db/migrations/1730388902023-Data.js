module.exports = class Data1730388902023 {
    name = 'Data1730388902023'

    async up(db) {
        await db.query(`CREATE TABLE "lbp_pool_assets_data" ("id" character varying NOT NULL, "asset_id" integer NOT NULL, "balances" jsonb NOT NULL, "para_chain_block_height" integer NOT NULL, "pool_id" character varying, CONSTRAINT "PK_fcd0b0ca2ae4f15cc7b832b6ddd" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ba56be356bb67433ff7cd55f9e" ON "lbp_pool_assets_data" ("pool_id") `)
        await db.query(`CREATE INDEX "IDX_e83268282f102380233fac48ab" ON "lbp_pool_assets_data" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_3b4e915a87b2dfda5feaa41989" ON "lbp_pool_assets_data" ("para_chain_block_height") `)
        await db.query(`CREATE TABLE "lbp_pool" ("id" character varying NOT NULL, "pool_address" text NOT NULL, "asset_a_id" integer NOT NULL, "asset_b_id" integer NOT NULL, "owner" text NOT NULL, "start" integer, "end" integer, "initial_weight" integer NOT NULL, "final_weight" integer NOT NULL, "weight_curve" text NOT NULL, "fee" integer array NOT NULL, "fee_collector" text, "repay_target" numeric NOT NULL, "para_chain_block_height" integer NOT NULL, CONSTRAINT "PK_6eb6bc93eabeb292e553ab4d959" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0a8b4f3e3a0a0e7d04c12e5a7e" ON "lbp_pool" ("pool_address") `)
        await db.query(`CREATE INDEX "IDX_58421b3f9a783b9daf2f62b480" ON "lbp_pool" ("asset_a_id") `)
        await db.query(`CREATE INDEX "IDX_3ff30d78c0a02affaa320bf74c" ON "lbp_pool" ("asset_b_id") `)
        await db.query(`CREATE INDEX "IDX_2920fb44a11a12521d0f7fcf62" ON "lbp_pool" ("para_chain_block_height") `)
        await db.query(`ALTER TABLE "lbp_pool_assets_data" ADD CONSTRAINT "FK_ba56be356bb67433ff7cd55f9ec" FOREIGN KEY ("pool_id") REFERENCES "lbp_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "lbp_pool_assets_data"`)
        await db.query(`DROP INDEX "public"."IDX_ba56be356bb67433ff7cd55f9e"`)
        await db.query(`DROP INDEX "public"."IDX_e83268282f102380233fac48ab"`)
        await db.query(`DROP INDEX "public"."IDX_3b4e915a87b2dfda5feaa41989"`)
        await db.query(`DROP TABLE "lbp_pool"`)
        await db.query(`DROP INDEX "public"."IDX_0a8b4f3e3a0a0e7d04c12e5a7e"`)
        await db.query(`DROP INDEX "public"."IDX_58421b3f9a783b9daf2f62b480"`)
        await db.query(`DROP INDEX "public"."IDX_3ff30d78c0a02affaa320bf74c"`)
        await db.query(`DROP INDEX "public"."IDX_2920fb44a11a12521d0f7fcf62"`)
        await db.query(`ALTER TABLE "lbp_pool_assets_data" DROP CONSTRAINT "FK_ba56be356bb67433ff7cd55f9ec"`)
    }
}
