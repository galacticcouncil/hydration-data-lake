# Block ID Backfill Migration

This directory contains data migration scripts to backfill `block_id` columns in historical data tables.

## Background

As part of the schema optimization to reduce foreign key overhead, we migrated from `block: Block!` relations to `blockId: String!` scalar fields. This requires a 3-phase migration:

1. **Phase 1 (Complete):** Add nullable `block_id` columns ✅
2. **Phase 2 (Current):** Backfill NULL values from existing Block table
3. **Phase 3 (Future):** Add NOT NULL constraints

## Files

- `backfill-block-ids.sql` - SQL script that updates all 35+ tables with block_id values
- `../src/db-backfill-runner.ts` - TypeScript wrapper to execute the SQL with progress logging

## Usage

### Dry Run (Recommended First)

Preview the SQL without making any changes:

```bash
npm run db:backfill:dry-run
```

This will:
- Connect to the database
- Load the SQL file
- Show a preview of what will be executed
- Exit without making changes

### Execute Backfill

Run the actual backfill operation:

```bash
npm run db:backfill
```

This will:
- Connect to the database
- Execute all UPDATE statements
- Show progress and verification results
- Report any records that couldn't be backfilled

## Environment Configuration

The script uses these environment variables (from `.env` file):

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hydration
DB_USER=postgres
DB_PASS=postgres
```

## What Gets Backfilled

The script populates `block_id` for these 35+ tables:

### Asset Tables
- `asset_volume_historical_data`
- `asset_swap_fee_historical_data`
- `assets_pair_volume_historical_data`
- `asset_historical_data`
- `asset_spot_price_historical_data`

### Account Tables
- `account_asset_swap_fee_historical_data`
- `account_swap_fee_historical_data`
- `account_mm_position_historical_data`
- `account_asset_balance_historical_data`
- `account_asset_balance_latest`
- `account_total_balance_historical_data`

### Pool Tables
- `lbppool` (created_at_block_id)
- `lbppool_price_historical_data`
- `lbppool_volume_historical_data`
- `lbppool_historical_data`
- `xykpool` (created_at_block_id)
- `xykpool_price_historical_data`
- `xykpool_volume_historical_data`
- `xykpool_historical_data`
- `omnipool_asset` (added_at_block_id)
- `omnipool_asset_volume_historical_data`
- `omnipool_historical_data`
- `omnipool_asset_historical_data`
- `stableswap` (created_at_block_id)
- `stableswap_asset_volume_historical_data`
- `stableswap_volume_historical_data`
- `stableswap_asset_historical_data`
- `stableswap_historical_data`

### Money Market Tables
- `aavepool_historical_data`
- `hsmpool_historical_data`
- `hsm_collateral_config_historical_data`
- `aave_facilitator_historical_data`
- `hsmpool_asset_historical_data`
- `mm_reserve_config_historical_data`
- `mm_reserve_indexes_historical_data`

### Other Tables
- `otc_order`
- `routed_trade`
- `constants_historical_data`
- `ema_oracle_entry_historical_data`

## How It Works

The script executes SQL like:

```sql
UPDATE asset_volume_historical_data
SET block_id = (
  SELECT id FROM block WHERE height = asset_volume_historical_data.para_block_height
)
WHERE block_id IS NULL;
```

For each table, it:
1. Joins with the `block` table using `para_block_height`
2. Copies the block `id` into the `block_id` column
3. Only updates rows where `block_id IS NULL` (idempotent)

## Verification

After execution, the script runs verification queries to:
- Count remaining NULL values in each table
- Identify any orphaned records (records with `para_block_height` that don't have a matching `block`)

## Safety Features

✅ **Idempotent** - Can be run multiple times safely (only updates NULLs)
✅ **Read-only dry-run** - Test before executing
✅ **Progress logging** - See what's happening in real-time
✅ **Post-execution verification** - Confirms success
✅ **Error handling** - Gracefully handles connection/query errors

## Expected Results

After successful backfill:
- All records with valid `para_block_height` should have `block_id` populated
- Any remaining NULLs indicate records with `para_block_height` values that don't exist in the `block` table
- Verification report will show counts for sample tables

## Next Steps (Phase 3)

After backfill is complete and verified:

1. Update `schema.graphql` - Change `blockId: String` to `blockId: String!`
2. Generate migration: `npm run db:migration:generate`
3. Review generated `ALTER TABLE ... ALTER COLUMN block_id SET NOT NULL` statements
4. Apply migration to add NOT NULL constraints

## Troubleshooting

### "Block not found" warnings

If some records still have NULL after backfill, it means those records reference block heights that don't exist in the `block` table. To investigate:

```sql
-- Find orphaned records
SELECT DISTINCT para_block_height
FROM asset_volume_historical_data
WHERE block_id IS NULL;

-- Check if blocks exist
SELECT height FROM block
WHERE height IN (SELECT para_block_height FROM asset_volume_historical_data WHERE block_id IS NULL);
```

### Performance considerations

- The backfill uses subqueries which are generally fast for indexed columns
- For very large tables (millions of rows), consider running during off-peak hours
- Monitor database CPU/memory usage during execution

### Rollback

Since the script only updates NULL values:
- You can set `block_id = NULL` to reset if needed
- Original data remains intact (nothing is deleted)

## Support

For issues or questions, contact the development team or check the main repository documentation.
