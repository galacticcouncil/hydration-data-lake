module.exports = class Data1736428641764 {
    name = 'Data1736428641764'

    async up(db) {
        await db.query(`ALTER TABLE "event" DROP COLUMN "entity_types"`)
        await db.query(`ALTER TABLE "event" ADD "entity_types" character varying(38) array`)
        await db.query(`ALTER TABLE "call" DROP COLUMN "entity_types"`)
        await db.query(`ALTER TABLE "call" ADD "entity_types" character varying(38) array`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "event" ADD "entity_types" character varying(27) array`)
        await db.query(`ALTER TABLE "event" DROP COLUMN "entity_types"`)
        await db.query(`ALTER TABLE "call" ADD "entity_types" character varying(27) array`)
        await db.query(`ALTER TABLE "call" DROP COLUMN "entity_types"`)
    }
}
