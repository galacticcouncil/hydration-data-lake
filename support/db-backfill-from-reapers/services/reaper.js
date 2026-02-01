/**
 * Reaper processing service
 */
const { Pool } = require('pg');
const { log } = require('../utils/logger');
const { saveProgress } = require('../utils/progress');
const globalProgress = require('../utils/globalProgress');
const {
  getTables,
  getTableDependencies,
  sortTablesByDependencies,
} = require('../database/schema');
const { migrateTable } = require('../database/migration');
const config = require('../config');

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
    const reaperClient = await reaperPool.connect();

    try {
      // Update current reaper in progress
      progress.currentReaper = reaper.index;
      await saveProgress(progress);

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

      // Sort tables by dependencies (parent tables first)
      const sortedTables = sortTablesByDependencies(tables, dependencies);
      log(`Tables sorted by dependencies`);

      // Update global progress tracker
      globalProgress.startReaper(reaper.index, sortedTables.length);

      // Migrate each table sequentially
      for (const table of sortedTables) {
        globalProgress.startTable(table);
        await migrateTable(
          harvesterClient,
          reaperClient,
          table,
          reaper.index,
          progress
        );
        globalProgress.completeTable();
      }

      // Re-enable foreign key checks if they were disabled
      if (config.DISABLE_FK_CHECKS) {
        log('Re-enabling foreign key checks');
        await harvesterClient.query("SET session_replication_role = 'origin';");
      }

      // Mark reaper as completed
      progress.completedReapers.push(reaper.index);
      progress.currentReaper = null;
      await saveProgress(progress);
      globalProgress.completeReaper();

      log(`Completed processing Reaper #${reaper.index}`);
    } finally {
      reaperClient.release();
    }
  } catch (error) {
    log(`Error processing Reaper #${reaper.index}: ${error.message}`, 'ERROR');
    throw error;
  } finally {
    await reaperPool.end();
  }
}

module.exports = {
  processReaper,
};
