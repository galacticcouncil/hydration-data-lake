module.exports = class Data1735252212514 {
  name = 'Data1735252212514';

  async up(db) {
    await db.query(
      `CREATE TABLE "dca_schedule_order_route" ("id" character varying NOT NULL, "pool_kind" character varying(10), "schedule_id" character varying, "asset_in_id" character varying, "asset_out_id" character varying, CONSTRAINT "PK_5a659242a7ec22b04e6e89f1ba3" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE INDEX "IDX_53e003311cc7c7ab33da8c5594" ON "dca_schedule_order_route" ("schedule_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_45ee201735765cf74787d115cd" ON "dca_schedule_order_route" ("asset_in_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_b9dbb19068cc2e95ca705dcf28" ON "dca_schedule_order_route" ("asset_out_id") `
    );
    await db.query(
      `CREATE TABLE "dca_schedule_execution" ("id" character varying NOT NULL, "status" character varying(8), "status_memo" text, "amount_out" numeric, "amount_in" numeric, "schedule_id" character varying, CONSTRAINT "PK_3acfb6b19305745dc9771d1e3ad" PRIMARY KEY ("id"))`
    );
    await db.query(
      `CREATE INDEX "IDX_b742c3842ca3ab32a44c9a419c" ON "dca_schedule_execution" ("schedule_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_89a4d9eb27749fc079f5517af1" ON "dca_schedule_execution" ("status") `
    );
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "kind"`);
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "start_execution_block" integer`
    );
    await db.query(`ALTER TABLE "dca_schedule" ADD "period" integer`);
    await db.query(`ALTER TABLE "dca_schedule" ADD "total_amount" numeric`);
    await db.query(`ALTER TABLE "dca_schedule" ADD "slippage" integer`);
    await db.query(`ALTER TABLE "dca_schedule" ADD "max_retries" integer`);
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "stability_threshold" integer`
    );
    await db.query(`ALTER TABLE "dca_schedule" ADD "amount_out" numeric`);
    await db.query(`ALTER TABLE "dca_schedule" ADD "amount_in" numeric`);
    await db.query(`ALTER TABLE "dca_schedule" ADD "max_amount_in" numeric`);
    await db.query(`ALTER TABLE "dca_schedule" ADD "min_amount_out" numeric`);
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "order_kind" character varying(4) NOT NULL`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "status" character varying(10)`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "status_updated_at_block_height" integer`
    );
    await db.query(`ALTER TABLE "dca_schedule" ADD "status_memo" text`);
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "owner_id" character varying`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "asset_in_id" character varying`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "asset_out_id" character varying`
    );
    await db.query(
      `ALTER TABLE "swap" ADD "dca_schedule_execution_id" character varying`
    );
    await db.query(
      `CREATE INDEX "IDX_e15990f7f3be023789ac36f036" ON "dca_schedule" ("owner_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_48907884eb52ad2ed090d444c7" ON "dca_schedule" ("asset_in_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_a5ed06402fa0ad28d9e84e3a26" ON "dca_schedule" ("asset_out_id") `
    );
    await db.query(
      `CREATE INDEX "IDX_ab0aec830806fc4d898fad47b4" ON "dca_schedule" ("status") `
    );
    await db.query(
      `CREATE INDEX "IDX_cdeb57fc49ab9df38808386f1f" ON "swap" ("dca_schedule_execution_id") `
    );
    await db.query(
      `ALTER TABLE "dca_schedule_order_route" ADD CONSTRAINT "FK_53e003311cc7c7ab33da8c5594b" FOREIGN KEY ("schedule_id") REFERENCES "dca_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "dca_schedule_order_route" ADD CONSTRAINT "FK_45ee201735765cf74787d115cdd" FOREIGN KEY ("asset_in_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "dca_schedule_order_route" ADD CONSTRAINT "FK_b9dbb19068cc2e95ca705dcf284" FOREIGN KEY ("asset_out_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" ADD CONSTRAINT "FK_e15990f7f3be023789ac36f0366" FOREIGN KEY ("owner_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" ADD CONSTRAINT "FK_48907884eb52ad2ed090d444c72" FOREIGN KEY ("asset_in_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" ADD CONSTRAINT "FK_a5ed06402fa0ad28d9e84e3a260" FOREIGN KEY ("asset_out_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "dca_schedule_execution" ADD CONSTRAINT "FK_b742c3842ca3ab32a44c9a419ca" FOREIGN KEY ("schedule_id") REFERENCES "dca_schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await db.query(
      `ALTER TABLE "swap" ADD CONSTRAINT "FK_cdeb57fc49ab9df38808386f1fa" FOREIGN KEY ("dca_schedule_execution_id") REFERENCES "dca_schedule_execution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(db) {
    await db.query(`DROP TABLE "dca_schedule_order_route"`);
    await db.query(`DROP INDEX "public"."IDX_53e003311cc7c7ab33da8c5594"`);
    await db.query(`DROP INDEX "public"."IDX_45ee201735765cf74787d115cd"`);
    await db.query(`DROP INDEX "public"."IDX_b9dbb19068cc2e95ca705dcf28"`);
    await db.query(`DROP TABLE "dca_schedule_execution"`);
    await db.query(`DROP INDEX "public"."IDX_b742c3842ca3ab32a44c9a419c"`);
    await db.query(`DROP INDEX "public"."IDX_89a4d9eb27749fc079f5517af1"`);
    await db.query(
      `ALTER TABLE "dca_schedule" ADD "kind" character varying(4) NOT NULL`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" DROP COLUMN "start_execution_block"`
    );
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "period"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "total_amount"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "slippage"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "max_retries"`);
    await db.query(
      `ALTER TABLE "dca_schedule" DROP COLUMN "stability_threshold"`
    );
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "amount_out"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "amount_in"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "max_amount_in"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "min_amount_out"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "order_kind"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "status"`);
    await db.query(
      `ALTER TABLE "dca_schedule" DROP COLUMN "status_updated_at_block_height"`
    );
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "status_memo"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "owner_id"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "asset_in_id"`);
    await db.query(`ALTER TABLE "dca_schedule" DROP COLUMN "asset_out_id"`);
    await db.query(
      `ALTER TABLE "swap" DROP COLUMN "dca_schedule_execution_id"`
    );
    await db.query(`DROP INDEX "public"."IDX_e15990f7f3be023789ac36f036"`);
    await db.query(`DROP INDEX "public"."IDX_48907884eb52ad2ed090d444c7"`);
    await db.query(`DROP INDEX "public"."IDX_a5ed06402fa0ad28d9e84e3a26"`);
    await db.query(`DROP INDEX "public"."IDX_ab0aec830806fc4d898fad47b4"`);
    await db.query(`DROP INDEX "public"."IDX_cdeb57fc49ab9df38808386f1f"`);
    await db.query(
      `ALTER TABLE "dca_schedule_order_route" DROP CONSTRAINT "FK_53e003311cc7c7ab33da8c5594b"`
    );
    await db.query(
      `ALTER TABLE "dca_schedule_order_route" DROP CONSTRAINT "FK_45ee201735765cf74787d115cdd"`
    );
    await db.query(
      `ALTER TABLE "dca_schedule_order_route" DROP CONSTRAINT "FK_b9dbb19068cc2e95ca705dcf284"`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" DROP CONSTRAINT "FK_e15990f7f3be023789ac36f0366"`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" DROP CONSTRAINT "FK_48907884eb52ad2ed090d444c72"`
    );
    await db.query(
      `ALTER TABLE "dca_schedule" DROP CONSTRAINT "FK_a5ed06402fa0ad28d9e84e3a260"`
    );
    await db.query(
      `ALTER TABLE "dca_schedule_execution" DROP CONSTRAINT "FK_b742c3842ca3ab32a44c9a419ca"`
    );
    await db.query(
      `ALTER TABLE "swap" DROP CONSTRAINT "FK_cdeb57fc49ab9df38808386f1fa"`
    );
  }
};
