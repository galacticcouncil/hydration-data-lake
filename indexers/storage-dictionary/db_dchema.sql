-- -------------------------------------------------------------
-- TablePlus 6.8.1(655)
--
-- https://tableplus.com/
--
-- Database: store_dictionary_db
-- Generation Time: 2026-01-21 10:16:49.5750
-- -------------------------------------------------------------


-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS migrations_id_seq;

-- Table Definition
CREATE TABLE "public"."migrations" (
    "id" int4 NOT NULL DEFAULT nextval('migrations_id_seq'::regclass),
    "timestamp" int8 NOT NULL,
    "name" varchar NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."sub_processor_status" (
    "id" varchar NOT NULL,
    "from_block" int4 NOT NULL,
    "to_block" int4 NOT NULL,
    "height" int4 NOT NULL,
    "assets_actualised_at_block" int4,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."block" (
    "id" varchar NOT NULL,
    "height" int4 NOT NULL,
    "hash" text NOT NULL,
    "timestamp" text NOT NULL,
    "relay_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."data_structure_type" (
    "id" varchar NOT NULL,
    "name" varchar(18) NOT NULL,
    "definition" text NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."ema_oracle" (
    "id" varchar NOT NULL,
    "entries" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."block_compressed_data" (
    "id" varchar NOT NULL,
    "algo" text NOT NULL,
    "comp_str_format" text NOT NULL,
    "data" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset_historical_data" (
    "id" varchar NOT NULL,
    "total_issuance" text NOT NULL,
    "dynamic_fee" jsonb,
    "existential_deposit" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "asset_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."lbppool" (
    "id" varchar NOT NULL,
    "pool_address" text NOT NULL,
    "asset_a_id" int4 NOT NULL,
    "asset_b_id" int4 NOT NULL,
    "owner" text NOT NULL,
    "start" int4,
    "end" int4,
    "initial_weight" int4 NOT NULL,
    "final_weight" int4 NOT NULL,
    "weight_curve" text NOT NULL,
    "fee" _int4 NOT NULL,
    "fee_collector" text,
    "repay_target" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."lbppool_assets_data" (
    "id" varchar NOT NULL,
    "asset_id" int4 NOT NULL,
    "balances" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xykpool" (
    "id" varchar NOT NULL,
    "pool_address" text NOT NULL,
    "asset_a_id" int4 NOT NULL,
    "asset_b_id" int4 NOT NULL,
    "share_token_id" text,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xykpool_assets_data" (
    "id" varchar NOT NULL,
    "asset_id" int4 NOT NULL,
    "balances" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool" (
    "id" varchar NOT NULL,
    "pool_address" text NOT NULL,
    "hub_asset_tradability" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_asset_data" (
    "id" varchar NOT NULL,
    "asset_id" int4 NOT NULL,
    "balances" jsonb NOT NULL,
    "asset_state" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap" (
    "id" varchar NOT NULL,
    "pool_id" int4 NOT NULL,
    "pool_address" text NOT NULL,
    "initial_amplification" int4 NOT NULL,
    "final_amplification" int4 NOT NULL,
    "initial_block" int4 NOT NULL,
    "final_block" int4 NOT NULL,
    "fee" int4 NOT NULL,
    "pegs" jsonb NOT NULL,
    "max_peg_update" int4,
    "peg_sources" jsonb,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_asset_data" (
    "id" varchar NOT NULL,
    "asset_id" int4 NOT NULL,
    "tradable" jsonb,
    "balances" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."aavepool" (
    "id" varchar NOT NULL,
    "pool_id" text NOT NULL,
    "liquidity_in" text NOT NULL,
    "liquidity_out" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "reserve_asset_id" varchar,
    "a_token_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_aggregator_oracle" (
    "id" varchar NOT NULL,
    "address" text NOT NULL,
    "price" text NOT NULL,
    "decimals" int4 NOT NULL,
    "updated_at" int4 NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_asset_balance_historical_data" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "transferable" text NOT NULL,
    "total_locked" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_mm_position_historical_data" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "account_bound_evm_address" text,
    "total_collateral_base" text NOT NULL,
    "total_debt_base" text NOT NULL,
    "available_borrows_base" text NOT NULL,
    "current_liquidation_threshold" text NOT NULL,
    "ltv" text NOT NULL,
    "health_factor" text,
    "pool_address" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account" (
    "id" varchar NOT NULL,
    "account_type" varchar(10) NOT NULL,
    "bound_evm_address" text,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset" (
    "id" varchar NOT NULL,
    "asset_type" varchar(10) NOT NULL,
    "name" text,
    "symbol" text,
    "decimals" int4,
    "xcm_rate_limit" numeric,
    "is_sufficient" bool NOT NULL,
    "bond_maturity" numeric,
    "bond_underlying_asset_id" varchar,
    "resource_type" varchar(10),
    "evm_address" text,
    "underlying_asset_id" varchar,
    "a_token_id" varchar,
    "variable_debt_token_id" varchar,
    PRIMARY KEY ("id")
);



-- Indices
CREATE UNIQUE INDEX "PK_8c82d7f526340ab734260ea46be" ON public.migrations USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_2bc596083d65dca3e7cd1eb7a7a" ON public.sub_processor_status USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_d0925763efb591c2e2ffb267572" ON public.block USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_dca0ed2bd988f6097a1a53ad151" ON public.data_structure_type USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_24862b7e27f86792eefd7468d66" ON public.ema_oracle USING btree (id);
CREATE INDEX "IDX_c3559a9c62d7857b317aafb495" ON public.ema_oracle USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_1c4c4755d43d0ab4670042ee6d9" ON public.block_compressed_data USING btree (id);
CREATE INDEX "IDX_489ab0e3aa381424e52af223cd" ON public.block_compressed_data USING btree (para_block_height);
ALTER TABLE "public"."asset_historical_data" ADD FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id");


-- Indices
CREATE UNIQUE INDEX "PK_d2c0807b36c45771c8b9efe6a20" ON public.asset_historical_data USING btree (id);
CREATE INDEX "IDX_bbb9a36dd61646de9e108ab7ce" ON public.asset_historical_data USING btree (asset_id);
CREATE INDEX "IDX_950584f39612b44c0e3719f19c" ON public.asset_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_ef87fb908f232298be8c24204fb" ON public.lbppool USING btree (id);
CREATE INDEX "IDX_e3cffa320d70f9b379fb0ac830" ON public.lbppool USING btree (para_block_height);
ALTER TABLE "public"."lbppool_assets_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."lbppool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_6b40e2bc5a0813d95989ebdbbf4" ON public.lbppool_assets_data USING btree (id);
CREATE INDEX "IDX_985186c4f14265f3717c340b3c" ON public.lbppool_assets_data USING btree (pool_id);
CREATE INDEX "IDX_bc5805bd4eb84dd9d6c193e844" ON public.lbppool_assets_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_c659261a47d4e71a475d36d0955" ON public.xykpool USING btree (id);
CREATE INDEX "IDX_9050dc9179426cd8a130be7024" ON public.xykpool USING btree (para_block_height);
ALTER TABLE "public"."xykpool_assets_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."xykpool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_ab5cc86c591649e3c539657f45e" ON public.xykpool_assets_data USING btree (id);
CREATE INDEX "IDX_9aedae7bc4b8c8dea22c418f74" ON public.xykpool_assets_data USING btree (pool_id);
CREATE INDEX "IDX_4aae1c625d6c8b63c763f84949" ON public.xykpool_assets_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_a8cb656c84202ef41ea88bfb28a" ON public.omnipool USING btree (id);
CREATE INDEX "IDX_0052c1ac58f66e19baad6a2470" ON public.omnipool USING btree (para_block_height);
ALTER TABLE "public"."omnipool_asset_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."omnipool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_a8e058d3bb473fb398c42134d26" ON public.omnipool_asset_data USING btree (id);
CREATE INDEX "IDX_459eac6e75821cad7e26a38a58" ON public.omnipool_asset_data USING btree (pool_id);
CREATE INDEX "IDX_aea3bac2172e861256fd6b275f" ON public.omnipool_asset_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_185a9818270c6ed629d397f8283" ON public.stableswap USING btree (id);
CREATE INDEX "IDX_ec7f4ce7e082f8525ea835594f" ON public.stableswap USING btree (para_block_height);
ALTER TABLE "public"."stableswap_asset_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."stableswap"("id");


-- Indices
CREATE UNIQUE INDEX "PK_b3b8331a2f6093e0dd03aed4c30" ON public.stableswap_asset_data USING btree (id);
CREATE INDEX "IDX_99922e04a6d86a0ff1a77a4563" ON public.stableswap_asset_data USING btree (pool_id);
CREATE INDEX "IDX_9524ef4cfb4e26c801d1d36528" ON public.stableswap_asset_data USING btree (para_block_height);
ALTER TABLE "public"."aavepool" ADD FOREIGN KEY ("reserve_asset_id") REFERENCES "public"."asset"("id");
ALTER TABLE "public"."aavepool" ADD FOREIGN KEY ("a_token_id") REFERENCES "public"."asset"("id");


-- Indices
CREATE UNIQUE INDEX "PK_1626daca149540fd0c3590fa65a" ON public.aavepool USING btree (id);
CREATE INDEX "IDX_2b2797e88d100bd3abf7a01cf8" ON public.aavepool USING btree (reserve_asset_id);
CREATE INDEX "IDX_8df88fa39af3e8f6947bdd2df3" ON public.aavepool USING btree (a_token_id);
CREATE INDEX "IDX_807171f125ae9ce180a94e94a9" ON public.aavepool USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_a39c8ebdb5fb625c59f8438b433" ON public.mm_aggregator_oracle USING btree (id);
CREATE INDEX "IDX_1f10509a155608385bd78ca9c1" ON public.mm_aggregator_oracle USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_8e6366a12aeb9840bed55c759c6" ON public.account_asset_balance_historical_data USING btree (id);
CREATE INDEX "IDX_ea5ffa2627d39535cf463998d3" ON public.account_asset_balance_historical_data USING btree (account_id);
CREATE INDEX "IDX_aae70116750a3b7fa020d18564" ON public.account_asset_balance_historical_data USING btree (asset_id);
CREATE INDEX "IDX_508f3309210c595461e3d7f7e6" ON public.account_asset_balance_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_5065a7b1305290be9e3239ad588" ON public.account_mm_position_historical_data USING btree (id);
CREATE INDEX "IDX_e18fdac6be5ef90a988891bae2" ON public.account_mm_position_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_54115ee388cdb6d86bb4bf5b2ea" ON public.account USING btree (id);
ALTER TABLE "public"."asset" ADD FOREIGN KEY ("variable_debt_token_id") REFERENCES "public"."asset"("id");
ALTER TABLE "public"."asset" ADD FOREIGN KEY ("a_token_id") REFERENCES "public"."asset"("id");
ALTER TABLE "public"."asset" ADD FOREIGN KEY ("bond_underlying_asset_id") REFERENCES "public"."asset"("id");
ALTER TABLE "public"."asset" ADD FOREIGN KEY ("underlying_asset_id") REFERENCES "public"."asset"("id");


-- Indices
CREATE UNIQUE INDEX "PK_1209d107fe21482beaea51b745e" ON public.asset USING btree (id);
CREATE INDEX "IDX_e822899ee72b95b0fe0e8b8034" ON public.asset USING btree (bond_underlying_asset_id);
CREATE INDEX "IDX_3ece542ae21addb0cf35aeada2" ON public.asset USING btree (underlying_asset_id);
CREATE INDEX "IDX_f311ee39a80698a75e2b0dc731" ON public.asset USING btree (a_token_id);
CREATE INDEX "IDX_c1ad5b2dd6e571a2f6e2627d27" ON public.asset USING btree (variable_debt_token_id);
