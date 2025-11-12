DO $$
DECLARE
iteration INTEGER := 0;
    max_iterations INTEGER := 10; -- Number of times to run the update
    updated_count INTEGER;
    total_updated INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting XYK share asset decimals migration...';

    -- Loop through multiple iterations
    WHILE iteration < max_iterations LOOP
        iteration := iteration + 1;
        RAISE NOTICE 'Running iteration %/%', iteration, max_iterations;

        -- Create a temporary table for this iteration
        CREATE TEMP TABLE IF NOT EXISTS xyk_share_decimals_update_temp AS
        SELECT
            a.id as share_asset_id,
            CASE
                WHEN CAST(xp.asset_a_id AS INTEGER) > CAST(xp.asset_b_id AS INTEGER)
                    THEN b_asset.decimals
                ELSE a_asset.decimals
                END as calculated_decimals
        FROM asset a
                 JOIN xykpool xp ON xp.share_token_id = a.id
                 LEFT JOIN asset a_asset ON a_asset.id = xp.asset_a_id
                 LEFT JOIN asset b_asset ON b_asset.id = xp.asset_b_id
        WHERE a.asset_type = 'XYK'
          AND a.decimals IS NULL -- Only update assets that don't have decimals yet
          AND a_asset.decimals IS NOT NULL
          AND b_asset.decimals IS NOT NULL
          AND xp.asset_a_id ~ '^[0-9]+$'
                  AND xp.asset_b_id ~ '^[0-9]+$';

        -- Get count of records to update
        GET DIAGNOSTICS updated_count = ROW_COUNT;

        IF updated_count = 0 THEN
                    RAISE NOTICE 'No more assets to update. Stopping at iteration %.', iteration;
        DROP TABLE IF EXISTS xyk_share_decimals_update_temp;
        EXIT;
        END IF;

                RAISE NOTICE 'Found % assets to update in this iteration', updated_count;

                -- Perform the update
        UPDATE asset
        SET decimals = xsd.calculated_decimals
            FROM xyk_share_decimals_update_temp xsd
        WHERE asset.id = xsd.share_asset_id;

        total_updated := total_updated + updated_count;
                RAISE NOTICE 'Updated % assets in iteration %', updated_count, iteration;

                -- Clean up temp table for next iteration
        DROP TABLE IF EXISTS xyk_share_decimals_update_temp;

END LOOP;

    RAISE NOTICE 'Migration completed after % iterations. Total assets updated: %', iteration, total_updated;

    -- Final summary
    RAISE NOTICE 'Checking remaining XYK assets without decimals...';

    DECLARE
        remaining_count INTEGER;
    BEGIN
        SELECT COUNT(*) INTO remaining_count
        FROM asset
        WHERE asset_type = 'XYK' AND decimals IS NULL;

        RAISE NOTICE 'Remaining XYK assets without decimals: %', remaining_count;
    END;

END $$;