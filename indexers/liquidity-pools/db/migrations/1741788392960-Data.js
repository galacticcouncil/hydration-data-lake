module.exports = class Data1741788392960 {
    name = 'Data1741788392960'

    async up(db) {
        await db.query(`ALTER TABLE "processor_status" ADD "latest_processed_block" integer NOT NULL DEFAULT 0`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "processor_status" DROP COLUMN "latest_processed_block"`)
    }
}
