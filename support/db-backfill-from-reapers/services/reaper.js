/**
 * Reaper processing service
 */
const { Pool } = require('pg');
const { log } = require('../utils/logger');
const { saveProgress } = require('../utils/progress');
const globalProgress = require('../utils/globalProgress');
const reportTracker = require('../utils/reportTracker');
const {
  getTables,
  getTableDependencies,
  sortTablesByDependencies,
  groupTablesIntoWaves,
} = require('../database/schema');
const config = require('../config');

// Use COPY-based migration if enabled, otherwise use INSERT-based
const { migrateTable } = config.USE_COPY_MODE
  ? require('../database/migration-copy')
  : require('../database/migration');

/**
 * Process a wave of tables in parallel with concurrency limit
 * @param {Object} harvesterClient - Harvester database client
 * @param {Object} reaperPool - Reaper database connection pool
 * @param {Array<string>} tables - Array of table names to process
 * @param {number} reaperIndex - Index of current reaper
 * @param {Object} progress - Progress tracking object
 */
async function processWaveInParallel(
  harvesterClient,
  reaperPool,
  tables,
  reaperIndex,
  progress
) {
  const maxConcurrency = config.MAX_PARALLEL_TABLES;
  const results = [];
  const errors = [];

  // Process tables in batches of MAX_PARALLEL_TABLES
  for (let i = 0; i < tables.length; i += maxConcurrency) {
    const batch = tables.slice(i, Math.min(i + maxConcurrency, tables.length));

    log(
      `  Processing ${batch.length} tables in parallel: ${batch.join(', ')}`
    );

    // Create promises for all tables in this batch
    const promises = batch.map(async (table) => {
      // Each table gets its own connection from the pool for parallel processing
      const reaperClient = await reaperPool.connect();
      try {
        globalProgress.startTable(table);
        await migrateTable(
          harvesterClient,
          reaperClient,
          table,
          reaperIndex,
          progress
        );
        globalProgress.completeTable();
        return { table, success: true };
      } catch (error) {
        globalProgress.completeTable();
        log(`  Error migrating table ${table}: ${error.message}`, 'ERROR');
        return { table, success: false, error: error.message };
      } finally {
        // Release connection back to pool
        reaperClient.release();
      }
    });

    // Wait for all tables in this batch to complete
    const batchResults = await Promise.all(promises);

    // Collect results
    batchResults.forEach((result) => {
      if (result.success) {
        results.push(result.table);
      } else {
        errors.push(result);
      }
    });

    log(`  Completed batch: ${batch.length} tables processed`);
  }

  // Report any errors
  if (errors.length > 0) {
    log(
      `  Warning: ${errors.length} tables failed to migrate in this wave`,
      'WARN'
    );
    errors.forEach((err) => {
      log(`    - ${err.table}: ${err.error}`, 'WARN');
    });
  }

  log(`  Wave complete: ${results.length}/${tables.length} tables migrated`);
}

/**
 * Process a single reaper - migrate all its tables to harvester
 * @param {Object} harvesterClient - Harvester database client
 * @param {Object} reaper - Reaper configuration object
 * @param {Object} progress - Progress tracking object
 */
async function processReaper(harvesterClient, reaper, progress) {
  log(`\nProcessing Reaper #${reaper.index}`);
  log(`Block range: ${reaper.startBlockHeight} - ${reaper.endBlockHeight}`);

  if (!reaper.dbConnectionUrl) {
    log(
      `No DB connection URL provided for reaper #${reaper.index}, skipping`,
      'WARN'
    );
    return;
  }

  // Check if reaper is already completed
  if (progress.completedReapers.includes(reaper.index)) {
    log(`Reaper #${reaper.index} already completed, skipping`);
    return;
  }

  const reaperPool = new Pool({ connectionString: reaper.dbConnectionUrl });

  try {
    // Get a temporary client for schema discovery
    const reaperClient = await reaperPool.connect();

    try {
      // Update current reaper in progress
      progress.currentReaper = reaper.index;
      await saveProgress(progress);

      // Start tracking this reaper
      reportTracker.startReaper(reaper.index);

      // Optionally disable foreign key checks
      if (config.DISABLE_FK_CHECKS) {
        log('Disabling foreign key checks for this session');
        await harvesterClient.query(
          "SET session_replication_role = 'replica';"
        );
      }

      // Get all tables
      const tables = await getTables(reaperClient);
      log(`Found ${tables.length} tables to migrate`);

      // Get foreign key dependencies
      const dependencies = await getTableDependencies(reaperClient);

      // Group tables into dependency waves for parallel processing
      const waves = groupTablesIntoWaves(tables, dependencies);
      log(
        `Tables grouped into ${waves.length} dependency waves for parallel processing`
      );

      // Log wave details
      waves.forEach((wave, index) => {
        log(`  Wave ${index}: ${wave.length} tables - ${wave.join(', ')}`);
      });

      // Update global progress tracker
      globalProgress.startReaper(reaper.index, tables.length);

      // Release the schema discovery client
      reaperClient.release();

      // Process each wave
      for (let waveIndex = 0; waveIndex < waves.length; waveIndex++) {
        const wave = waves[waveIndex];
        log(
          `\nProcessing Wave ${waveIndex + 1}/${waves.length} (${wave.length} tables)`
        );

        // Process tables in current wave in parallel (pass pool, not client)
        await processWaveInParallel(
          harvesterClient,
          reaperPool,
          wave,
          reaper.index,
          progress
        );

        log(`Completed Wave ${waveIndex + 1}/${waves.length}`);
      }

      // Re-enable foreign key checks if they were disabled
      if (config.DISABLE_FK_CHECKS) {
        log('Re-enabling foreign key checks');
        await harvesterClient.query("SET session_replication_role = 'origin';");
      }

      // End tracking this reaper
      reportTracker.endReaper(reaper.index);

      // Mark reaper as completed
      progress.completedReapers.push(reaper.index);
      progress.currentReaper = null;
      await saveProgress(progress);
      globalProgress.completeReaper();

      log(`Completed processing Reaper #${reaper.index}`);
    } catch (error) {
      // Make sure to release client on error
      try {
        reaperClient.release();
      } catch (releaseError) {
        // Client already released or errored
      }
      throw error;
    }
  } catch (error) {
    log(`Error processing Reaper #${reaper.index}: ${error.message}`, 'ERROR');
    reportTracker.recordError(`Reaper #${reaper.index}`, error.message);
    throw error;
  } finally {
    await reaperPool.end();
  }
}

module.exports = {
  processReaper,
};
