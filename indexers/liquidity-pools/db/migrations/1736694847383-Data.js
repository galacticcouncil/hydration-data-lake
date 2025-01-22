module.exports = class Data1736694847383 {
    name = 'Data1736694847383'

    async up(db) {
        await db.query(`ALTER TABLE "chain_activity_trace" DROP CONSTRAINT "FK_26c2eb8e87337934308e440e2de"`)
        await db.query(`DROP INDEX "public"."IDX_26c2eb8e87337934308e440e2d"`)
        await db.query(`CREATE TABLE "chain_activity_trace_relation" ("id" character varying NOT NULL, "created_at_para_chain_block_height" integer NOT NULL, "child_trace_id" character varying, "parent_trace_id" character varying, CONSTRAINT "PK_a5284175c0ed2afaf3703b9cd07" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_6be7f6950fe25222e68a9ccde4" ON "chain_activity_trace_relation" ("child_trace_id") `)
        await db.query(`CREATE INDEX "IDX_e140c24845ed82e99ec4a65c15" ON "chain_activity_trace_relation" ("parent_trace_id") `)
        await db.query(`ALTER TABLE "chain_activity_trace" DROP COLUMN "root_trace_id"`)
        await db.query(`ALTER TABLE "chain_activity_trace_relation" ADD CONSTRAINT "FK_6be7f6950fe25222e68a9ccde4e" FOREIGN KEY ("child_trace_id") REFERENCES "chain_activity_trace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "chain_activity_trace_relation" ADD CONSTRAINT "FK_e140c24845ed82e99ec4a65c155" FOREIGN KEY ("parent_trace_id") REFERENCES "chain_activity_trace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "chain_activity_trace" ADD CONSTRAINT "FK_26c2eb8e87337934308e440e2de" FOREIGN KEY ("root_trace_id") REFERENCES "chain_activity_trace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`CREATE INDEX "IDX_26c2eb8e87337934308e440e2d" ON "chain_activity_trace" ("root_trace_id") `)
        await db.query(`DROP TABLE "chain_activity_trace_relation"`)
        await db.query(`DROP INDEX "public"."IDX_6be7f6950fe25222e68a9ccde4"`)
        await db.query(`DROP INDEX "public"."IDX_e140c24845ed82e99ec4a65c15"`)
        await db.query(`ALTER TABLE "chain_activity_trace" ADD "root_trace_id" character varying`)
        await db.query(`ALTER TABLE "chain_activity_trace_relation" DROP CONSTRAINT "FK_6be7f6950fe25222e68a9ccde4e"`)
        await db.query(`ALTER TABLE "chain_activity_trace_relation" DROP CONSTRAINT "FK_e140c24845ed82e99ec4a65c155"`)
    }
}
