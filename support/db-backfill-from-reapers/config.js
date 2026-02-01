/**
 * Application configuration from environment variables
 */
module.exports = {
  // Database
  HARVESTER_DB_URL:
    process.env.HARVESTER_DB_URL ||
    'postgresql://postgres:postgres@localhost:23798/liquidity_pools_db',
  SCHEMA_NAME: process.env.SCHEMA_NAME || 'public',

  // Reapers configuration
  REAPERS_LIST_JSON: process.env.REAPERS_LIST_JSON,
  REAPERS_LIST_FILE: process.env.REAPERS_LIST_FILE || './reapers-list.json',

  // Migration settings
  DISABLE_FK_CHECKS: process.env.DISABLE_FK_CHECKS === 'true',
  BATCH_SIZE: parseInt(process.env.BATCH_SIZE || '10000'), // Increased for better performance
  BULK_INSERT_SIZE: parseInt(process.env.BULK_INSERT_SIZE || '2000'), // Increased for better performance
  MAX_PARALLEL_TABLES: parseInt(process.env.MAX_PARALLEL_TABLES || '5'), // Number of tables to migrate concurrently

  // Progress tracking
  PROGRESS_FILE: process.env.PROGRESS_FILE || './migration-progress.json',
  RESUME_MIGRATION: process.env.RESUME_MIGRATION === 'true',
};
