#!/usr/bin/env node

/**
 * Backfill block_id columns for all historical data tables
 *
 * This script populates NULL block_id values by joining with the block table.
 * It can be run multiple times safely (idempotent).
 *
 * Usage:
 *   npm run db:backfill              # Run backfill
 *   npm run db:backfill -- --dry-run # Preview without making changes
 */

import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';

const DRY_RUN = process.argv.includes('--dry-run');

// Database configuration from environment
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'hydration',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
};

async function main() {
  console.log('='.repeat(80));
  console.log('🔄 Block ID Backfill Script');
  console.log('='.repeat(80));
  console.log();

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be made to the database');
    console.log();
  }

  console.log('Database Configuration:');
  console.log(`  Host:     ${config.host}`);
  console.log(`  Port:     ${config.port}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  User:     ${config.username}`);
  console.log();

  // Create data source
  const dataSource = new DataSource({
    type: 'postgres',
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username,
    password: config.password,
    logging: false,
  });

  try {
    console.log('📡 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected successfully');
    console.log();

    // Read SQL file (in db/dataMigrations directory)
    const sqlFilePath = path.join(__dirname, '..', 'db', 'dataMigrations', 'backfill-block-ids.sql');
    console.log(`📖 Reading SQL file: ${sqlFilePath}`);
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ SQL file loaded');
    console.log();

    if (DRY_RUN) {
      console.log('📋 SQL Preview (first 1000 characters):');
      console.log('-'.repeat(80));
      console.log(sqlContent.substring(0, 1000));
      console.log('...');
      console.log('-'.repeat(80));
      console.log();
      console.log('✅ Dry run complete. No changes were made.');
      console.log('   Run without --dry-run to execute the backfill.');
    } else {
      console.log('⚙️  Executing backfill...');
      console.log('   This may take several minutes depending on data volume.');
      console.log();

      const startTime = Date.now();

      // Execute the SQL file
      await dataSource.query(sqlContent);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log();
      console.log('✅ Backfill completed successfully!');
      console.log(`   Duration: ${duration} seconds`);
      console.log();

      // Run verification query
      console.log('🔍 Running post-backfill verification...');
      console.log();

      const tableGroups = [
        {
          category: 'Asset Tables',
          tables: [
            { table: 'asset_historical_data', column: 'block_id' },
            { table: 'asset_spot_price_historical_data', column: 'block_id' },
            { table: 'asset_volume_historical_data', column: 'block_id' },
            { table: 'asset_swap_fee_historical_data', column: 'block_id' },
            { table: 'assets_pair_volume_historical_data', column: 'block_id' },
          ],
        },
        {
          category: 'Account Tables',
          tables: [
            { table: 'account_asset_balance_historical_data', column: 'block_id' },
            { table: 'account_asset_balance_latest', column: 'block_id' },
            { table: 'account_total_balance_historical_data', column: 'block_id' },
            { table: 'account_asset_swap_fee_historical_data', column: 'block_id' },
            { table: 'account_swap_fee_historical_data', column: 'block_id' },
            { table: 'account_mm_position_historical_data', column: 'block_id' },
          ],
        },
        {
          category: 'LBP Pool Tables',
          tables: [
            { table: 'lbppool', column: 'created_at_block_id' },
            { table: 'lbppool_historical_data', column: 'block_id' },
            { table: 'lbppool_price_historical_data', column: 'block_id' },
            { table: 'lbppool_volume_historical_data', column: 'block_id' },
          ],
        },
        {
          category: 'XYK Pool Tables',
          tables: [
            { table: 'xykpool', column: 'created_at_block_id' },
            { table: 'xykpool_historical_data', column: 'block_id' },
            { table: 'xykpool_price_historical_data', column: 'block_id' },
            { table: 'xykpool_volume_historical_data', column: 'block_id' },
          ],
        },
        {
          category: 'Omnipool Tables',
          tables: [
            { table: 'omnipool_asset', column: 'added_at_block_id' },
            { table: 'omnipool_asset_historical_data', column: 'block_id' },
            { table: 'omnipool_asset_volume_historical_data', column: 'block_id' },
            { table: 'omnipool_historical_data', column: 'block_id' },
          ],
        },
        {
          category: 'Stableswap Tables',
          tables: [
            { table: 'stableswap', column: 'created_at_block_id' },
            { table: 'stableswap_historical_data', column: 'block_id' },
            { table: 'stableswap_asset_historical_data', column: 'block_id' },
            { table: 'stableswap_asset_volume_historical_data', column: 'block_id' },
            { table: 'stableswap_volume_historical_data', column: 'block_id' },
          ],
        },
        {
          category: 'Money Market Tables',
          tables: [
            { table: 'hsmpool_historical_data', column: 'block_id' },
            { table: 'hsmpool_asset_historical_data', column: 'block_id' },
            { table: 'hsm_collateral_config_historical_data', column: 'block_id' },
            { table: 'mm_reserve_config_historical_data', column: 'block_id' },
            { table: 'mm_reserve_indexes_historical_data', column: 'block_id' },
            { table: 'aavepool_historical_data', column: 'block_id' },
            { table: 'aave_facilitator_historical_data', column: 'block_id' },
          ],
        },
        {
          category: 'Other Tables',
          tables: [
            { table: 'constants_historical_data', column: 'block_id' },
            { table: 'ema_oracle_entry_historical_data', column: 'block_id' },
            { table: 'otc_order', column: 'created_at_block_id' },
            { table: 'routed_trade', column: 'block_id' },
          ],
        },
      ];

      let totalNulls = 0;
      let totalTables = 0;
      let tablesWithNulls = 0;

      for (const group of tableGroups) {
        console.log(`\n📊 ${group.category}`);
        console.log('-'.repeat(80));

        for (const { table, column } of group.tables) {
          totalTables++;

          const result = await dataSource.query(`
            SELECT
              COUNT(*) as total,
              COUNT(${column}) as filled,
              COUNT(*) - COUNT(${column}) as nulls
            FROM ${table}
          `);

          const { total, filled, nulls } = result[0];
          const nullCount = parseInt(nulls);
          totalNulls += nullCount;

          if (nullCount > 0) {
            tablesWithNulls++;
          }

          const status = nullCount === 0 ? '✅' : '⚠️ ';
          console.log(`${status} ${table}.${column}`);
          console.log(`   Total: ${total} | Filled: ${filled} | NULL: ${nulls}`);
        }
      }

      console.log();
      console.log('='.repeat(80));
      console.log('📈 Summary Statistics');
      console.log('='.repeat(80));
      console.log(`Total tables verified: ${totalTables}`);
      console.log(`Tables with NULL values: ${tablesWithNulls}`);
      console.log(`Total NULL values found: ${totalNulls}`);

      console.log();

      if (totalNulls > 0) {
        console.log('⚠️  Warning: Some records still have NULL block_id values.');
        console.log('   This usually means those records have para_block_height values');
        console.log('   that do not exist in the block table.');
        console.log();
        console.log('   To investigate, run:');
        console.log('   SELECT DISTINCT para_block_height FROM <table>');
        console.log('   WHERE block_id IS NULL;');
      } else {
        console.log('✅ All block_id columns successfully populated!');
      }
    }

    console.log();
    console.log('='.repeat(80));
    console.log('✅ Script completed');
    console.log('='.repeat(80));

  } catch (error) {
    console.error();
    console.error('❌ Error occurred:');
    console.error(error);
    console.error();
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('📡 Database connection closed');
    }
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
