module.exports = class Data1735652354335 {
    name = 'Data1735652354335'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_7329c1f404d46516062d62a6ea"`)
        await db.query(`ALTER TABLE "otc_order" DROP COLUMN "status"`)
        await db.query(`ALTER TABLE "otc_order" ADD "status" character varying(16)`)
        await db.query(`CREATE INDEX "IDX_7329c1f404d46516062d62a6ea" ON "otc_order" ("status") `)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_7329c1f404d46516062d62a6ea" ON "otc_order" ("status") `)
        await db.query(`ALTER TABLE "otc_order" ADD "status" character varying(8)`)
        await db.query(`ALTER TABLE "otc_order" DROP COLUMN "status"`)
        await db.query(`DROP INDEX "public"."IDX_7329c1f404d46516062d62a6ea"`)
    }
}
