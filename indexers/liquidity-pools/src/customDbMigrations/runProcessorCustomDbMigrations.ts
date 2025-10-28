import { DbMigrationsManager } from '../utils/pgConnectionManagers/dbMigrationsManager';

export async function runProcessorCustomDbMigrations() {
  await new DbMigrationsManager({
    migrationsPath: 'customDbMigrations/migrations',
  }).runMigrations();
}
