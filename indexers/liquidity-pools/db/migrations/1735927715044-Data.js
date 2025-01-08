module.exports = class Data1735927715044 {
    name = 'Data1735927715044'

    async up(db) {
        await db.query(`CREATE TABLE "operation_stack" ("id" character varying NOT NULL, "stack_elements" jsonb, CONSTRAINT "PK_67cd11bf7586c3e9a000377330d" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "operation_stack"`)
    }
}
