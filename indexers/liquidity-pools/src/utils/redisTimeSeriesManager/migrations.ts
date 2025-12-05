import { TimeSeriesMigration } from './migrationsManager';

/**
 * Define your time series migrations here.
 * Each migration must have a unique ID (timestamp), an action, and required parameters.
 *
 * Example:
 * {
 *   id: '1733143200000',
 *   action: 'CLEAR_BY_INDEXER_ID',
 *   keyPrefix: 'old-indexer-v1',
 *   description: 'Clear time series data from old indexer version'
 * }
 */
const timeSeriesMigrations: TimeSeriesMigration[] = [
  // Add your migrations here
  // Example migration to clear time series by indexer ID:
  // {
  //   id: '1764788239094',
  //   action: 'CLEAR_BY_INDEXER_ID',
  //   keyPrefix: '741:acc_bal_tot_tns',
  //   description:
  //     'Clear time series data from old indexer version (acc_bal_tot_tns)',
  // },
  // {
  //   id: '1764788239095',
  //   action: 'CLEAR_BY_INDEXER_ID',
  //   keyPrefix: '741:acc_bal_tot_loc',
  //   description:
  //     'Clear time series data from old indexer version (acc_bal_tot_tns)',
  // },
];

export default timeSeriesMigrations;
