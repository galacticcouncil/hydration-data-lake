module.exports = class Data1752597926011 {
    name = 'Data1752597926011'

    async up(db) {
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "free"`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "locked"`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "flags"`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "frozen"`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "reserved"`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "fee_frozen"`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" DROP COLUMN "misc_frozen"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "free" numeric`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "locked" numeric`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "flags" numeric`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "frozen" numeric`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "reserved" numeric`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "fee_frozen" numeric`)
        await db.query(`ALTER TABLE "account_asset_balance_historical_data" ADD "misc_frozen" numeric`)
    }
}
