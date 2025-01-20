module.exports = class Data1737388096975 {
    name = 'Data1737388096975'

    async up(db) {
        await db.query(`ALTER TABLE "xyk_pool" DROP COLUMN "share_token_id"`)
        await db.query(`ALTER TABLE "xyk_pool" ADD "share_token_id" character varying`)
        await db.query(`CREATE INDEX "IDX_d5ec7da2bf3b7ca505fb40212a" ON "xyk_pool" ("share_token_id") `)
        await db.query(`ALTER TABLE "xyk_pool" ADD CONSTRAINT "FK_d5ec7da2bf3b7ca505fb40212a6" FOREIGN KEY ("share_token_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "xyk_pool" ADD "share_token_id" integer NOT NULL`)
        await db.query(`ALTER TABLE "xyk_pool" DROP COLUMN "share_token_id"`)
        await db.query(`DROP INDEX "public"."IDX_d5ec7da2bf3b7ca505fb40212a"`)
        await db.query(`ALTER TABLE "xyk_pool" DROP CONSTRAINT "FK_d5ec7da2bf3b7ca505fb40212a6"`)
    }
}
