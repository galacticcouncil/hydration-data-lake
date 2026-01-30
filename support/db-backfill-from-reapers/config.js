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
  BATCH_SIZE: parseInt(process.env.BATCH_SIZE || '5000'),
  BULK_INSERT_SIZE: parseInt(process.env.BULK_INSERT_SIZE || '500'),

  // Progress tracking
  PROGRESS_FILE: process.env.PROGRESS_FILE || './migration-progress.json',
  RESUME_MIGRATION: process.env.RESUME_MIGRATION === 'true',
};
