import type { RunMigration } from 'node-pg-migrate/dist/migration';

const migrations = require('node-pg-migrate');

import { AppConfig } from '../../appConfig';
import { Client } from 'pg';
import { getEnvPath } from '../../utils/helpers';

export async function runMigrations() {
  const appConfig = AppConfig.getInstance();
  const pgClient = new Client({
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    database: appConfig.DB_NAME,
    user: appConfig.DB_USER,
    password: appConfig.DB_PASS,
  });

  await pgClient.connect();

  try {
    const migrationsResult: RunMigration[] = await migrations.runner({
      migrationsSchema: 'squid_processor',
      migrationsTable: 'node_pg_migrations',
      schema: 'public',
      dbClient: pgClient,
      dir: getEnvPath('apiSupport/apiMigrations/migrations'),
      direction: 'up',
      count: 10000,
    });
    if (migrationsResult && migrationsResult.length > 0) {
      console.log(`API DB migrations have been successfully executed.`);
    } else {
      console.log(`There are no pending API DB migrations.`);
    }
  } catch (err) {
    console.error('Error executing migrations:', err);
  }
}
