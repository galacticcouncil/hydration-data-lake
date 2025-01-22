module.exports = class Data1736260508415 {
    name = 'Data1736260508415'

    async up(db) {
        await db.query(`ALTER TABLE "operation_stack" ALTER COLUMN "stack_elements" SET NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "operation_stack" ALTER COLUMN "stack_elements" DROP NOT NULL`)
    }
}
