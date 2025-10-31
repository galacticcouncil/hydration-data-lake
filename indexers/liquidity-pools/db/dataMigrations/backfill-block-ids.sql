-- =====================================================================================================================
-- Backfill block_id columns for all historical data tables
-- This script populates NULL block_id values by joining with the block table using para_block_height
-- =====================================================================================================================

-- Pre-check: Count rows with NULL block_id values
DO $$
DECLARE
    null_count INTEGER;
BEGIN
    RAISE NOTICE 'Starting backfill pre-check...';

    SELECT COUNT(*) INTO null_count FROM asset_volume_historical_data WHERE block_id IS NULL;
    RAISE NOTICE 'asset_volume_historical_data: % rows with NULL block_id', null_count;

    SELECT COUNT(*) INTO null_count FROM asset_swap_fee_historical_data WHERE block_id IS NULL;
    RAISE NOTICE 'asset_swap_fee_historical_data: % rows with NULL block_id', null_count;

    SELECT COUNT(*) INTO null_count FROM assets_pair_volume_historical_data WHERE block_id IS NULL;
    RAISE NOTICE 'assets_pair_volume_historical_data: % rows with NULL block_id', null_count;
END $$;

-- =====================================================================================================================
-- Asset-related tables
-- =====================================================================================================================

UPDATE asset_volume_historical_data
SET block_id = (SELECT id FROM block WHERE height = asset_volume_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE asset_swap_fee_historical_data
SET block_id = (SELECT id FROM block WHERE height = asset_swap_fee_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE assets_pair_volume_historical_data
SET block_id = (SELECT id FROM block WHERE height = assets_pair_volume_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE asset_historical_data
SET block_id = (SELECT id FROM block WHERE height = asset_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE asset_spot_price_historical_data
SET block_id = (SELECT id FROM block WHERE height = asset_spot_price_historical_data.para_block_height)
WHERE block_id IS NULL;

-- =====================================================================================================================
-- Account-related tables
-- =====================================================================================================================

UPDATE account_asset_swap_fee_historical_data
SET block_id = (SELECT id FROM block WHERE height = account_asset_swap_fee_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE account_swap_fee_historical_data
SET block_id = (SELECT id FROM block WHERE height = account_swap_fee_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE account_mm_position_historical_data
SET block_id = (SELECT id FROM block WHERE height = account_mm_position_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE account_asset_balance_historical_data
SET block_id = (SELECT id FROM block WHERE height = account_asset_balance_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE account_asset_balance_latest
SET block_id = (SELECT id FROM block WHERE height = account_asset_balance_latest.para_block_height)
WHERE block_id IS NULL;

UPDATE account_total_balance_historical_data
SET block_id = (SELECT id FROM block WHERE height = account_total_balance_historical_data.para_block_height)
WHERE block_id IS NULL;

-- =====================================================================================================================
-- LBP Pool tables
-- =====================================================================================================================

UPDATE lbppool_price_historical_data
SET block_id = (SELECT id FROM block WHERE height = lbppool_price_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE lbppool_volume_historical_data
SET block_id = (SELECT id FROM block WHERE height = lbppool_volume_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE lbppool_historical_data
SET block_id = (SELECT id FROM block WHERE height = lbppool_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE lbppool
SET created_at_block_id = (SELECT id FROM block WHERE height = lbppool.created_at_para_block_height)
WHERE created_at_block_id IS NULL;

-- =====================================================================================================================
-- XYK Pool tables
-- =====================================================================================================================

UPDATE xykpool_price_historical_data
SET block_id = (SELECT id FROM block WHERE height = xykpool_price_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE xykpool_volume_historical_data
SET block_id = (SELECT id FROM block WHERE height = xykpool_volume_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE xykpool_historical_data
SET block_id = (SELECT id FROM block WHERE height = xykpool_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE xykpool
SET created_at_block_id = (SELECT id FROM block WHERE height = xykpool.created_at_para_block_height)
WHERE created_at_block_id IS NULL;

-- =====================================================================================================================
-- Omnipool tables
-- =====================================================================================================================

UPDATE omnipool_asset_volume_historical_data
SET block_id = (SELECT id FROM block WHERE height = omnipool_asset_volume_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE omnipool_historical_data
SET block_id = (SELECT id FROM block WHERE height = omnipool_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE omnipool_asset_historical_data
SET block_id = (SELECT id FROM block WHERE height = omnipool_asset_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE omnipool_asset
SET added_at_block_id = (SELECT id FROM block WHERE height = omnipool_asset.added_at_para_block_height)
WHERE added_at_block_id IS NULL;

-- =====================================================================================================================
-- Stableswap tables
-- =====================================================================================================================

UPDATE stableswap
SET created_at_block_id = (SELECT id FROM block WHERE height = stableswap.created_at_para_block_height)
WHERE created_at_block_id IS NULL;

UPDATE stableswap_asset_volume_historical_data
SET block_id = (SELECT id FROM block WHERE height = stableswap_asset_volume_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE stableswap_volume_historical_data
SET block_id = (SELECT id FROM block WHERE height = stableswap_volume_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE stableswap_asset_historical_data
SET block_id = (SELECT id FROM block WHERE height = stableswap_asset_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE stableswap_historical_data
SET block_id = (SELECT id FROM block WHERE height = stableswap_historical_data.para_block_height)
WHERE block_id IS NULL;

-- =====================================================================================================================
-- Aave/HSM/Money Market tables
-- =====================================================================================================================

UPDATE hsmpool_historical_data
SET block_id = (SELECT id FROM block WHERE height = hsmpool_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE hsm_collateral_config_historical_data
SET block_id = (SELECT id FROM block WHERE height = hsm_collateral_config_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE aave_facilitator_historical_data
SET block_id = (SELECT id FROM block WHERE height = aave_facilitator_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE hsmpool_asset_historical_data
SET block_id = (SELECT id FROM block WHERE height = hsmpool_asset_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE aavepool_historical_data
SET block_id = (SELECT id FROM block WHERE height = aavepool_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE mm_reserve_config_historical_data
SET block_id = (SELECT id FROM block WHERE height = mm_reserve_config_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE mm_reserve_indexes_historical_data
SET block_id = (SELECT id FROM block WHERE height = mm_reserve_indexes_historical_data.para_block_height)
WHERE block_id IS NULL;

-- =====================================================================================================================
-- Other tables
-- =====================================================================================================================

UPDATE otc_order
SET block_id = (SELECT id FROM block WHERE height = otc_order.para_block_height)
WHERE block_id IS NULL;

UPDATE routed_trade
SET block_id = (SELECT id FROM block WHERE height = routed_trade.para_block_height)
WHERE block_id IS NULL;

UPDATE constants_historical_data
SET block_id = (SELECT id FROM block WHERE height = constants_historical_data.para_block_height)
WHERE block_id IS NULL;

UPDATE ema_oracle_entry_historical_data
SET block_id = (SELECT id FROM block WHERE height = ema_oracle_entry_historical_data.para_block_height)
WHERE block_id IS NULL;

-- =====================================================================================================================
-- Post-check: Verify backfill completion
-- =====================================================================================================================

DO $$
DECLARE
    null_count INTEGER;
    total_count INTEGER;
    missing_blocks INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Backfill Verification Report ===';
    RAISE NOTICE '';

    -- Check for any remaining NULLs
    SELECT COUNT(*) INTO null_count FROM asset_volume_historical_data WHERE block_id IS NULL;
    SELECT COUNT(*) INTO total_count FROM asset_volume_historical_data;
    RAISE NOTICE 'asset_volume_historical_data: % NULL / % total', null_count, total_count;

    SELECT COUNT(*) INTO null_count FROM asset_swap_fee_historical_data WHERE block_id IS NULL;
    SELECT COUNT(*) INTO total_count FROM asset_swap_fee_historical_data;
    RAISE NOTICE 'asset_swap_fee_historical_data: % NULL / % total', null_count, total_count;

    SELECT COUNT(*) INTO null_count FROM account_asset_balance_latest WHERE block_id IS NULL;
    SELECT COUNT(*) INTO total_count FROM account_asset_balance_latest;
    RAISE NOTICE 'account_asset_balance_latest: % NULL / % total', null_count, total_count;

    SELECT COUNT(*) INTO null_count FROM lbppool WHERE created_at_block_id IS NULL;
    SELECT COUNT(*) INTO total_count FROM lbppool;
    RAISE NOTICE 'lbppool.created_at_block_id: % NULL / % total', null_count, total_count;

    SELECT COUNT(*) INTO null_count FROM xykpool WHERE created_at_block_id IS NULL;
    SELECT COUNT(*) INTO total_count FROM xykpool;
    RAISE NOTICE 'xykpool.created_at_block_id: % NULL / % total', null_count, total_count;

    SELECT COUNT(*) INTO null_count FROM omnipool_asset WHERE added_at_block_id IS NULL;
    SELECT COUNT(*) INTO total_count FROM omnipool_asset;
    RAISE NOTICE 'omnipool_asset.added_at_block_id: % NULL / % total', null_count, total_count;

    SELECT COUNT(*) INTO null_count FROM stableswap WHERE created_at_block_id IS NULL;
    SELECT COUNT(*) INTO total_count FROM stableswap;
    RAISE NOTICE 'stableswap.created_at_block_id: % NULL / % total', null_count, total_count;

    -- Check for orphaned records (records with para_block_height that don't have matching block)
    SELECT COUNT(*) INTO missing_blocks
    FROM asset_volume_historical_data avhd
    LEFT JOIN block b ON b.height = avhd.para_block_height
    WHERE b.id IS NULL AND avhd.block_id IS NULL;

    IF missing_blocks > 0 THEN
        RAISE WARNING 'Found % records with para_block_height that do not have corresponding block entries!', missing_blocks;
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE 'Backfill verification complete.';
    RAISE NOTICE 'If NULL counts > 0, those records have para_block_height with no matching block.';
END $$;
