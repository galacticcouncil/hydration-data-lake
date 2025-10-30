module.exports = class Data1761754585628 {
  name = 'Data1761754585628';

  async up(db) {
    await db.query(
      `CREATE TABLE "omnipool_asset_historical_data_latest" ("id" character varying NOT NULL, "pool_historical_data_id" text NOT NULL, "omnipool_asset_id" text NOT NULL, "asset_id" text NOT NULL, "asset_cap" numeric NOT NULL, "asset_shares" numeric NOT NULL, "asset_hub_reserve" numeric NOT NULL, "asset_protocol_shares" numeric NOT NULL, "free_balance" numeric NOT NULL, "tradable" integer NOT NULL, "tvl_in_ref_asset_norm" text, "para_block_height" integer NOT NULL, "block_id" text NOT NULL, CONSTRAINT "PK_1dc6a4c78fab8b57369c2d00dfe" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE INDEX "IDX_eed1b3d6cecaabcb69bc6ad65b" ON "omnipool_asset_historical_data_latest" ("asset_id") `
    );
  }

  async down(db) {
    await db.query(`DROP TABLE "omnipool_asset_historical_data_latest"`);
    await db.query(`DROP INDEX "public"."IDX_eed1b3d6cecaabcb69bc6ad65b"`);
  }
};
