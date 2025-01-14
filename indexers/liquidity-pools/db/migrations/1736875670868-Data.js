module.exports = class Data1736875670868 {
    name = 'Data1736875670868'

    async up(db) {
        await db.query(`ALTER TABLE "chain_activity_trace" ADD "associated_accounts_flat" text array NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "chain_activity_trace" DROP COLUMN "associated_accounts_flat"`)
    }
}
