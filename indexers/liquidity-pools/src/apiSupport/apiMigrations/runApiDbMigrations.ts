import { DbMigrationsManager } from '../../utils/pgConnectionManagers/dbMigrationsManager';

export async function runApiDbMigrations() {
  await new DbMigrationsManager({
    migrationsPath: 'apiSupport/apiMigrations/migrations',
  }).runMigrations();
}
