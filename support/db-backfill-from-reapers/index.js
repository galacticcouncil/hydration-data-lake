/**
 * DB Backfill from Reapers
 * Main application entry point
 */
const { Pool } = require('pg');
const fs = require('fs').promises;
const config = require('./config');
const { log } = require('./utils/logger');
const { loadProgress, saveProgress, clearProgress } = require('./utils/progress');
const { processReaper } = require('./services/reaper');
const globalProgress = require('./utils/globalProgress');

/**
 * Main application function
 */
async function main() {
  try {
    log('=== DB Backfill from Reapers - Starting ===');
    log(`Schema: ${config.SCHEMA_NAME}`);
    log(`Batch size: ${config.BATCH_SIZE}, Bulk insert size: ${config.BULK_INSERT_SIZE}`);

    // Validate environment
    if (!config.HARVESTER_DB_URL) {
      throw new Error('HARVESTER_DB_URL environment variable is required');
    }

    // Load or initialize progress
    let progress;
    if (config.RESUME_MIGRATION) {
      log('Resume mode enabled - loading progress...');
      progress = await loadProgress();
      if (
        progress.completedReapers.length > 0 ||
        Object.keys(progress.completedTables).length > 0
      ) {
        log(`Resuming from previous run:`);
        log(`  - Completed reapers: [${progress.completedReapers.join(', ')}]`);
        log(`  - Current reaper: ${progress.currentReaper || 'none'}`);
        log(
          `  - Tables in progress: ${Object.keys(progress.completedTables).length}`
        );
        // Log first few tables for debugging
        const tableKeys = Object.keys(progress.completedTables).slice(0, 5);
        tableKeys.forEach((key) => {
          log(`    - ${key}: ${progress.completedTables[key]} rows processed`);
        });
        if (Object.keys(progress.completedTables).length > 5) {
          log(
            `    ... and ${Object.keys(progress.completedTables).length - 5} more tables`
          );
        }
      } else {
        log('No previous progress found, starting fresh');
      }
    } else {
      log('⚠️  Starting fresh migration (RESUME_MIGRATION not set to true)');
      log('⚠️  Any existing progress will be deleted');
      progress = {
        completedReapers: [],
        currentReaper: null,
        completedTables: {},
      };
      await clearProgress();
    }

    // Load reapers list
    let reapers;
    if (config.REAPERS_LIST_JSON) {
      log('Loading reapers list from environment variable REAPERS_LIST_JSON');
      reapers = JSON.parse(config.REAPERS_LIST_JSON);
    } else {
      log(`Loading reapers list from file: ${config.REAPERS_LIST_FILE}`);
      const reapersData = await fs.readFile(config.REAPERS_LIST_FILE, 'utf-8');
      reapers = JSON.parse(reapersData);
    }

    if (!reapers) throw new Error('No reapers found in list');

    // Sort reapers by index in ascending order
    reapers.sort((a, b) => a.index - b.index);
    log(`Loaded ${reapers.length} reapers`);

    // Initialize global progress tracker
    globalProgress.setTotalReapers(reapers.length);

    // Connect to harvester DB
    log('Connecting to Harvester DB...');
    const harvesterPool = new Pool({ connectionString: config.HARVESTER_DB_URL });
    const harvesterClient = await harvesterPool.connect();

    try {
      // Process each reaper sequentially
      for (const reaper of reapers) {
        await processReaper(harvesterClient, reaper, progress);
      }

      // Show final summary
      log('\n=== DB Backfill from Reapers - Completed Successfully ===');
      globalProgress.forceLogProgress();

      // Clear progress on successful completion
      await clearProgress();
      log('Migration progress cleared');
    } finally {
      harvesterClient.release();
      await harvesterPool.end();
    }
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'ERROR');
    log(error.stack, 'ERROR');
    log(
      '\nProgress has been saved. You can resume the migration by setting RESUME_MIGRATION=true',
      'INFO'
    );
    process.exit(1);
  }
}

// Run the application
main();
