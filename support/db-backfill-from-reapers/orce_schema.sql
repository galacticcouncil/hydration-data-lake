-- -------------------------------------------------------------
-- TablePlus 6.8.1(655)
--
-- https://tableplus.com/
--
-- Database: liquidity_pools_db
-- Generation Time: 2026-01-31 15:48:23.5950
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
CREATE TABLE "public"."processor_status" (
    "id" varchar NOT NULL,
    "assets_last_updated_at_block" int4 NOT NULL,
    "pools_destroyed_updated_at_block" int4,
    "initial_indexing_started_at" timestamptz NOT NULL,
    "initial_indexing_finished_at" timestamptz,
    "latest_processed_block" int4 NOT NULL,
    "stableswap_hist_data_latest_block" int4,
    "omnipool_hist_data_latest_block" int4,
    "xykpool_hist_data_latest_block" int4,
    "aavepool_hist_data_latest_block" int4,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."preprocessed_data_bucket" (
    "id" varchar NOT NULL,
    "processor_id" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "entity_name" text NOT NULL,
    "data" jsonb NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset_volume_historical_data" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "volume_in" numeric NOT NULL,
    "volume_out" numeric NOT NULL,
    "total_volume_in" numeric NOT NULL,
    "total_volume_out" numeric NOT NULL,
    "volume_in_norm" text,
    "volume_out_norm" text,
    "total_volume_in_norm" text,
    "total_volume_out_norm" text,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset_swap_fee_historical_data" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "total_amount" numeric NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_asset_balance_historical_data" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "transferable" numeric NOT NULL,
    "total_locked" numeric NOT NULL,
    "transferable_in_ref_asset_norm" text,
    "total_locked_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_asset_balance_latest" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "transferable" numeric NOT NULL,
    "total_locked" numeric NOT NULL,
    "transferable_in_ref_asset_norm" text,
    "total_locked_in_ref_asset_norm" text,
    "total" numeric NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_total_balance_historical_data" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "ref_asset_id" text NOT NULL,
    "total_transferable_norm" text NOT NULL,
    "total_locked_norm" text NOT NULL,
    "total_debt_norm" text,
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
CREATE TABLE "public"."batch_xykpool_hist_vols_list" (
    "id" varchar NOT NULL,
    "pool_ids" _text,
    "batch_start_para_block_height" int4 NOT NULL,
    "batch_end_para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."batch_omnipool_asset_hist_vols_list" (
    "id" varchar NOT NULL,
    "omnipool_asset_ids" _text,
    "asset_ids" _text,
    "batch_start_para_block_height" int4 NOT NULL,
    "batch_end_para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."batch_lbppool_hist_vols_list" (
    "id" varchar NOT NULL,
    "pool_ids" _text,
    "batch_start_para_block_height" int4 NOT NULL,
    "batch_end_para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_asset_historical_data_latest" (
    "id" varchar NOT NULL,
    "pool_historical_data_id" text NOT NULL,
    "omnipool_asset_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "asset_cap" numeric NOT NULL,
    "asset_shares" numeric NOT NULL,
    "asset_hub_reserve" numeric NOT NULL,
    "asset_protocol_shares" numeric NOT NULL,
    "free_balance" numeric NOT NULL,
    "tradable" int4 NOT NULL,
    "tvl_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."batch_stableswap_hist_vols_list" (
    "id" varchar NOT NULL,
    "pool_ids" _text,
    "batch_start_para_block_height" int4 NOT NULL,
    "batch_end_para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_asset_historical_data_latest" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "pool_id" text NOT NULL,
    "stableswap_asset_id" text NOT NULL,
    "pool_historical_data_id" text NOT NULL,
    "free_balance" numeric NOT NULL,
    "tradable" int4,
    "tvl_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."batch_hsmpool_asset_hist_vols_list" (
    "id" varchar NOT NULL,
    "asset_ids" _text,
    "batch_start_para_block_height" int4 NOT NULL,
    "batch_end_para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."constants_historical_data" (
    "id" varchar NOT NULL,
    "lbp_repay_fee" _int4,
    "lbp_max_in_ratio" numeric,
    "lbp_max_out_ratio" numeric,
    "lbp_min_pool_liquidity" numeric,
    "lbp_min_trading_limit" numeric,
    "omnipool_burn_protocol_fee" int4,
    "omnipool_hdx_asset_id" int4,
    "omnipool_hub_asset_id" int4,
    "omnipool_max_in_ratio" numeric,
    "omnipool_max_out_ratio" numeric,
    "omnipool_minimum_pool_liquidity" numeric,
    "omnipool_minimum_trading_limit" numeric,
    "omnipool_min_withdrawal_fee" int4,
    "stableswap_min_trading_limit" numeric,
    "stableswap_min_pool_liquidity" numeric,
    "stableswap_amplification_range" _int4,
    "xyk_get_exchange_fee" _int4,
    "xyk_max_in_ratio" numeric,
    "xyk_max_out_ratio" numeric,
    "xyk_min_pool_liquidity" numeric,
    "xyk_min_trading_limit" numeric,
    "xyk_native_asset_id" int4,
    "xyk_oracle_source" text,
    "dynamic_fees_asset_fee_parameters" jsonb,
    "dynamic_fees_protocol_fee_parameters" jsonb,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."ema_oracle_entry_historical_data" (
    "id" varchar NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "asset_a_asset_registry_id" text NOT NULL,
    "asset_b_asset_registry_id" text NOT NULL,
    "source" text NOT NULL,
    "period" varchar(10) NOT NULL,
    "numerator_price" numeric NOT NULL,
    "denominator_price" numeric NOT NULL,
    "asset_a_in_volume" numeric NOT NULL,
    "asset_a_out_volume" numeric NOT NULL,
    "asset_b_in_volume" numeric NOT NULL,
    "asset_b_out_volume" numeric NOT NULL,
    "asset_a_liquidity" numeric NOT NULL,
    "asset_b_liquidity" numeric NOT NULL,
    "updated_at_para_block_height" int4 NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."nft_collection" (
    "id" varchar NOT NULL,
    "collection_type" text NOT NULL,
    "owner_id" text NOT NULL,
    "issuer_id" text NOT NULL,
    "admin_id" text NOT NULL,
    "freezer_id" text NOT NULL,
    "total_deposit" numeric NOT NULL,
    "free_holding" bool NOT NULL,
    "is_frozen" bool NOT NULL,
    "items" int4 NOT NULL,
    "item_metadatas" int4 NOT NULL,
    "attributes" int4 NOT NULL,
    "max_supply" numeric,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."nft_asset" (
    "id" varchar NOT NULL,
    "collection_id" text NOT NULL,
    "owner_id" text NOT NULL,
    "deposit" numeric NOT NULL,
    "is_frozen" bool NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_global_farm" (
    "id" varchar NOT NULL,
    "owner_account_id" text NOT NULL,
    "updated_at_relay_block" int4 NOT NULL,
    "total_shares_z" numeric NOT NULL,
    "accumulated_rpz" numeric NOT NULL,
    "reward_asset_id" text NOT NULL,
    "pending_rewards" numeric NOT NULL,
    "accumulated_paid_rewards" numeric NOT NULL,
    "yield_per_period" numeric NOT NULL,
    "planned_yielding_periods" int4 NOT NULL,
    "blocks_per_period" int4 NOT NULL,
    "incentivized_asset_id" text NOT NULL,
    "max_reward_per_period" numeric NOT NULL,
    "min_deposit" numeric NOT NULL,
    "live_yield_farms_count" int4 NOT NULL,
    "total_yield_farms_count" int4 NOT NULL,
    "price_adjustment" numeric NOT NULL,
    "state" varchar(10) NOT NULL,
    "life_states" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" text,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_yield_farm" (
    "id" varchar NOT NULL,
    "global_farm_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "updated_at_relay_block" int4 NOT NULL,
    "total_shares" numeric NOT NULL,
    "total_valued_shares" numeric NOT NULL,
    "accumulated_rpvs" numeric NOT NULL,
    "accumulated_rpz" numeric NOT NULL,
    "multiplier" numeric NOT NULL,
    "state" varchar(10) NOT NULL,
    "entries_count" int4 NOT NULL,
    "left_to_distribute" numeric NOT NULL,
    "total_stopped" numeric NOT NULL,
    "loyalty_curve" jsonb,
    "life_states" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" text,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_yield_farm_deposit" (
    "id" varchar NOT NULL,
    "nft_id" text,
    "position_id" text NOT NULL,
    "account_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "status" varchar(17) NOT NULL,
    "shares_amount" numeric NOT NULL,
    "initial_shares_amount" numeric NOT NULL,
    "entries" jsonb NOT NULL,
    "created_at_para_block_height" int4 NOT NULL,
    "destroyed_at_para_block_height" int4,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_yield_farm_deposit_event" (
    "id" varchar NOT NULL,
    "deposit_id" text NOT NULL,
    "event_name" varchar(17) NOT NULL,
    "global_farm_id" text,
    "yield_farm_id" text,
    "asset_id" text,
    "account_id" text,
    "shares_amount" numeric,
    "claimed_amount" numeric,
    "reward_asset_id" text,
    "para_block_height" int4 NOT NULL,
    "event_id" text,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xyk_yield_farm_deposit" (
    "id" varchar NOT NULL,
    "nft_id" text,
    "xykpool_id" text NOT NULL,
    "account_id" text NOT NULL,
    "lp_asset_id" text NOT NULL,
    "initial_amount" numeric NOT NULL,
    "amount" numeric NOT NULL,
    "status" varchar(17) NOT NULL,
    "entries" jsonb NOT NULL,
    "created_at_para_block_height" int4 NOT NULL,
    "destroyed_at_para_block_height" int4,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xyk_yield_farm_deposit_event" (
    "id" varchar NOT NULL,
    "deposit_id" text NOT NULL,
    "event_name" varchar(17) NOT NULL,
    "global_farm_id" text,
    "yield_farm_id" text,
    "lp_asset_id" text,
    "account_id" text,
    "amount" numeric,
    "claimed_amount" numeric,
    "reward_asset_id" text,
    "para_block_height" int4 NOT NULL,
    "event_id" text,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset_historical_data" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "total_issuance" numeric NOT NULL,
    "dynamic_fee" jsonb,
    "usd_price_normalised" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset_assets_pair_volume" (
    "id" varchar NOT NULL,
    "para_block_height" int4 NOT NULL,
    "asset_historical_data_id" varchar,
    "assets_pair_volume_historical_data_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."assets_pair_volume_historical_data" (
    "id" varchar NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_registry_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "asset_registry_b_id" text NOT NULL,
    "asset_a_volume" numeric NOT NULL,
    "asset_b_volume" numeric NOT NULL,
    "total_volume_normalised" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."block" (
    "id" varchar NOT NULL,
    "height" int4 NOT NULL,
    "hash" text NOT NULL,
    "timestamp" timestamptz NOT NULL,
    "relay_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."call" (
    "id" varchar NOT NULL,
    "trace_id" text NOT NULL,
    "args" text,
    "success" bool,
    "name" text NOT NULL,
    "origin_kind" text NOT NULL,
    "origin_value_kind" text,
    "origin_value" text,
    "entity_types" _varchar,
    "para_block_height" int4 NOT NULL,
    "block_id" varchar,
    "extrinsic_id" varchar,
    "parent_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."extrinsic" (
    "id" varchar NOT NULL,
    "hash" text NOT NULL,
    "index_in_block" int4 NOT NULL,
    "para_block_height" int4 NOT NULL,
    "block_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_chain_activity_trace" (
    "id" varchar NOT NULL,
    "account_id" varchar,
    "chain_activity_trace_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."chain_activity_trace" (
    "id" varchar NOT NULL,
    "operation_ids" _text,
    "trace_ids" _text NOT NULL,
    "participant_accounts" _text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "originator_id" varchar,
    "block_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."chain_activity_trace_relation" (
    "id" varchar NOT NULL,
    "para_block_height" int4 NOT NULL,
    "parent_trace_id" varchar,
    "child_trace_id" varchar,
    "block_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."event" (
    "id" varchar NOT NULL,
    "trace_id" text NOT NULL,
    "args" text,
    "index_in_block" int4 NOT NULL,
    "name" text NOT NULL,
    "group" varchar(14),
    "phase" text NOT NULL,
    "entity_types" _varchar,
    "para_block_height" int4 NOT NULL,
    "block_id" varchar,
    "call_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."lbppool" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "asset_a_balance" numeric NOT NULL,
    "asset_b_balance" numeric NOT NULL,
    "owner_id" text,
    "fee_collector_id" text,
    "start_block_number" int4,
    "end_block_number" int4,
    "initial_weight" int4,
    "final_weight" int4,
    "fee" _int4,
    "repay_target" numeric,
    "created_at_para_block_height" int4 NOT NULL,
    "created_at_relay_block_height" int4 NOT NULL,
    "created_at_block_id" text,
    "is_destroyed" bool,
    "life_states" jsonb NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."lbppool_price_historical_data" (
    "id" varchar NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "asset_a_balance" numeric NOT NULL,
    "asset_b_balance" numeric NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."lbppool_volume_historical_data" (
    "id" varchar NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "average_price" numeric NOT NULL,
    "asset_a_vol_in" numeric NOT NULL,
    "asset_a_vol_out" numeric NOT NULL,
    "asset_a_total_vol_in" numeric NOT NULL,
    "asset_a_total_vol_out" numeric NOT NULL,
    "asset_a_fee_vol" numeric NOT NULL,
    "asset_b_fee_vol" numeric NOT NULL,
    "asset_a_fees_total_vol" numeric NOT NULL,
    "asset_b_fees_total_vol" numeric NOT NULL,
    "asset_b_vol_in" numeric NOT NULL,
    "asset_b_vol_out" numeric NOT NULL,
    "asset_b_total_vol_in" numeric NOT NULL,
    "asset_b_total_vol_out" numeric NOT NULL,
    "asset_a_vol_in_norm" text NOT NULL,
    "asset_a_vol_out_norm" text NOT NULL,
    "asset_b_vol_in_norm" text NOT NULL,
    "asset_b_vol_out_norm" text NOT NULL,
    "asset_a_fee_vol_norm" text NOT NULL,
    "asset_b_fee_vol_norm" text NOT NULL,
    "asset_a_total_vol_in_norm" text NOT NULL,
    "asset_a_total_vol_out_norm" text NOT NULL,
    "asset_b_total_vol_in_norm" text NOT NULL,
    "asset_b_total_vol_out_norm" text NOT NULL,
    "asset_a_fees_total_vol_norm" text NOT NULL,
    "asset_b_fees_total_vol_norm" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."lbppool_historical_data" (
    "id" varchar NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "asset_a_balance" numeric NOT NULL,
    "asset_b_balance" numeric NOT NULL,
    "owner_id" text NOT NULL,
    "fee_collector_id" text,
    "start_block_number" int4,
    "end_block_number" int4,
    "initial_weight" int4 NOT NULL,
    "final_weight" int4 NOT NULL,
    "repay_target" numeric NOT NULL,
    "weight_curve" text NOT NULL,
    "fee" _int4 NOT NULL,
    "tvl_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xykpool" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "asset_a_balance" numeric NOT NULL,
    "asset_b_balance" numeric NOT NULL,
    "share_token_id" text NOT NULL,
    "tvl_in_ref_asset_norm" text,
    "created_at_para_block_height" int4 NOT NULL,
    "created_at_relay_block_height" int4 NOT NULL,
    "created_at_block_id" text,
    "is_destroyed" bool,
    "life_states" jsonb NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xykpool_volume_historical_data" (
    "id" varchar NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "average_price" numeric NOT NULL,
    "asset_a_vol_in" numeric NOT NULL,
    "asset_a_vol_out" numeric NOT NULL,
    "asset_a_total_vol_in" numeric NOT NULL,
    "asset_a_total_vol_out" numeric NOT NULL,
    "asset_a_fee_vol" numeric NOT NULL,
    "asset_b_fee_vol" numeric NOT NULL,
    "asset_a_fees_total_vol" numeric NOT NULL,
    "asset_b_fees_total_vol" numeric NOT NULL,
    "asset_b_vol_in" numeric NOT NULL,
    "asset_b_vol_out" numeric NOT NULL,
    "asset_b_total_vol_in" numeric NOT NULL,
    "asset_b_total_vol_out" numeric NOT NULL,
    "asset_a_vol_in_norm" text NOT NULL,
    "asset_a_vol_out_norm" text NOT NULL,
    "asset_b_vol_in_norm" text NOT NULL,
    "asset_b_vol_out_norm" text NOT NULL,
    "asset_a_fee_vol_norm" text NOT NULL,
    "asset_b_fee_vol_norm" text NOT NULL,
    "asset_a_total_vol_in_norm" text NOT NULL,
    "asset_a_total_vol_out_norm" text NOT NULL,
    "asset_b_total_vol_in_norm" text NOT NULL,
    "asset_b_total_vol_out_norm" text NOT NULL,
    "asset_a_fees_total_vol_norm" text NOT NULL,
    "asset_b_fees_total_vol_norm" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xykpool_historical_data" (
    "id" varchar NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "asset_a_balance" numeric NOT NULL,
    "asset_b_balance" numeric NOT NULL,
    "tvl_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_asset" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "added_at_para_block_height" int4 NOT NULL,
    "added_at_relay_block_height" int4 NOT NULL,
    "is_removed" bool,
    "added_at_block_id" text,
    "life_states" jsonb,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_asset_volume_historical_data" (
    "id" varchar NOT NULL,
    "asset_vol_in" numeric NOT NULL,
    "asset_vol_out" numeric NOT NULL,
    "asset_total_vol_in" numeric NOT NULL,
    "asset_total_vol_out" numeric NOT NULL,
    "asset_fee_vol" numeric NOT NULL,
    "asset_total_fees_vol" numeric NOT NULL,
    "asset_vol_in_norm" text NOT NULL,
    "asset_vol_out_norm" text NOT NULL,
    "asset_fee_vol_norm" text NOT NULL,
    "asset_total_vol_in_norm" text NOT NULL,
    "asset_total_vol_out_norm" text NOT NULL,
    "asset_total_fees_vol_norm" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "omnipool_asset_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "is_destroyed" bool,
    "destroyed_at_para_block_height" int4,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_historical_data" (
    "id" varchar NOT NULL,
    "tvl_total_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_asset_historical_data" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "asset_cap" numeric NOT NULL,
    "asset_shares" numeric NOT NULL,
    "asset_hub_reserve" numeric NOT NULL,
    "asset_protocol_shares" numeric NOT NULL,
    "free_balance" numeric NOT NULL,
    "tradable" int4 NOT NULL,
    "tvl_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    "pool_historical_data_id" varchar,
    "omnipool_asset_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "share_token_id" text NOT NULL,
    "created_at_para_block_height" int4 NOT NULL,
    "created_at_relay_block_height" int4 NOT NULL,
    "created_at_block_id" text,
    "is_destroyed" bool,
    "life_states" jsonb NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_asset" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."hsmpool" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "facilitator_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."hsm_collateral" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "is_removed" bool NOT NULL,
    "pool_id" varchar,
    "stableswap_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."aave_facilitator" (
    "id" varchar NOT NULL,
    "label" text NOT NULL,
    "is_removed" bool NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_swap_fee_historical_data" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_asset_swap_fee_historical_data" (
    "id" varchar NOT NULL,
    "account_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "total_amount" numeric NOT NULL,
    "para_block_height" int4 NOT NULL,
    "collection_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."transfer" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "asset_id" text NOT NULL,
    "asset_type" varchar(10) NOT NULL,
    "from_id" text NOT NULL,
    "to_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "tx_fee" numeric NOT NULL,
    "para_timestamp" timestamptz NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."swap" (
    "id" varchar NOT NULL,
    "operation_id" text,
    "trace_ids" _text,
    "swap_index" int4,
    "swapper_id" text NOT NULL,
    "filler_id" text NOT NULL,
    "filler_type" varchar(10) NOT NULL,
    "operation_type" varchar(15) NOT NULL,
    "all_involved_asset_ids" _text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "dca_schedule_execution_event_id" varchar,
    "otc_order_fulfillment_id" varchar,
    "routed_trade_id" varchar,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."swap_asset_balance" (
    "id" varchar NOT NULL,
    "asset_balance_type" varchar(6) NOT NULL,
    "asset_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "swap_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."dca_schedule" (
    "id" varchar NOT NULL,
    "operation_id" text,
    "trace_ids" _text,
    "status" varchar(10),
    "owner_id" text NOT NULL,
    "start_execution_block" int4,
    "period" int4,
    "total_amount" numeric,
    "slippage" int4,
    "max_retries" int4,
    "stability_threshold" int4,
    "total_executed_amount_in" numeric,
    "total_executed_amount_out" numeric,
    "asset_in_id" text,
    "amount_in" numeric,
    "max_amount_in" numeric,
    "asset_out_id" text,
    "amount_out" numeric,
    "min_amount_out" numeric,
    "order_type" varchar(4) NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."dca_schedule_order_route_hop" (
    "id" varchar NOT NULL,
    "pool_kind" varchar(10),
    "asset_in_id" text,
    "asset_out_id" text,
    "schedule_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."dca_schedule_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "event_name" varchar(10) NOT NULL,
    "error_state" jsonb,
    "para_block_height" int4 NOT NULL,
    "schedule_id" varchar,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."dca_schedule_execution" (
    "id" varchar NOT NULL,
    "status" varchar(8),
    "amount_out" numeric,
    "amount_in" numeric,
    "schedule_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."dca_schedule_execution_event" (
    "id" varchar NOT NULL,
    "operation_ids" _text,
    "trace_ids" _text,
    "event_name" varchar(8),
    "error_state" jsonb,
    "para_block_height" int4 NOT NULL,
    "schedule_execution_id" varchar,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."otc_order" (
    "id" varchar NOT NULL,
    "owner_id" text NOT NULL,
    "asset_in_id" text NOT NULL,
    "asset_out_id" text NOT NULL,
    "amount_out" numeric NOT NULL,
    "amount_in" numeric NOT NULL,
    "partially_fillable" bool,
    "status" varchar(15),
    "total_filled_amount_in" numeric,
    "total_filled_amount_out" numeric,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."otc_order_event" (
    "id" varchar NOT NULL,
    "operation_id" text,
    "trace_ids" _text,
    "event_name" varchar(15),
    "amount_in" numeric,
    "amount_out" numeric,
    "fee" numeric,
    "filler_id" text,
    "para_block_height" int4 NOT NULL,
    "order_id" varchar,
    "swap_id" varchar,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."routed_trade" (
    "id" varchar NOT NULL,
    "route_id" text,
    "input_asset_ids" _text NOT NULL,
    "output_asset_ids" _text NOT NULL,
    "all_involved_asset_ids" _text NOT NULL,
    "participant_swappers" _text NOT NULL,
    "participant_fillers" _text NOT NULL,
    "fee_recipients" _text NOT NULL,
    "para_block_height" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."routed_trade_asset_balance" (
    "id" varchar NOT NULL,
    "asset_balance_type" varchar(6) NOT NULL,
    "asset_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "routed_trade_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."swap_fee" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "destination_type" varchar(7) NOT NULL,
    "recipient_id" text,
    "swap_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_volume_historical_data" (
    "id" varchar NOT NULL,
    "pool_vol_in_norm" text NOT NULL,
    "pool_vol_out_norm" text NOT NULL,
    "pool_fees_vol_norm" text NOT NULL,
    "pool_total_vol_in_norm" text NOT NULL,
    "pool_total_vol_out_norm" text NOT NULL,
    "pool_total_fees_vol_norm" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_asset_volume_historical_data" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "asset_fee_vol" numeric NOT NULL,
    "asset_total_fees_vol" numeric NOT NULL,
    "asset_vol_in" numeric NOT NULL,
    "asset_vol_out" numeric NOT NULL,
    "asset_total_vol_in" numeric NOT NULL,
    "asset_total_vol_out" numeric NOT NULL,
    "asset_vol_in_norm" text NOT NULL,
    "asset_vol_out_norm" text NOT NULL,
    "asset_fee_vol_norm" text NOT NULL,
    "asset_total_vol_in_norm" text NOT NULL,
    "asset_total_vol_out_norm" text NOT NULL,
    "asset_total_fees_vol_norm" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "volumes_collection_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_liquidity_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "shares_amount" numeric NOT NULL,
    "fee_amount" numeric NOT NULL,
    "action_type" varchar(6) NOT NULL,
    "index_in_block" int4 NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_asset_liquidity_amount" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "liquidity_action_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_historical_data" (
    "id" varchar NOT NULL,
    "initial_amplification" int4 NOT NULL,
    "final_amplification" int4 NOT NULL,
    "initial_amplification_change_at_block_height" int4 NOT NULL,
    "final_amplification_change_at_block_height" int4 NOT NULL,
    "fee" int4 NOT NULL,
    "pegs" jsonb NOT NULL,
    "max_peg_update" int4,
    "peg_sources" jsonb,
    "tvl_total_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."stableswap_asset_historical_data" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "free_balance" numeric NOT NULL,
    "tradable" int4,
    "tvl_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    "stableswap_asset_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."hsmpool_historical_data" (
    "id" varchar NOT NULL,
    "bucket_capacity" numeric NOT NULL,
    "bucket_level" numeric NOT NULL,
    "para_timestamp" timestamptz NOT NULL,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."hsm_collateral_config_historical_data" (
    "id" varchar NOT NULL,
    "purchase_fee" numeric NOT NULL,
    "max_buy_price_coefficient" numeric NOT NULL,
    "buyback_rate" numeric NOT NULL,
    "buy_back_fee" numeric NOT NULL,
    "max_in_holding" numeric NOT NULL,
    "para_timestamp" timestamptz NOT NULL,
    "para_block_height" int4 NOT NULL,
    "collateral_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."aave_facilitator_historical_data" (
    "id" varchar NOT NULL,
    "bucket_capacity" numeric NOT NULL,
    "bucket_level" numeric NOT NULL,
    "para_timestamp" timestamptz NOT NULL,
    "para_block_height" int4 NOT NULL,
    "facilitator_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."hsmpool_asset_historical_data" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "free_balance" numeric NOT NULL,
    "tvl_in_ref_asset_norm" text,
    "asset_vol_in" numeric NOT NULL,
    "asset_vol_out" numeric NOT NULL,
    "asset_fee_vol" numeric NOT NULL,
    "asset_total_vol_in" numeric NOT NULL,
    "asset_total_vol_out" numeric NOT NULL,
    "asset_total_fees_vol" numeric NOT NULL,
    "asset_vol_in_norm" text NOT NULL,
    "asset_vol_out_norm" text NOT NULL,
    "asset_fee_vol_norm" text NOT NULL,
    "asset_total_vol_in_norm" text NOT NULL,
    "asset_total_vol_out_norm" text NOT NULL,
    "asset_total_fees_vol_norm" text NOT NULL,
    "para_timestamp" timestamptz NOT NULL,
    "para_block_height" int4 NOT NULL,
    "collateral_id" varchar,
    "facilitator_hist_data_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."money_market_reserve" (
    "id" varchar NOT NULL,
    "a_token_id" text NOT NULL,
    "underlying_asset_id" text NOT NULL,
    "variable_debt_token_id" text NOT NULL,
    "name" text NOT NULL,
    "symbol" text NOT NULL,
    "decimals" int4 NOT NULL,
    "aave_pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_reserve_indexes_historical_data" (
    "id" varchar NOT NULL,
    "liquidity_rate" numeric,
    "variable_borrow_rate" numeric,
    "liquidity_index" numeric,
    "variable_borrow_index" numeric,
    "para_block_height" int4 NOT NULL,
    "reserve_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_reserve_config_historical_data" (
    "id" varchar NOT NULL,
    "interest_rate_strategy_address" text NOT NULL,
    "price_oracle" text,
    "reserve_factor" numeric,
    "usage_as_collateral_enabled" bool,
    "borrowing_enabled" bool,
    "is_active" bool,
    "is_frozen" bool,
    "is_paused" bool,
    "is_siloed_borrowing" bool,
    "accrued_to_treasury" numeric,
    "unbacked" numeric,
    "flash_loan_enabled" bool,
    "debt_ceiling" numeric,
    "debt_ceiling_decimals" numeric,
    "e_mode_category_id" int4,
    "borrow_cap" numeric,
    "supply_cap" numeric,
    "borrowable_in_isolation" bool,
    "base_lt_vas_collateral" numeric,
    "reserve_liquidation_threshold" numeric,
    "reserve_liquidation_bonus" numeric,
    "variable_rate_slope1" numeric,
    "variable_rate_slope2" numeric,
    "base_variable_borrow_rate" numeric,
    "optimal_usage_ratio" numeric,
    "last_update_timestamp" timestamptz,
    "para_block_height" int4 NOT NULL,
    "reserve_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."aavepool" (
    "id" varchar NOT NULL,
    "reserve_asset_id" text NOT NULL,
    "a_token_id" text NOT NULL,
    "money_market_reserve_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."aavepool_historical_data" (
    "id" varchar NOT NULL,
    "reserve_asset_id" text,
    "reserve_asset_registry_id" text,
    "a_token_id" text NOT NULL,
    "a_token_registry_id" text NOT NULL,
    "liquidity_in" numeric NOT NULL,
    "liquidity_out" numeric NOT NULL,
    "tvl_in_ref_asset_norm" text,
    "a_token_total_supply" numeric,
    "variable_debt_token_total_supply" numeric,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_supply" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "asset_id" text NOT NULL,
    "account_id" text NOT NULL,
    "account_on_behalf_of_id" text NOT NULL,
    "amount" numeric,
    "referral_code" numeric,
    "para_block_height" int4 NOT NULL,
    "initiated_by_trade_id" varchar,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_withdraw" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "asset_id" text NOT NULL,
    "account_from_id" text NOT NULL,
    "account_to_id" text NOT NULL,
    "amount" numeric,
    "para_block_height" int4 NOT NULL,
    "initiated_by_trade_id" varchar,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset" (
    "id" varchar NOT NULL,
    "asset_registry_id" text,
    "evm_address" text,
    "multi_location_ids" _text,
    "multi_locations_metadata" jsonb,
    "multi_locations" jsonb,
    "underlying_asset_id" text,
    "a_token_id" text,
    "variable_debt_token_id" text,
    "bond_underlying_asset_id" text,
    "asset_type" varchar(10) NOT NULL,
    "resource_type" varchar(10) NOT NULL,
    "name" text,
    "symbol" text,
    "decimals" int4,
    "xcm_rate_limit" numeric,
    "is_sufficient" bool NOT NULL,
    "existential_deposit" numeric NOT NULL,
    "bond_maturity" numeric,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_user_e_mode_set" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "account_id" text NOT NULL,
    "category_id" int4,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_repay" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "asset_id" text NOT NULL,
    "account_id" text NOT NULL,
    "repayer_account_id" text NOT NULL,
    "amount" numeric,
    "use_a_tokens" bool,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_liquidation_call" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "collateral_asset_id" text NOT NULL,
    "debt_asset_id" text NOT NULL,
    "account_id" text NOT NULL,
    "debt_to_cover_amount" numeric,
    "liquidated_collateral_amount" numeric,
    "liquidator_account_id" text NOT NULL,
    "receive_a_token" bool NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_reserve_used_as_collateral_enabled_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "account_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_reserve_used_as_collateral_disabled_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "account_id" text NOT NULL,
    "asset_id" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_liquidity_position_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "event_name" varchar(24) NOT NULL,
    "account_id" text,
    "asset_id" text,
    "amount" numeric,
    "shares_amount" numeric,
    "price" numeric,
    "para_block_height" int4 NOT NULL,
    "event_id" text NOT NULL,
    "position_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_asset_liquidity_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "asset_id" text NOT NULL,
    "action_type" varchar(6) NOT NULL,
    "account_id" text NOT NULL,
    "position_id" text NOT NULL,
    "amount" numeric NOT NULL,
    "fee" numeric,
    "para_block_height" int4 NOT NULL,
    "event_id" text NOT NULL,
    "position_event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xyk_global_farm" (
    "id" varchar NOT NULL,
    "owner_account_id" text NOT NULL,
    "updated_at_relay_block" int4,
    "total_shares_z" numeric,
    "total_rewards" numeric,
    "accumulated_rpz" numeric,
    "reward_asset_id" text,
    "pending_rewards" numeric,
    "accumulated_paid_rewards" numeric,
    "yield_per_period" int4,
    "planned_yielding_periods" int4,
    "blocks_per_period" int4,
    "incentivized_asset_id" text,
    "max_reward_per_period" numeric,
    "min_deposit" numeric,
    "live_yield_farms_count" int4,
    "total_yield_farms_count" int4,
    "price_adjustment" numeric,
    "state" varchar(10) NOT NULL,
    "life_states" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" text,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xyk_yield_farm" (
    "id" varchar NOT NULL,
    "all_involved_asset_ids" _text NOT NULL,
    "all_involved_asset_registry_ids" _text NOT NULL,
    "xykpool_id" text NOT NULL,
    "state" varchar(10) NOT NULL,
    "updated_at_relay_block" int4 NOT NULL,
    "total_shares" numeric NOT NULL,
    "total_valued_shares" numeric NOT NULL,
    "accumulated_rpvs" numeric NOT NULL,
    "accumulated_rpz" numeric NOT NULL,
    "multiplier" numeric NOT NULL,
    "entries_count" int4 NOT NULL,
    "left_to_distribute" numeric NOT NULL,
    "total_stopped" numeric NOT NULL,
    "loyalty_curve" jsonb,
    "life_states" jsonb NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" text,
    "global_farm_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."transaction_payment_historical_data" (
    "id" varchar NOT NULL,
    "next_fee_multiplier" numeric,
    "para_block_height" int4 NOT NULL,
    "block_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account" (
    "id" varchar NOT NULL,
    "account_type" varchar(10) NOT NULL,
    "bound_evm_address" text,
    "evm_address_bound_event_id" varchar,
    "lbppool_id" varchar,
    "xykpool_id" varchar,
    "omnipool_id" varchar,
    "stableswap_id" varchar,
    "hsmpool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset_spot_price_route" (
    "id" varchar NOT NULL,
    "route" jsonb NOT NULL,
    "filler_addresses" _text NOT NULL,
    "asset_path" _text NOT NULL,
    "hop_count" int4 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."asset_spot_price_historical_data" (
    "id" varchar NOT NULL,
    "asset_in_id" text NOT NULL,
    "asset_out_id" text NOT NULL,
    "price" numeric NOT NULL,
    "price_normalised" text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "price_route_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_borrow" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "account_id" text NOT NULL,
    "account_on_behalf_of_id" text NOT NULL,
    "amount" numeric,
    "interest_rate_mode" int4,
    "borrow_rate" numeric,
    "referral_code" numeric,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    "asset_id" text NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."omnipool_liquidity_position" (
    "id" varchar NOT NULL,
    "asset_id" text NOT NULL,
    "omnipool_asset_id" text NOT NULL,
    "initial_amount" numeric NOT NULL,
    "amount" numeric NOT NULL,
    "shares_amount" numeric NOT NULL,
    "nft_id" text,
    "price" numeric,
    "status" varchar(24) NOT NULL,
    "created_at_para_block_height" int4 NOT NULL,
    "destroyed_at_para_block_height" int4,
    "event_id" text,
    "account_id" text NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."xykpool_historical_data_latest" (
    "id" varchar NOT NULL,
    "asset_a_id" text NOT NULL,
    "asset_b_id" text NOT NULL,
    "asset_a_balance" numeric NOT NULL,
    "asset_b_balance" numeric NOT NULL,
    "tvl_in_ref_asset_norm" text,
    "para_block_height" int4 NOT NULL,
    "pool_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."account_processing_status" (
    "id" varchar NOT NULL,
    "mm_reserve_balances_initialized_at_para_block" int4,
    "balances_aggregated_at_para_block" int4,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."liquidation_liquidated_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "account_id" text NOT NULL,
    "collateral_asset_id" text NOT NULL,
    "debt_asset_id" text NOT NULL,
    "profit" numeric NOT NULL,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."money_market_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "contract_name" varchar(24),
    "event_name" varchar(32),
    "all_involved_asset_ids" _text NOT NULL,
    "all_involved_asset_registry_ids" _text NOT NULL,
    "all_involved_asset_details" text,
    "all_involved_participants" _text NOT NULL,
    "para_block_height" int4 NOT NULL,
    "transfer_id" varchar,
    "supply_id" varchar,
    "withdraw_id" varchar,
    "borrow_id" varchar,
    "repay_id" varchar,
    "user_e_mode_set_id" varchar,
    "liquidation_call_id" varchar,
    "reserve_used_as_collateral_enabled_id" varchar,
    "reserve_used_as_collateral_disabled_id" varchar,
    "event_id" varchar,
    "minted_to_treasury_id" varchar,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."mm_minted_to_treasury_event" (
    "id" varchar NOT NULL,
    "trace_ids" _text,
    "asset_id" text NOT NULL,
    "amount" numeric,
    "para_block_height" int4 NOT NULL,
    "event_id" varchar,
    PRIMARY KEY ("id")
);

CREATE VIEW "public"."swap_inputs" AS ;
CREATE VIEW "public"."pg_stat_statements_info" AS ;
CREATE VIEW "public"."pg_stat_statements" AS ;
CREATE VIEW "public"."swap_outputs" AS ;
CREATE VIEW "public"."routed_trade_inputs" AS ;
CREATE VIEW "public"."routed_trade_outputs" AS ;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;


-- Indices
CREATE UNIQUE INDEX "PK_8c82d7f526340ab734260ea46be" ON public.migrations USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_78e3a98adaf20813cd150d44f25" ON public.processor_status USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_23ab11d38f2d5670ad938075527" ON public.preprocessed_data_bucket USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_4578b4a7577d2f68238579463fa" ON public.asset_volume_historical_data USING btree (id);
CREATE INDEX "IDX_21f7e4003ecc26871f370f34bb" ON public.asset_volume_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_700d55bbd28ec496a8bfa680a38" ON public.asset_swap_fee_historical_data USING btree (id);
CREATE INDEX "IDX_37f92b940599ef379fa2f69214" ON public.asset_swap_fee_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_8e6366a12aeb9840bed55c759c6" ON public.account_asset_balance_historical_data USING btree (id);
CREATE INDEX "IDX_508f3309210c595461e3d7f7e6" ON public.account_asset_balance_historical_data USING btree (para_block_height);
CREATE INDEX aabhd_latest_pos_idx ON public.account_asset_balance_historical_data USING btree (account_id, asset_id, para_block_height DESC) INCLUDE (transferable, total_locked) WHERE ((transferable + total_locked) > (0)::numeric);
CREATE INDEX idx_account_asset_balance_historical_data_account_asset_para_bl ON public.account_asset_balance_historical_data USING btree (account_id, asset_id, para_block_height DESC);
CREATE INDEX idx_account_asset_balance_for_latest_query ON public.account_asset_balance_historical_data USING btree (account_id, asset_id, para_block_height DESC) INCLUDE (transferable_in_ref_asset_norm, total_locked_in_ref_asset_norm);


-- Indices
CREATE UNIQUE INDEX "PK_26cac3022e83cd9e402f391a3bc" ON public.account_asset_balance_latest USING btree (id);
CREATE INDEX "IDX_c348accf5aae45241880b7067d" ON public.account_asset_balance_latest USING btree (account_id);
CREATE INDEX "IDX_f59c03208fcf3eb5569a628453" ON public.account_asset_balance_latest USING btree (asset_id);
CREATE INDEX "IDX_829143094d2db714f0ec343941" ON public.account_asset_balance_latest USING btree (total);


-- Indices
CREATE UNIQUE INDEX "PK_bc0af68657cdea66829a44cee28" ON public.account_total_balance_historical_data USING btree (id);
CREATE INDEX "IDX_4fd8abd64aeae7bb383b2fe3ba" ON public.account_total_balance_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_5065a7b1305290be9e3239ad588" ON public.account_mm_position_historical_data USING btree (id);
CREATE INDEX "IDX_e18fdac6be5ef90a988891bae2" ON public.account_mm_position_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_773c6007c43309f34e460b0b002" ON public.batch_xykpool_hist_vols_list USING btree (id);
CREATE INDEX "IDX_6a2cdf49bbbfb7a3a6fc035b4f" ON public.batch_xykpool_hist_vols_list USING btree (batch_start_para_block_height);
CREATE INDEX "IDX_f87efa62b733ff8b175e0674c6" ON public.batch_xykpool_hist_vols_list USING btree (batch_end_para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_1fce3072fbf094340ecdd7ae0bd" ON public.batch_omnipool_asset_hist_vols_list USING btree (id);
CREATE INDEX "IDX_fdab2dfef241c0d81fe0b5c033" ON public.batch_omnipool_asset_hist_vols_list USING btree (batch_start_para_block_height);
CREATE INDEX "IDX_bae57809624f235fb833bfc2db" ON public.batch_omnipool_asset_hist_vols_list USING btree (batch_end_para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_0e333d629d1b05577d5261c5469" ON public.batch_lbppool_hist_vols_list USING btree (id);
CREATE INDEX "IDX_0b41afcfc3eecbfe507f1f6e6d" ON public.batch_lbppool_hist_vols_list USING btree (batch_start_para_block_height);
CREATE INDEX "IDX_a571fd873bd1bfea2ed5f83d19" ON public.batch_lbppool_hist_vols_list USING btree (batch_end_para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_1dc6a4c78fab8b57369c2d00dfe" ON public.omnipool_asset_historical_data_latest USING btree (id);
CREATE INDEX "IDX_eed1b3d6cecaabcb69bc6ad65b" ON public.omnipool_asset_historical_data_latest USING btree (asset_id);


-- Indices
CREATE UNIQUE INDEX "PK_bd57ae2ca21d7a1b14c40609b4d" ON public.batch_stableswap_hist_vols_list USING btree (id);
CREATE INDEX "IDX_aef0c44d0132afcc19d9362b9f" ON public.batch_stableswap_hist_vols_list USING btree (batch_start_para_block_height);
CREATE INDEX "IDX_47abac84eea280413b3e1b806f" ON public.batch_stableswap_hist_vols_list USING btree (batch_end_para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_6ef98ab91280a0719d9fe30690e" ON public.stableswap_asset_historical_data_latest USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_bc56beb14148c4c461fcf5132e7" ON public.batch_hsmpool_asset_hist_vols_list USING btree (id);
CREATE INDEX "IDX_675c503142d248670cf564f607" ON public.batch_hsmpool_asset_hist_vols_list USING btree (batch_start_para_block_height);
CREATE INDEX "IDX_ee4baaef7e78b9a6a634842e14" ON public.batch_hsmpool_asset_hist_vols_list USING btree (batch_end_para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_7ad872d73a82e93af4717b8b485" ON public.constants_historical_data USING btree (id);
CREATE INDEX "IDX_74eba31c8da74bbbf7cd148409" ON public.constants_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_510dcad4579d31b8ab118327716" ON public.ema_oracle_entry_historical_data USING btree (id);
CREATE INDEX "IDX_8c39e3994b55a85485de8cbdef" ON public.ema_oracle_entry_historical_data USING btree (source);
CREATE INDEX "IDX_f9c17d541699c24f0213aed8be" ON public.ema_oracle_entry_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_ffe58aa05707db77c2f20ecdbc3" ON public.nft_collection USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_cc8df03c45b7811002d0d907e70" ON public.nft_asset USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_b21070085e0e2adbfa536525377" ON public.omnipool_global_farm USING btree (id);
CREATE INDEX "IDX_acdadfd385ba5c9629ff3b2826" ON public.omnipool_global_farm USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_31fef43691fbae0801e0e36c63b" ON public.omnipool_yield_farm USING btree (id);
CREATE INDEX "IDX_5fe4ff8082e40a075ad28d6c87" ON public.omnipool_yield_farm USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_7962ef0a1fd2ce11a29068b0c8d" ON public.omnipool_yield_farm_deposit USING btree (id);
CREATE INDEX "IDX_66a008d1ad028f85c6d3281613" ON public.omnipool_yield_farm_deposit USING btree (created_at_para_block_height);
CREATE INDEX "IDX_2f177b2ced986efc31c56bedf3" ON public.omnipool_yield_farm_deposit USING btree (destroyed_at_para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_a289981cbcf7295bb41d7e41140" ON public.omnipool_yield_farm_deposit_event USING btree (id);
CREATE INDEX "IDX_e12a0e63748bb897bbc8b4f629" ON public.omnipool_yield_farm_deposit_event USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_a38d86b8b0b83741a4ed9407357" ON public.xyk_yield_farm_deposit USING btree (id);
CREATE INDEX "IDX_4030d18bc74fd6f8808da38b85" ON public.xyk_yield_farm_deposit USING btree (created_at_para_block_height);
CREATE INDEX "IDX_3d22c58f8f8068e4555e8b3ffe" ON public.xyk_yield_farm_deposit USING btree (destroyed_at_para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_e9998cb14c035a5279c52ee420b" ON public.xyk_yield_farm_deposit_event USING btree (id);
CREATE INDEX "IDX_78f2882309fee6e552cf5d8380" ON public.xyk_yield_farm_deposit_event USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_d2c0807b36c45771c8b9efe6a20" ON public.asset_historical_data USING btree (id);
CREATE INDEX "IDX_950584f39612b44c0e3719f19c" ON public.asset_historical_data USING btree (para_block_height);
CREATE INDEX idx_asset_historical_data_asset_id_para_block_height ON public.asset_historical_data USING btree (asset_id, para_block_height DESC);
ALTER TABLE "public"."asset_assets_pair_volume" ADD FOREIGN KEY ("asset_historical_data_id") REFERENCES "public"."asset_historical_data"("id");
ALTER TABLE "public"."asset_assets_pair_volume" ADD FOREIGN KEY ("assets_pair_volume_historical_data_id") REFERENCES "public"."assets_pair_volume_historical_data"("id");


-- Indices
CREATE UNIQUE INDEX "PK_daccceedb87da72c870bfa3fda1" ON public.asset_assets_pair_volume USING btree (id);
CREATE INDEX "IDX_ec24e4590bf4611dd60b110aee" ON public.asset_assets_pair_volume USING btree (asset_historical_data_id);
CREATE INDEX "IDX_d6417f7ebbef692e559983906d" ON public.asset_assets_pair_volume USING btree (assets_pair_volume_historical_data_id);
CREATE INDEX "IDX_ca951386d3458f860be384b6aa" ON public.asset_assets_pair_volume USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_14475cc0fb1bcf290062485692e" ON public.assets_pair_volume_historical_data USING btree (id);
CREATE INDEX "IDX_6380866c063db49e8d15fd51cd" ON public.assets_pair_volume_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_d0925763efb591c2e2ffb267572" ON public.block USING btree (id);
CREATE INDEX "IDX_bce676e2b005104ccb768495db" ON public.block USING btree (height);
CREATE INDEX "IDX_f8fba63d7965bfee9f304c487a" ON public.block USING btree (hash);
CREATE INDEX "IDX_5c67cbcf4960c1a39e5fe25e87" ON public.block USING btree ("timestamp");
ALTER TABLE "public"."call" ADD FOREIGN KEY ("block_id") REFERENCES "public"."block"("id");
ALTER TABLE "public"."call" ADD FOREIGN KEY ("extrinsic_id") REFERENCES "public"."extrinsic"("id");
ALTER TABLE "public"."call" ADD FOREIGN KEY ("parent_id") REFERENCES "public"."call"("id");


-- Indices
CREATE UNIQUE INDEX "PK_2098af0169792a34f9cfdd39c47" ON public.call USING btree (id);
CREATE INDEX "IDX_ae1dd5dbe82c0145db071a4810" ON public.call USING btree (para_block_height);
CREATE INDEX "IDX_bd3f11fd4110d60ac8b96cd62f" ON public.call USING btree (block_id);
CREATE INDEX "IDX_dde30e4f2c6a80f9236bfdf259" ON public.call USING btree (extrinsic_id);
CREATE INDEX "IDX_11c1e76d5be8f04c472c4a05b9" ON public.call USING btree (parent_id);
ALTER TABLE "public"."extrinsic" ADD FOREIGN KEY ("block_id") REFERENCES "public"."block"("id");


-- Indices
CREATE UNIQUE INDEX "PK_80d7db0e4b1e83e30336bc76755" ON public.extrinsic USING btree (id);
CREATE INDEX "IDX_6f35401151cf9defea1226102b" ON public.extrinsic USING btree (para_block_height);
CREATE INDEX "IDX_a3b99daba1259dab0dd040d4f7" ON public.extrinsic USING btree (block_id);
ALTER TABLE "public"."account_chain_activity_trace" ADD FOREIGN KEY ("account_id") REFERENCES "public"."account"("id");
ALTER TABLE "public"."account_chain_activity_trace" ADD FOREIGN KEY ("chain_activity_trace_id") REFERENCES "public"."chain_activity_trace"("id");


-- Indices
CREATE UNIQUE INDEX "PK_e832c7a98d7de349b5fccc0c34e" ON public.account_chain_activity_trace USING btree (id);
CREATE INDEX "IDX_d192e6637a761ef190582d0355" ON public.account_chain_activity_trace USING btree (account_id);
CREATE INDEX "IDX_b759ef6840440664835e4890fe" ON public.account_chain_activity_trace USING btree (chain_activity_trace_id);
ALTER TABLE "public"."chain_activity_trace" ADD FOREIGN KEY ("originator_id") REFERENCES "public"."account"("id");
ALTER TABLE "public"."chain_activity_trace" ADD FOREIGN KEY ("block_id") REFERENCES "public"."block"("id");


-- Indices
CREATE UNIQUE INDEX "PK_164702284b0a05ee17e51017525" ON public.chain_activity_trace USING btree (id);
CREATE INDEX "IDX_d665d031ccf880084aeef8290a" ON public.chain_activity_trace USING btree (originator_id);
CREATE INDEX "IDX_492761ab89b035291484b32f36" ON public.chain_activity_trace USING btree (para_block_height);
CREATE INDEX "IDX_f08c4c267ab4a9e76030e6d404" ON public.chain_activity_trace USING btree (block_id);
ALTER TABLE "public"."chain_activity_trace_relation" ADD FOREIGN KEY ("parent_trace_id") REFERENCES "public"."chain_activity_trace"("id");
ALTER TABLE "public"."chain_activity_trace_relation" ADD FOREIGN KEY ("child_trace_id") REFERENCES "public"."chain_activity_trace"("id");
ALTER TABLE "public"."chain_activity_trace_relation" ADD FOREIGN KEY ("block_id") REFERENCES "public"."block"("id");


-- Indices
CREATE UNIQUE INDEX "PK_a5284175c0ed2afaf3703b9cd07" ON public.chain_activity_trace_relation USING btree (id);
CREATE INDEX "IDX_e140c24845ed82e99ec4a65c15" ON public.chain_activity_trace_relation USING btree (parent_trace_id);
CREATE INDEX "IDX_6be7f6950fe25222e68a9ccde4" ON public.chain_activity_trace_relation USING btree (child_trace_id);
CREATE INDEX "IDX_1c9873daacddabb0775be4d091" ON public.chain_activity_trace_relation USING btree (para_block_height);
CREATE INDEX "IDX_4d2b8705c14236866bf6ea526b" ON public.chain_activity_trace_relation USING btree (block_id);
ALTER TABLE "public"."event" ADD FOREIGN KEY ("call_id") REFERENCES "public"."call"("id");
ALTER TABLE "public"."event" ADD FOREIGN KEY ("block_id") REFERENCES "public"."block"("id");


-- Indices
CREATE UNIQUE INDEX "PK_30c2f3bbaf6d34a55f8ae6e4614" ON public.event USING btree (id);
CREATE INDEX "IDX_ba299c8fdec925154085dceff5" ON public.event USING btree (para_block_height);
CREATE INDEX "IDX_2b0d35d675c4f99751855c4502" ON public.event USING btree (block_id);
CREATE INDEX "IDX_83cf1bd59aa4521ed882fa5145" ON public.event USING btree (call_id);


-- Indices
CREATE UNIQUE INDEX "PK_ef87fb908f232298be8c24204fb" ON public.lbppool USING btree (id);
CREATE INDEX "IDX_215cad117180bfd6b8cffb3eea" ON public.lbppool USING btree (created_at_para_block_height);
ALTER TABLE "public"."lbppool_price_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."lbppool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_6757dd3bfc218ad75e5d6358a75" ON public.lbppool_price_historical_data USING btree (id);
CREATE INDEX "IDX_9de871ec5024a9bd17d80b4cad" ON public.lbppool_price_historical_data USING btree (pool_id);
CREATE INDEX "IDX_cbbb85c6f7ea860e4d779ea964" ON public.lbppool_price_historical_data USING btree (para_block_height);
ALTER TABLE "public"."lbppool_volume_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."lbppool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_e706f2862f6f116f258368231b8" ON public.lbppool_volume_historical_data USING btree (id);
CREATE INDEX "IDX_f0cb04556654295e8c94d2d279" ON public.lbppool_volume_historical_data USING btree (pool_id);
CREATE INDEX "IDX_f1f3527cd1b64576cba832ae4b" ON public.lbppool_volume_historical_data USING btree (para_block_height);
ALTER TABLE "public"."lbppool_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."lbppool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_695f514b579de9524d05de41882" ON public.lbppool_historical_data USING btree (id);
CREATE INDEX "IDX_2753c14240f691758e523077a8" ON public.lbppool_historical_data USING btree (pool_id);
CREATE INDEX "IDX_42d9a812e1dea214b1ad4e3f85" ON public.lbppool_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_c659261a47d4e71a475d36d0955" ON public.xykpool USING btree (id);
CREATE INDEX "IDX_6e920bf909e45ed3aa2fcefed7" ON public.xykpool USING btree (created_at_para_block_height);
ALTER TABLE "public"."xykpool_volume_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."xykpool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_5e9897240ab6568b70895781934" ON public.xykpool_volume_historical_data USING btree (id);
CREATE INDEX "IDX_3a2f1feb022d71f7e51819c74f" ON public.xykpool_volume_historical_data USING btree (pool_id);
CREATE INDEX "IDX_8389630d49684f2546ea455854" ON public.xykpool_volume_historical_data USING btree (para_block_height);
ALTER TABLE "public"."xykpool_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."xykpool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_344ca919075f62e3434ffe5dc78" ON public.xykpool_historical_data USING btree (id);
CREATE INDEX "IDX_12df318c5a225abf16909a0d3f" ON public.xykpool_historical_data USING btree (pool_id);
CREATE INDEX "IDX_d8b0496d0ae29b74ca1ded4b64" ON public.xykpool_historical_data USING btree (para_block_height);
ALTER TABLE "public"."omnipool_asset" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."omnipool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_6e3b9f3836fa6616f083b5ea75b" ON public.omnipool_asset USING btree (id);
CREATE INDEX "IDX_530f27607e7d82575c5c337d65" ON public.omnipool_asset USING btree (pool_id);
CREATE INDEX "IDX_b6d480d6e9678a34b122cf3f5d" ON public.omnipool_asset USING btree (added_at_para_block_height);
ALTER TABLE "public"."omnipool_asset_volume_historical_data" ADD FOREIGN KEY ("omnipool_asset_id") REFERENCES "public"."omnipool_asset"("id");


-- Indices
CREATE UNIQUE INDEX "PK_138304dc740307c0c8dea9df008" ON public.omnipool_asset_volume_historical_data USING btree (id);
CREATE INDEX "IDX_d0697e336fe62440e81cc058aa" ON public.omnipool_asset_volume_historical_data USING btree (omnipool_asset_id);
CREATE INDEX "IDX_5aff44890a69dcd6c6efb00e73" ON public.omnipool_asset_volume_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_a8cb656c84202ef41ea88bfb28a" ON public.omnipool USING btree (id);
ALTER TABLE "public"."omnipool_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."omnipool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_7756f403ce61b63e6b9b896d2d6" ON public.omnipool_historical_data USING btree (id);
CREATE INDEX "IDX_e82e08fa51052f4b9917e35ff8" ON public.omnipool_historical_data USING btree (pool_id);
CREATE INDEX "IDX_240b99e438ec14ebdc7201dd10" ON public.omnipool_historical_data USING btree (para_block_height);
ALTER TABLE "public"."omnipool_asset_historical_data" ADD FOREIGN KEY ("pool_historical_data_id") REFERENCES "public"."omnipool_historical_data"("id");
ALTER TABLE "public"."omnipool_asset_historical_data" ADD FOREIGN KEY ("omnipool_asset_id") REFERENCES "public"."omnipool_asset"("id");


-- Indices
CREATE UNIQUE INDEX "PK_49ede7b5602a9b88c1c07ca0cd9" ON public.omnipool_asset_historical_data USING btree (id);
CREATE INDEX "IDX_3ac9fc37331b184364dc356628" ON public.omnipool_asset_historical_data USING btree (pool_historical_data_id);
CREATE INDEX "IDX_c70f037aafc69337fea749efa6" ON public.omnipool_asset_historical_data USING btree (omnipool_asset_id);
CREATE INDEX "IDX_757ac8e86648b630d25f55e801" ON public.omnipool_asset_historical_data USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_185a9818270c6ed629d397f8283" ON public.stableswap USING btree (id);
CREATE INDEX "IDX_a2064ceedb89bb55def0910011" ON public.stableswap USING btree (created_at_para_block_height);
ALTER TABLE "public"."stableswap_asset" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."stableswap"("id");


-- Indices
CREATE UNIQUE INDEX "PK_a7a71172de11cd51fd85bfbc063" ON public.stableswap_asset USING btree (id);
CREATE INDEX "IDX_8205ac8ad2bef6985fa6a44caa" ON public.stableswap_asset USING btree (pool_id);
ALTER TABLE "public"."hsmpool" ADD FOREIGN KEY ("facilitator_id") REFERENCES "public"."aave_facilitator"("id");


-- Indices
CREATE UNIQUE INDEX "PK_8c9e99712cd8f9b2f9d216a467d" ON public.hsmpool USING btree (id);
CREATE INDEX "IDX_16c6e7c489d652c684dfc33afb" ON public.hsmpool USING btree (facilitator_id);
ALTER TABLE "public"."hsm_collateral" ADD FOREIGN KEY ("stableswap_id") REFERENCES "public"."stableswap"("id");
ALTER TABLE "public"."hsm_collateral" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."hsmpool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_cc9b986b387028617139eaab41b" ON public.hsm_collateral USING btree (id);
CREATE INDEX "IDX_7ee060b56a10784157c9352b46" ON public.hsm_collateral USING btree (pool_id);
CREATE INDEX "IDX_908443676e328c440eb6dd10bf" ON public.hsm_collateral USING btree (stableswap_id);


-- Indices
CREATE UNIQUE INDEX "PK_0cbd7c4da13ecf255f81e05edd7" ON public.aave_facilitator USING btree (id);


-- Indices
CREATE UNIQUE INDEX "PK_846ad9772ff380a9a8ed8105a09" ON public.account_swap_fee_historical_data USING btree (id);
CREATE INDEX "IDX_93085ea424bc6596a31c0fb155" ON public.account_swap_fee_historical_data USING btree (para_block_height);
ALTER TABLE "public"."account_asset_swap_fee_historical_data" ADD FOREIGN KEY ("collection_id") REFERENCES "public"."account_swap_fee_historical_data"("id");


-- Indices
CREATE UNIQUE INDEX "PK_1fd8dd689bfb71262a6acf9bce3" ON public.account_asset_swap_fee_historical_data USING btree (id);
CREATE INDEX "IDX_b30d302b150dd8a64a41fbcc31" ON public.account_asset_swap_fee_historical_data USING btree (collection_id);
CREATE INDEX "IDX_3125addf0ec6edae3f7f1688c5" ON public.account_asset_swap_fee_historical_data USING btree (para_block_height);
ALTER TABLE "public"."transfer" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_fd9ddbdd49a17afcbe014401295" ON public.transfer USING btree (id);
CREATE INDEX "IDX_6bd4656c70be5e794edb7ed291" ON public.transfer USING btree (para_timestamp);
CREATE INDEX "IDX_2dc4c758a15acf6ec069c30846" ON public.transfer USING btree (para_block_height);
CREATE INDEX "IDX_2a4e1dce9f72514cd28f554ee2" ON public.transfer USING btree (event_id);
ALTER TABLE "public"."swap" ADD FOREIGN KEY ("dca_schedule_execution_event_id") REFERENCES "public"."dca_schedule_execution_event"("id");
ALTER TABLE "public"."swap" ADD FOREIGN KEY ("routed_trade_id") REFERENCES "public"."routed_trade"("id");
ALTER TABLE "public"."swap" ADD FOREIGN KEY ("otc_order_fulfillment_id") REFERENCES "public"."otc_order_event"("id");
ALTER TABLE "public"."swap" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_4a10d0f359339acef77e7f986d9" ON public.swap USING btree (id);
CREATE INDEX "IDX_22851d468109bfd2f8b82edbf2" ON public.swap USING btree (dca_schedule_execution_event_id);
CREATE INDEX "IDX_59ee6156a136c03a8b934768c3" ON public.swap USING btree (otc_order_fulfillment_id);
CREATE INDEX "IDX_64cd4ac680aca800f2ed10fa28" ON public.swap USING btree (routed_trade_id);
CREATE INDEX "IDX_f3139adfeb48356c77d27ca5b0" ON public.swap USING btree (para_block_height);
CREATE INDEX "IDX_556d6f3bd0c2899dbb0455d4e0" ON public.swap USING btree (event_id);
ALTER TABLE "public"."swap_asset_balance" ADD FOREIGN KEY ("swap_id") REFERENCES "public"."swap"("id");


-- Indices
CREATE UNIQUE INDEX "PK_9b990077ce51eb7224a18e300ae" ON public.swap_asset_balance USING btree (id);
CREATE INDEX "IDX_03bfc3d33705033af7464455e1" ON public.swap_asset_balance USING btree (swap_id);
ALTER TABLE "public"."dca_schedule" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_fde59ffc96a33c924c16b73be67" ON public.dca_schedule USING btree (id);
CREATE INDEX "IDX_ab0aec830806fc4d898fad47b4" ON public.dca_schedule USING btree (status);
CREATE INDEX "IDX_20072b79fe47c218f3cfdd1a88" ON public.dca_schedule USING btree (para_block_height);
CREATE INDEX "IDX_e096cf4bb537da55b69aa3d86e" ON public.dca_schedule USING btree (event_id);
ALTER TABLE "public"."dca_schedule_order_route_hop" ADD FOREIGN KEY ("schedule_id") REFERENCES "public"."dca_schedule"("id");


-- Indices
CREATE UNIQUE INDEX "PK_d41ec88de31c8a66cd3d49ca633" ON public.dca_schedule_order_route_hop USING btree (id);
CREATE INDEX "IDX_4b6baab039c188defde9fea550" ON public.dca_schedule_order_route_hop USING btree (schedule_id);
ALTER TABLE "public"."dca_schedule_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");
ALTER TABLE "public"."dca_schedule_event" ADD FOREIGN KEY ("schedule_id") REFERENCES "public"."dca_schedule"("id");


-- Indices
CREATE UNIQUE INDEX "PK_e096cf4bb537da55b69aa3d86ea" ON public.dca_schedule_event USING btree (id);
CREATE INDEX "IDX_b65b2af80f69e01377bbe0597b" ON public.dca_schedule_event USING btree (schedule_id);
CREATE INDEX "IDX_baf2fe838ed3dee007c5b85d46" ON public.dca_schedule_event USING btree (event_name);
CREATE INDEX "IDX_bf3d2547007afcfad5b8d996f1" ON public.dca_schedule_event USING btree (para_block_height);
CREATE INDEX "IDX_5527f963404a23e38cd7862efc" ON public.dca_schedule_event USING btree (event_id);
ALTER TABLE "public"."dca_schedule_execution" ADD FOREIGN KEY ("schedule_id") REFERENCES "public"."dca_schedule"("id");


-- Indices
CREATE UNIQUE INDEX "PK_3acfb6b19305745dc9771d1e3ad" ON public.dca_schedule_execution USING btree (id);
CREATE INDEX "IDX_b742c3842ca3ab32a44c9a419c" ON public.dca_schedule_execution USING btree (schedule_id);
CREATE INDEX "IDX_89a4d9eb27749fc079f5517af1" ON public.dca_schedule_execution USING btree (status);
ALTER TABLE "public"."dca_schedule_execution_event" ADD FOREIGN KEY ("schedule_execution_id") REFERENCES "public"."dca_schedule_execution"("id");
ALTER TABLE "public"."dca_schedule_execution_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_eb899c009d073b4019520c224cc" ON public.dca_schedule_execution_event USING btree (id);
CREATE INDEX "IDX_565ba0bf810f7fcc7ff9bb5ac1" ON public.dca_schedule_execution_event USING btree (schedule_execution_id);
CREATE INDEX "IDX_c4198e06f94525f8a607d950e8" ON public.dca_schedule_execution_event USING btree (event_name);
CREATE INDEX "IDX_e18bcb72567eb07bce5906ab49" ON public.dca_schedule_execution_event USING btree (para_block_height);
CREATE INDEX "IDX_aa60a061c19ce212292886dc69" ON public.dca_schedule_execution_event USING btree (event_id);


-- Indices
CREATE UNIQUE INDEX "PK_62f22d282db637808ecfae04b64" ON public.otc_order USING btree (id);
CREATE INDEX "IDX_7329c1f404d46516062d62a6ea" ON public.otc_order USING btree (status);
CREATE INDEX "IDX_a43414db0dc3af4e401ab32aa5" ON public.otc_order USING btree (para_block_height);
ALTER TABLE "public"."otc_order_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");
ALTER TABLE "public"."otc_order_event" ADD FOREIGN KEY ("swap_id") REFERENCES "public"."swap"("id");
ALTER TABLE "public"."otc_order_event" ADD FOREIGN KEY ("order_id") REFERENCES "public"."otc_order"("id");


-- Indices
CREATE UNIQUE INDEX "PK_2d73db3b0c38a924be9e0320ed3" ON public.otc_order_event USING btree (id);
CREATE INDEX "IDX_fc8247eb6cde837e43a7859aaa" ON public.otc_order_event USING btree (operation_id);
CREATE INDEX "IDX_09c0199552c2cecc73771aee4a" ON public.otc_order_event USING btree (order_id);
CREATE INDEX "IDX_fb73f16252101cfd709f5caf9a" ON public.otc_order_event USING btree (event_name);
CREATE INDEX "IDX_dfb176806ea22e9ea78d5e02db" ON public.otc_order_event USING btree (swap_id);
CREATE INDEX "IDX_c7a315c51c0742a5060bbfbb9c" ON public.otc_order_event USING btree (para_block_height);
CREATE INDEX "IDX_1c65de72d75e9419267ca0ed29" ON public.otc_order_event USING btree (event_id);


-- Indices
CREATE UNIQUE INDEX "PK_a6760c1104ec8d7dae03976fb72" ON public.routed_trade USING btree (id);
CREATE INDEX "IDX_a7cfc56f7d1fe6d7e71cf9a108" ON public.routed_trade USING btree (para_block_height);
CREATE INDEX idx_routed_trade_participant_swappers_gin ON public.routed_trade USING gin (participant_swappers);
ALTER TABLE "public"."routed_trade_asset_balance" ADD FOREIGN KEY ("routed_trade_id") REFERENCES "public"."routed_trade"("id");


-- Indices
CREATE UNIQUE INDEX "PK_66b3584c667064b729e1789a69f" ON public.routed_trade_asset_balance USING btree (id);
CREATE INDEX "IDX_c4caa520fb975186c5fda26083" ON public.routed_trade_asset_balance USING btree (routed_trade_id);
ALTER TABLE "public"."swap_fee" ADD FOREIGN KEY ("swap_id") REFERENCES "public"."swap"("id");


-- Indices
CREATE UNIQUE INDEX "PK_b123759dc8840201926362e75cb" ON public.swap_fee USING btree (id);
CREATE INDEX "IDX_068c8a1a1446df97fb2f0722c1" ON public.swap_fee USING btree (swap_id);
ALTER TABLE "public"."stableswap_volume_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."stableswap"("id");


-- Indices
CREATE UNIQUE INDEX "PK_9290c14b4642ce8e7b1e7c9ca58" ON public.stableswap_volume_historical_data USING btree (id);
CREATE INDEX "IDX_e78b665a80da948e04604b6a1f" ON public.stableswap_volume_historical_data USING btree (pool_id);
CREATE INDEX "IDX_06da11cebeb7bae2011b758f64" ON public.stableswap_volume_historical_data USING btree (para_block_height);
ALTER TABLE "public"."stableswap_asset_volume_historical_data" ADD FOREIGN KEY ("volumes_collection_id") REFERENCES "public"."stableswap_volume_historical_data"("id");


-- Indices
CREATE UNIQUE INDEX "PK_9b6517a82ec252fde3d6f0f9985" ON public.stableswap_asset_volume_historical_data USING btree (id);
CREATE INDEX "IDX_c398a52d189798e0bd8f1904fd" ON public.stableswap_asset_volume_historical_data USING btree (volumes_collection_id);
CREATE INDEX "IDX_8a5204006a608d67f7ad2660e1" ON public.stableswap_asset_volume_historical_data USING btree (para_block_height);
ALTER TABLE "public"."stableswap_liquidity_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");
ALTER TABLE "public"."stableswap_liquidity_event" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."stableswap"("id");


-- Indices
CREATE UNIQUE INDEX "PK_122d928f9439b2eb9f0764d5503" ON public.stableswap_liquidity_event USING btree (id);
CREATE INDEX "IDX_631d0e88fa78e16e45838d22a8" ON public.stableswap_liquidity_event USING btree (pool_id);
CREATE INDEX "IDX_2273b6af2822712ba3ddc795c9" ON public.stableswap_liquidity_event USING btree (index_in_block);
CREATE INDEX "IDX_a40ac5c1e07781ff70415499a6" ON public.stableswap_liquidity_event USING btree (para_block_height);
CREATE INDEX "IDX_be604661cf1224875e88589193" ON public.stableswap_liquidity_event USING btree (event_id);
ALTER TABLE "public"."stableswap_asset_liquidity_amount" ADD FOREIGN KEY ("liquidity_action_id") REFERENCES "public"."stableswap_liquidity_event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_5bfe2f5f6a0bc50e1eb06e35401" ON public.stableswap_asset_liquidity_amount USING btree (id);
CREATE INDEX "IDX_d163e3bf1091fbb17124498ecd" ON public.stableswap_asset_liquidity_amount USING btree (liquidity_action_id);
ALTER TABLE "public"."stableswap_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."stableswap"("id");


-- Indices
CREATE UNIQUE INDEX "PK_a1fa3df998cfeeb7c65226b9a51" ON public.stableswap_historical_data USING btree (id);
CREATE INDEX "IDX_61f4386afc26c7786e1006b446" ON public.stableswap_historical_data USING btree (pool_id);
CREATE INDEX "IDX_3d8bf94440b9e83a16f4cb68e1" ON public.stableswap_historical_data USING btree (para_block_height);
ALTER TABLE "public"."stableswap_asset_historical_data" ADD FOREIGN KEY ("stableswap_asset_id") REFERENCES "public"."stableswap_asset"("id");


-- Indices
CREATE UNIQUE INDEX "PK_efc8d0c7a5bc1c8f93b1b030ad1" ON public.stableswap_asset_historical_data USING btree (id);
CREATE INDEX "IDX_23ef8452e84939f6ff0312cd00" ON public.stableswap_asset_historical_data USING btree (stableswap_asset_id);
CREATE INDEX "IDX_73910fdf8e27878b69dc5b5d95" ON public.stableswap_asset_historical_data USING btree (para_block_height);
ALTER TABLE "public"."hsmpool_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."hsmpool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_c085929d2971bdb1e7b968ca062" ON public.hsmpool_historical_data USING btree (id);
CREATE INDEX "IDX_4f8d78c8bd431f1f043c3d367f" ON public.hsmpool_historical_data USING btree (pool_id);
CREATE INDEX "IDX_1a20840728738826c6a89b50b9" ON public.hsmpool_historical_data USING btree (para_timestamp);
CREATE INDEX "IDX_bd01f57f46c1d0178be37a092a" ON public.hsmpool_historical_data USING btree (para_block_height);
ALTER TABLE "public"."hsm_collateral_config_historical_data" ADD FOREIGN KEY ("collateral_id") REFERENCES "public"."hsm_collateral"("id");


-- Indices
CREATE UNIQUE INDEX "PK_2da830faadf28cb571110cc2b3d" ON public.hsm_collateral_config_historical_data USING btree (id);
CREATE INDEX "IDX_aa4e225a33f82feb5daa75ee0b" ON public.hsm_collateral_config_historical_data USING btree (collateral_id);
CREATE INDEX "IDX_a345002139d15dcc1c5760f138" ON public.hsm_collateral_config_historical_data USING btree (para_timestamp);
CREATE INDEX "IDX_4fef856836571ebfadf433b78e" ON public.hsm_collateral_config_historical_data USING btree (para_block_height);
ALTER TABLE "public"."aave_facilitator_historical_data" ADD FOREIGN KEY ("facilitator_id") REFERENCES "public"."aave_facilitator"("id");


-- Indices
CREATE UNIQUE INDEX "PK_ee322bf1ab03e20da68bbcdf04b" ON public.aave_facilitator_historical_data USING btree (id);
CREATE INDEX "IDX_78b8ff15d51bd5900fb7833a3f" ON public.aave_facilitator_historical_data USING btree (facilitator_id);
CREATE INDEX "IDX_80e7fb4e92228ab21fc9737053" ON public.aave_facilitator_historical_data USING btree (para_timestamp);
CREATE INDEX "IDX_e0a03ffb16bfceb23a6bc7dd97" ON public.aave_facilitator_historical_data USING btree (para_block_height);
ALTER TABLE "public"."hsmpool_asset_historical_data" ADD FOREIGN KEY ("collateral_id") REFERENCES "public"."hsm_collateral"("id");
ALTER TABLE "public"."hsmpool_asset_historical_data" ADD FOREIGN KEY ("facilitator_hist_data_id") REFERENCES "public"."aave_facilitator_historical_data"("id");


-- Indices
CREATE UNIQUE INDEX "PK_98e43be02add7ada9e71bd6db59" ON public.hsmpool_asset_historical_data USING btree (id);
CREATE INDEX "IDX_236d0afac39c9d040d3049650e" ON public.hsmpool_asset_historical_data USING btree (collateral_id);
CREATE INDEX "IDX_24168d44d86c910f7e4889ca26" ON public.hsmpool_asset_historical_data USING btree (facilitator_hist_data_id);
CREATE INDEX "IDX_e5da685032376ffaa1679a1925" ON public.hsmpool_asset_historical_data USING btree (para_timestamp);
CREATE INDEX "IDX_730d5f4b97af369c8b47ff5db9" ON public.hsmpool_asset_historical_data USING btree (para_block_height);
ALTER TABLE "public"."money_market_reserve" ADD FOREIGN KEY ("aave_pool_id") REFERENCES "public"."aavepool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_d562d71cb7574568b15bb07d3ce" ON public.money_market_reserve USING btree (id);
CREATE INDEX "IDX_349b9def6844db4407e2abbba5" ON public.money_market_reserve USING btree (aave_pool_id);
ALTER TABLE "public"."mm_reserve_indexes_historical_data" ADD FOREIGN KEY ("reserve_id") REFERENCES "public"."money_market_reserve"("id");


-- Indices
CREATE UNIQUE INDEX "PK_68630dee5ca4012e569bdc139a8" ON public.mm_reserve_indexes_historical_data USING btree (id);
CREATE INDEX "IDX_31be250211fef14ca5b2912357" ON public.mm_reserve_indexes_historical_data USING btree (reserve_id);
CREATE INDEX "IDX_173dc8dbb83b7629827b9b17c8" ON public.mm_reserve_indexes_historical_data USING btree (para_block_height);
ALTER TABLE "public"."mm_reserve_config_historical_data" ADD FOREIGN KEY ("reserve_id") REFERENCES "public"."money_market_reserve"("id");


-- Indices
CREATE UNIQUE INDEX "PK_c5134f8bffd19582e6e920184ae" ON public.mm_reserve_config_historical_data USING btree (id);
CREATE INDEX "IDX_5d6690e9f25d7e5dc3e5575b47" ON public.mm_reserve_config_historical_data USING btree (reserve_id);
CREATE INDEX "IDX_937e18718ecccaef8cdbea1616" ON public.mm_reserve_config_historical_data USING btree (para_block_height);
ALTER TABLE "public"."aavepool" ADD FOREIGN KEY ("money_market_reserve_id") REFERENCES "public"."money_market_reserve"("id");


-- Indices
CREATE UNIQUE INDEX "PK_1626daca149540fd0c3590fa65a" ON public.aavepool USING btree (id);
CREATE INDEX "IDX_50218a357bb16db3279d205f40" ON public.aavepool USING btree (money_market_reserve_id);
ALTER TABLE "public"."aavepool_historical_data" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."aavepool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_5f3ed369ac4ab9081b1bc54bce1" ON public.aavepool_historical_data USING btree (id);
CREATE INDEX "IDX_093b7c9bca5cbcadf7641a4b58" ON public.aavepool_historical_data USING btree (pool_id);
CREATE INDEX "IDX_b036adf6e514ff7219dd300a73" ON public.aavepool_historical_data USING btree (para_block_height);
ALTER TABLE "public"."mm_supply" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");
ALTER TABLE "public"."mm_supply" ADD FOREIGN KEY ("initiated_by_trade_id") REFERENCES "public"."routed_trade"("id");


-- Indices
CREATE UNIQUE INDEX "PK_d56cbc917e757d5e8d34182d706" ON public.mm_supply USING btree (id);
CREATE INDEX "IDX_2e04f6906aabbad52eec983383" ON public.mm_supply USING btree (initiated_by_trade_id);
CREATE INDEX "IDX_b289d8861972af55847625c48b" ON public.mm_supply USING btree (para_block_height);
CREATE INDEX "IDX_29e9444bd111df5911ccfe50d2" ON public.mm_supply USING btree (event_id);
ALTER TABLE "public"."mm_withdraw" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");
ALTER TABLE "public"."mm_withdraw" ADD FOREIGN KEY ("initiated_by_trade_id") REFERENCES "public"."routed_trade"("id");


-- Indices
CREATE UNIQUE INDEX "PK_a135fe31c772f46fba867b212ca" ON public.mm_withdraw USING btree (id);
CREATE INDEX "IDX_3f8b06939980b2698d1caad0f6" ON public.mm_withdraw USING btree (initiated_by_trade_id);
CREATE INDEX "IDX_1bf16bce0be02d052aaa95df04" ON public.mm_withdraw USING btree (para_block_height);
CREATE INDEX "IDX_13d146928d83a2019c50c87dd1" ON public.mm_withdraw USING btree (event_id);


-- Indices
CREATE UNIQUE INDEX "PK_1209d107fe21482beaea51b745e" ON public.asset USING btree (id);
CREATE INDEX "IDX_2e4f9e0bf465bff05ec5d31d13" ON public.asset USING btree (asset_registry_id);
ALTER TABLE "public"."mm_user_e_mode_set" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_abbc0ac8711daf88808e48b0e55" ON public.mm_user_e_mode_set USING btree (id);
CREATE INDEX "IDX_8707b8d23286223bd1f6cdc392" ON public.mm_user_e_mode_set USING btree (para_block_height);
CREATE INDEX "IDX_912ab8b1c5f7d0f1edd78fe4dd" ON public.mm_user_e_mode_set USING btree (event_id);
ALTER TABLE "public"."mm_repay" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_2d1b0a1542eed3c99685bf693c3" ON public.mm_repay USING btree (id);
CREATE INDEX "IDX_44d3ee640de1cf924966ce71a3" ON public.mm_repay USING btree (para_block_height);
CREATE INDEX "IDX_bac364e2567f0525c597babf53" ON public.mm_repay USING btree (event_id);
ALTER TABLE "public"."mm_liquidation_call" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_963357173963632d8ed1d323cc5" ON public.mm_liquidation_call USING btree (id);
CREATE INDEX "IDX_8b83753478159eea8894dc3845" ON public.mm_liquidation_call USING btree (para_block_height);
CREATE INDEX "IDX_4cd14338296f85eed4eb9172d2" ON public.mm_liquidation_call USING btree (event_id);
ALTER TABLE "public"."mm_reserve_used_as_collateral_enabled_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_5623f4aae9c786de655df4a224e" ON public.mm_reserve_used_as_collateral_enabled_event USING btree (id);
CREATE INDEX "IDX_5e4bb7720ad6995cca04b7bec2" ON public.mm_reserve_used_as_collateral_enabled_event USING btree (para_block_height);
CREATE INDEX "IDX_55de53813dd4c05a746439af7a" ON public.mm_reserve_used_as_collateral_enabled_event USING btree (event_id);
ALTER TABLE "public"."mm_reserve_used_as_collateral_disabled_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_38359193fa869f300cc258940e9" ON public.mm_reserve_used_as_collateral_disabled_event USING btree (id);
CREATE INDEX "IDX_a9a47407f06dc1a20152deaa9a" ON public.mm_reserve_used_as_collateral_disabled_event USING btree (para_block_height);
CREATE INDEX "IDX_c220a3cac1f726994223ca66a7" ON public.mm_reserve_used_as_collateral_disabled_event USING btree (event_id);
ALTER TABLE "public"."omnipool_liquidity_position_event" ADD FOREIGN KEY ("position_id") REFERENCES "public"."omnipool_liquidity_position"("id");


-- Indices
CREATE UNIQUE INDEX "PK_f81f7a760ac213555a9c997417a" ON public.omnipool_liquidity_position_event USING btree (id);
CREATE INDEX "IDX_e54a2859eecbfc565585d212da" ON public.omnipool_liquidity_position_event USING btree (position_id);
CREATE INDEX "IDX_e57457b7b90f0d5ce572b75690" ON public.omnipool_liquidity_position_event USING btree (para_block_height);
ALTER TABLE "public"."omnipool_asset_liquidity_event" ADD FOREIGN KEY ("position_event_id") REFERENCES "public"."omnipool_liquidity_position_event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_e43c15884f3a1469aff7d3122fc" ON public.omnipool_asset_liquidity_event USING btree (id);
CREATE INDEX "IDX_55dd880363c1800cf708e84045" ON public.omnipool_asset_liquidity_event USING btree (position_event_id);
CREATE INDEX "IDX_db7c075ead4bbc0256255baaf2" ON public.omnipool_asset_liquidity_event USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_8fea3b64946a6c85260b6b031d0" ON public.xyk_global_farm USING btree (id);
CREATE INDEX "IDX_1e47870ce30e2ba0ceaad75cb9" ON public.xyk_global_farm USING btree (para_block_height);
ALTER TABLE "public"."xyk_yield_farm" ADD FOREIGN KEY ("global_farm_id") REFERENCES "public"."xyk_global_farm"("id");


-- Indices
CREATE UNIQUE INDEX "PK_29ff7bc1710a1d1b9c3baf9aae0" ON public.xyk_yield_farm USING btree (id);
CREATE INDEX "IDX_5c7814912e39921e576fac2803" ON public.xyk_yield_farm USING btree (global_farm_id);
CREATE INDEX "IDX_1e2744f1756d4cbe41bfaa6446" ON public.xyk_yield_farm USING btree (para_block_height);
ALTER TABLE "public"."transaction_payment_historical_data" ADD FOREIGN KEY ("block_id") REFERENCES "public"."block"("id");


-- Indices
CREATE UNIQUE INDEX "PK_1c7b89eeb3a40c62b3a7e86bbec" ON public.transaction_payment_historical_data USING btree (id);
CREATE INDEX "IDX_b35e2fa4ededc451604d02b553" ON public.transaction_payment_historical_data USING btree (para_block_height);
CREATE INDEX "IDX_b58fe2c6def98ee2fe9ca75a0a" ON public.transaction_payment_historical_data USING btree (block_id);
ALTER TABLE "public"."account" ADD FOREIGN KEY ("hsmpool_id") REFERENCES "public"."hsmpool"("id");
ALTER TABLE "public"."account" ADD FOREIGN KEY ("lbppool_id") REFERENCES "public"."lbppool"("id");
ALTER TABLE "public"."account" ADD FOREIGN KEY ("evm_address_bound_event_id") REFERENCES "public"."event"("id");
ALTER TABLE "public"."account" ADD FOREIGN KEY ("xykpool_id") REFERENCES "public"."xykpool"("id");
ALTER TABLE "public"."account" ADD FOREIGN KEY ("omnipool_id") REFERENCES "public"."omnipool"("id");
ALTER TABLE "public"."account" ADD FOREIGN KEY ("stableswap_id") REFERENCES "public"."stableswap"("id");


-- Indices
CREATE UNIQUE INDEX "PK_54115ee388cdb6d86bb4bf5b2ea" ON public.account USING btree (id);
CREATE INDEX "IDX_3961516579b0ecbebe9cb8deab" ON public.account USING btree (evm_address_bound_event_id);
CREATE INDEX "IDX_a8aaa43a3b533779ed9922dfee" ON public.account USING btree (lbppool_id);
CREATE INDEX "IDX_9a1c8cde84ed1d031263135d92" ON public.account USING btree (xykpool_id);
CREATE INDEX "IDX_d17b2747d3c3c271a37d7045a7" ON public.account USING btree (omnipool_id);
CREATE INDEX "IDX_5b4a8c7e9b7972f766a1b867a3" ON public.account USING btree (stableswap_id);
CREATE INDEX "IDX_2c560c6ac2b094b53d75817926" ON public.account USING btree (hsmpool_id);


-- Indices
CREATE UNIQUE INDEX "PK_c8f22c395207f69962e8a1ea0ee" ON public.asset_spot_price_route USING btree (id);
ALTER TABLE "public"."asset_spot_price_historical_data" ADD FOREIGN KEY ("price_route_id") REFERENCES "public"."asset_spot_price_route"("id");


-- Indices
CREATE UNIQUE INDEX "PK_316b267068f4d3da67f77e0fe5f" ON public.asset_spot_price_historical_data USING btree (id);
CREATE INDEX "IDX_fe6f4476339989cd96972393a6" ON public.asset_spot_price_historical_data USING btree (para_block_height);
CREATE INDEX "IDX_6e40260a566cef4fc7c897fb09" ON public.asset_spot_price_historical_data USING btree (price_route_id);
CREATE INDEX idx_asset_spot_price_historical_data_assets_para_block_height ON public.asset_spot_price_historical_data USING btree (asset_in_id, asset_out_id, para_block_height DESC);
ALTER TABLE "public"."mm_borrow" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_42d208517809a34ef00967ee3aa" ON public.mm_borrow USING btree (id);
CREATE INDEX "IDX_6969db38c5f3ef37f1cf33212a" ON public.mm_borrow USING btree (para_block_height);
CREATE INDEX "IDX_9eed78ac353f760ce92cf1e449" ON public.mm_borrow USING btree (event_id);


-- Indices
CREATE UNIQUE INDEX "PK_5f309e1addac179100ff683dafc" ON public.omnipool_liquidity_position USING btree (id);
CREATE INDEX "IDX_9d9a9ff9ef0f407c1eadd76ad9" ON public.omnipool_liquidity_position USING btree (created_at_para_block_height);
CREATE INDEX "IDX_2277659d3fc2396ef01b014ebd" ON public.omnipool_liquidity_position USING btree (destroyed_at_para_block_height);
ALTER TABLE "public"."xykpool_historical_data_latest" ADD FOREIGN KEY ("pool_id") REFERENCES "public"."xykpool"("id");


-- Indices
CREATE UNIQUE INDEX "PK_83b2f01dddbb335483317b8aba9" ON public.xykpool_historical_data_latest USING btree (id);
CREATE INDEX "IDX_7ecb0b7c0e73a67f8300923626" ON public.xykpool_historical_data_latest USING btree (pool_id);
CREATE INDEX "IDX_a483666c8a0b2c28effdcf87fa" ON public.xykpool_historical_data_latest USING btree (para_block_height);


-- Indices
CREATE UNIQUE INDEX "PK_8de22a6ab0dba093037dfffa490" ON public.account_processing_status USING btree (id);
CREATE INDEX idx_account_processing_status_null_balances ON public.account_processing_status USING btree (id) WHERE (balances_aggregated_at_para_block IS NULL);
CREATE INDEX idx_account_processing_status_ordered_balances ON public.account_processing_status USING btree (balances_aggregated_at_para_block) WHERE (balances_aggregated_at_para_block IS NOT NULL);
ALTER TABLE "public"."liquidation_liquidated_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_ee0afb1841c0e2b62c4f1dc4241" ON public.liquidation_liquidated_event USING btree (id);
CREATE INDEX "IDX_3dcb1bcb4877b5e0940a74f6e8" ON public.liquidation_liquidated_event USING btree (para_block_height);
CREATE INDEX "IDX_957694138c299331b07e2e936c" ON public.liquidation_liquidated_event USING btree (event_id);
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("user_e_mode_set_id") REFERENCES "public"."mm_user_e_mode_set"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("transfer_id") REFERENCES "public"."transfer"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("supply_id") REFERENCES "public"."mm_supply"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("reserve_used_as_collateral_disabled_id") REFERENCES "public"."mm_reserve_used_as_collateral_disabled_event"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("withdraw_id") REFERENCES "public"."mm_withdraw"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("liquidation_call_id") REFERENCES "public"."mm_liquidation_call"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("minted_to_treasury_id") REFERENCES "public"."mm_minted_to_treasury_event"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("repay_id") REFERENCES "public"."mm_repay"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("borrow_id") REFERENCES "public"."mm_borrow"("id");
ALTER TABLE "public"."money_market_event" ADD FOREIGN KEY ("reserve_used_as_collateral_enabled_id") REFERENCES "public"."mm_reserve_used_as_collateral_enabled_event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_3be4b3e3f9cd089066b3d02c254" ON public.money_market_event USING btree (id);
CREATE INDEX "IDX_9d02e623675a59f458d39e88b0" ON public.money_market_event USING btree (all_involved_asset_details);
CREATE INDEX "IDX_062f5754dcbe60f72036dcf728" ON public.money_market_event USING btree (transfer_id);
CREATE INDEX "IDX_f8fa3420b48326ae2b313c1da8" ON public.money_market_event USING btree (supply_id);
CREATE INDEX "IDX_1eec01808ac13a0bc65a0794c7" ON public.money_market_event USING btree (withdraw_id);
CREATE INDEX "IDX_5c2c6e27d9aebc7d1168e2e031" ON public.money_market_event USING btree (borrow_id);
CREATE INDEX "IDX_e4acb460f3593eb103c4589fe2" ON public.money_market_event USING btree (repay_id);
CREATE INDEX "IDX_16862c3e74c020acdea2caa7ad" ON public.money_market_event USING btree (user_e_mode_set_id);
CREATE INDEX "IDX_bf5d40954c88b3a40c536369bc" ON public.money_market_event USING btree (liquidation_call_id);
CREATE INDEX "IDX_9dbdab1627addd6f448a91433f" ON public.money_market_event USING btree (reserve_used_as_collateral_enabled_id);
CREATE INDEX "IDX_d8b5574303d849f0a9e2e709cb" ON public.money_market_event USING btree (reserve_used_as_collateral_disabled_id);
CREATE INDEX "IDX_87aa17150c4012aa53852d48ca" ON public.money_market_event USING btree (para_block_height);
CREATE INDEX "IDX_5361b99ff601090b2d516aa2d9" ON public.money_market_event USING btree (event_id);
CREATE INDEX "IDX_4f80094e38e786da45f2a70846" ON public.money_market_event USING btree (minted_to_treasury_id);
ALTER TABLE "public"."mm_minted_to_treasury_event" ADD FOREIGN KEY ("event_id") REFERENCES "public"."event"("id");


-- Indices
CREATE UNIQUE INDEX "PK_c250a7a2c36161b69313c685623" ON public.mm_minted_to_treasury_event USING btree (id);
CREATE INDEX "IDX_7fcebf169811005659b6e40f72" ON public.mm_minted_to_treasury_event USING btree (para_block_height);
CREATE INDEX "IDX_4581c6474be70bc72afa4dc039" ON public.mm_minted_to_treasury_event USING btree (event_id);
