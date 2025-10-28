import { CommonPgClient } from './pgClient';
import type { RunMigration } from 'node-pg-migrate/dist/migration';
import { getEnvPath } from '../helpers';
import { AppConfig } from '../../appConfig';

const migrations = require('node-pg-migrate');

export class DbMigrationsManager extends CommonPgClient {
  private readonly migrationsPath: string;
  private readonly migrationsTable: string;

  constructor({
    migrationsPath,
    migrationsTable = 'node_pg_migrations',
  }: {
    migrationsPath: string;
    migrationsTable?: string;
  }) {
    super();
    this.migrationsPath = migrationsPath;
    this.migrationsTable = migrationsTable;
  }

  async runMigrations() {
    const appConfig = AppConfig.getInstance();

    await this.connectWithRetry();

    const runWithRetries = async (
      max = 10,
      baseDelayMs = 10000,
      maxDelayMs = 60000
    ): Promise<void> => {
      let attempt = 0;

      while (true) {
        try {
          const migrationsResult: RunMigration[] = await migrations.runner({
            migrationsSchema: appConfig.STATE_SCHEMA_NAME,
            migrationsTable: this.migrationsTable,
            schema: 'public',
            dbClient: this.pgClient,
            // dir: getEnvPath('apiSupport/apiMigrations/migrations'),
            dir: getEnvPath(this.migrationsPath),
            direction: 'up',
            count: 10000,
          });
          if (migrationsResult && migrationsResult.length > 0) {
            console.log(`DB migrations have been successfully executed.`);
          } else {
            console.log(`There are no pending DB migrations.`);
          }
          await this.pgClient.end();
          return;
        } catch (err: any) {
          if (attempt >= max) {
            console.error('Error executing migrations:', err);

            try {
              await this.pgClient.end();
            } catch (closeErr) {
              console.error('Error closing database connection:', closeErr);
            }

            // Provide specific messaging for lock conflicts
            if (err.message?.includes('already running at lock')) {
              console.log(
                'Another instance is running migrations. ' +
                  'This instance will crash and restart to retry after the lock is released.'
              );
            }

            // Throw error to crash the app and trigger restart
            throw err;
          }

          attempt++;
          console.log(
            `Run DB migration retry #${attempt}... Error: ${err.message}`
          );

          const delay = Math.min(
            baseDelayMs * 2 ** attempt +
              Math.floor(Math.random() * baseDelayMs),
            maxDelayMs
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };

    await runWithRetries();
  }
}
