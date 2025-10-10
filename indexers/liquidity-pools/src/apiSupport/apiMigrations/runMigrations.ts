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

  const connectWithRetry = async (
    max = 5,
    baseDelayMs = 1000,
    maxDelayMs = 10000
  ): Promise<void> => {
    let attempt = 0;

    while (true) {
      try {
        await pgClient.connect();
        console.log(
          '[PostgreSQL :: Migrations] connection established successfully'
        );
        return;
      } catch (e: any) {
        if (attempt >= max) {
          console.error(
            `Failed to connect to [PostgreSQL :: Migrations] after ${max} attempts:`,
            e
          );
          throw e;
        }

        attempt++;
        console.log(
          `[PostgreSQL :: Migrations] DB connection retry #${attempt}... Error: ${e.message}`
        );

        const delay = Math.min(
          baseDelayMs * 2 ** attempt + Math.floor(Math.random() * baseDelayMs),
          maxDelayMs
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  await connectWithRetry();

  try {
    const migrationsResult: RunMigration[] = await migrations.runner({
      migrationsSchema: appConfig.STATE_SCHEMA_NAME,
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
    await pgClient.end();
  } catch (err: any) {
    console.error('Error executing migrations:', err);

    try {
      await pgClient.end();
    } catch (closeErr) {
      console.error('Error closing database connection:', closeErr);
    }

    // Provide specific messaging for lock conflicts
    if (err.message?.includes('already running at lock')) {
      console.log(
        '[PostgreSQL :: Migrations] Another instance is running migrations. ' +
          'This instance will crash and restart to retry after the lock is released.'
      );
    }

    // Throw error to crash the app and trigger restart
    throw err;
  }
}
