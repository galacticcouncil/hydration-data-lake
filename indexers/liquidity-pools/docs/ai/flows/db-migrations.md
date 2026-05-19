---
name: DB migrations — native SQD vs custom
description: Two parallel migration tracks in this project. Native SQD migrations are auto-generated from entities and must not contain edits for non-entity objects; custom indexes, computed columns, views, and triggers belong in the custom migration folders.
audience: ai-agent, human
related:
  - ../architecture/transactions.md
  - ../architecture/reorg-handling.md
  - ../runbooks/reset-local-db.md
  - ../runbooks/local-development.md
---

# DB migrations

## When to read this

- Adding a new entity to `schema.graphql` and about to run `sqd migration:create`.
- Adding an index, computed column, view, trigger, or any other DB object that is **not** declared on a TypeORM entity.
- A generated migration unexpectedly contains `DROP INDEX` / `DROP VIEW` / `DROP COLUMN` for objects you didn't remove.
- Processor app hung silently on startup with no log line after "starting migrations".
- Touching `src/utils/pgConnectionManagers/dbMigrationsManager.ts`, `src/customDbMigrations/`, `src/apiSupport/apiMigrations/`, or the contents of `scripts/safe-migration-create.js`.
- Running `sqd migration:create` and confused about which folder a migration should land in.

## Concepts

This project runs **two parallel migration tracks** against the same Postgres database.

### Track 1 — Native SQD (TypeORM) migrations

| Property | Value |
|---|---|
| Folder | `db/migrations/` |
| Runner | `squid-typeorm-migration apply`, executed by SQD framework on every processor startup automatically. Cannot be moved or disabled. |
| Generator | `squid-typeorm-migration generate` — diffs entity metadata against the connected DB schema and emits a `.js` migration with `up` / `down` methods. |
| Tracking table | `migrations` (in `public`). |
| Scope | Anything that can be derived from `schema.graphql` / TypeORM entities — table creates, column changes, FK constraints, indexes declared with `@Index` on entities. |
| Wrapping | Each migration runs in its own transaction. |

The generator's contract: **DB schema must match entity metadata exactly**. Any object in the DB that the generator doesn't see in entity metadata looks like drift and will appear as `DROP ...` in the next generated migration. This is the root cause of every "generated migration dropped my custom indexes" incident.

### Track 2 — Custom migrations (out-of-scope DB objects)

Two folders, two runners, identical mechanics:

| Folder | Runner entry point | Triggered by |
|---|---|---|
| `src/customDbMigrations/migrations/` | `runProcessorCustomDbMigrations()` in `src/customDbMigrations/runProcessorCustomDbMigrations.ts` | First batch of the processor app (`src/main.ts:77`). |
| `src/apiSupport/apiMigrations/migrations/` | `runApiDbMigrations()` in `src/apiSupport/apiMigrations/runApiDbMigrations.ts` | API process startup. |

Both folders are processed by `DbMigrationsManager` (`src/utils/pgConnectionManagers/dbMigrationsManager.ts`), a thin wrapper around `node-pg-migrate`:

- Each migration is a plain `.sql` file. Naming convention: `<timestamp>_<snake_case_description>.sql`.
- Each file runs inside a single transaction (so `CREATE INDEX CONCURRENTLY` and similar non-transactional DDL **cannot** be used here).
- Tracking table: `node_pg_migrations` (in the `STATE_SCHEMA_NAME` schema).
- A `lock_timeout` (`DB_CUSTOM_MIGRATIONS_LOCK_TIMEOUT`, default `30s`) is set on the migration connection before any file runs — see Gotchas.

| Scope | Examples |
|---|---|
| Indexes that can't be expressed on a TypeORM entity | Partial indexes with `WHERE` clauses, `INCLUDE` (covering) columns, GIN indexes with custom operator classes, expression indexes. |
| Computed columns / generated columns | `1766770613441_computed_columns_routed_swap.sql`, `1772648201025_computed_columns_dca_last_updated_at.sql`. |
| API decoration views | `1738150732320_swap_api_decoration.sql`, `1738263936764_routed_trade_api_decoration.sql`. |
| LISTEN/NOTIFY triggers used by PostGraphile subscriptions | `1728904459991_subscriptions-init.sql`, `1729609934062_pools-subscriptions.sql`. |
| API support helpers | `1751591893382_api_support.sql`, `1751591893383_api_support_add_balances.sql`. |

### Why the split exists

If you put a `CREATE INDEX ON account_asset_balance_historical_data ...` into a native SQD migration, the next `sqd migration:create` will emit a `DROP INDEX` for it, because the generator doesn't see that index on the entity. That has destroyed custom indexes in prod before. The split exists so the generator never sees objects in track 2.

## The safe migration generator (`sqd migration:create`)

`sqd migration:create` runs `scripts/safe-migration-create.js`, not the raw generator. The script spins up a throwaway `postgres:15` Docker container on a random port, applies only `db/migrations/` to it, then invokes `squid-typeorm-migration generate` against that **shadow DB**. Because the shadow DB never has any custom-migration objects, the generated diff is provably free of spurious drops for them.

After generation, the script scans the new migration file for any `DROP INDEX|TABLE|VIEW|COLUMN|FUNCTION|TRIGGER|MATERIALIZED VIEW|SCHEMA|CONSTRAINT` statements and prints a warning. Since the shadow DB starts clean, every DROP corresponds to a real entity-side removal — review each one before committing.

The old behavior (generate against the live local DB) is preserved as `sqd migration:create:unsafe`. Use it only when you specifically want to diff against the live DB and understand the risk.

| Command | Behavior |
|---|---|
| `sqd migration:create` | Shadow DB. Safe. Default. |
| `sqd migration:create:unsafe` | Direct generate against the connected DB. Will drop any object the entities don't declare. Avoid. |
| `sqd migration:apply` | Apply pending `db/migrations/` (always against the connected DB). |

Requires Docker daemon running locally. Already required for `sqd up`, so no new prerequisite.

## Backfill migrations

`db/backfillMigrations/` exists as a parking lot for one-off backfill migrations that have already been applied to all deployed environments and are no longer relevant for fresh databases. Files moved there are not auto-run by anything. The folder exists purely for historical reference — git already preserves them, but keeping them visible in the tree makes their content discoverable when investigating prod schema drift.

If you find a `.js` backfill migration in `db/migrations/` that:

- Was already applied everywhere it needs to be,
- Is idempotent (or its effect is captured by a later migration),
- Only runs once and is dead code from now on,

…then moving it to `db/backfillMigrations/` is correct. Don't delete it — future investigations may need to know what data manipulation has happened.

## Code map

- `src/main.ts:77` — `runProcessorCustomDbMigrations()` call site inside the first batch of `processor.run`'s handler.
- `src/customDbMigrations/runProcessorCustomDbMigrations.ts` — wrapper that instantiates `DbMigrationsManager` for the processor track.
- `src/customDbMigrations/migrations/` — processor-side custom migrations.
- `src/apiSupport/apiMigrations/runApiDbMigrations.ts` — same pattern for the API process.
- `src/apiSupport/apiMigrations/migrations/` — API-side custom migrations.
- `src/utils/pgConnectionManagers/dbMigrationsManager.ts` — runs `node-pg-migrate` against a dedicated connection, sets `lock_timeout`, retries on failure with exponential backoff up to `DB_CUSTOM_MIGRATIONS_MAX_RETRY` attempts.
- `src/utils/pgConnectionManagers/pgClient.ts` — `CommonPgClient` (per-call client used by `DbMigrationsManager`).
- `scripts/safe-migration-create.js` — shadow-DB wrapper around `squid-typeorm-migration generate`.
- `commands.json` — `migration:create`, `migration:create:unsafe`, `migration:apply` entries.
- `db/migrations/` — native SQD migrations.
- `db/backfillMigrations/` — archived one-off backfill migrations.
- `src/appConfig.ts` — `DB_CUSTOM_MIGRATIONS_MAX_RETRY`, `DB_CUSTOM_MIGRATIONS_BASE_DELAY_MS`, `DB_CUSTOM_MIGRATIONS_MAX_DELAY_MS`, `DB_CUSTOM_MIGRATIONS_LOCK_TIMEOUT`.

## Configuration

| Env var | Default | Effect |
|---|---|---|
| `DB_CUSTOM_MIGRATIONS_MAX_RETRY` | `50` | How many times `DbMigrationsManager` retries on a failed `node-pg-migrate` run before giving up and crashing the process. |
| `DB_CUSTOM_MIGRATIONS_BASE_DELAY_MS` | `10000` | Initial backoff delay; doubles per retry, jittered. |
| `DB_CUSTOM_MIGRATIONS_MAX_DELAY_MS` | `60000` | Backoff ceiling. |
| `DB_CUSTOM_MIGRATIONS_LOCK_TIMEOUT` | `'30s'` | Postgres `lock_timeout` set on the migration connection. Caps the time a single statement waits to acquire a lock. **Does NOT cap the statement's runtime once the lock is acquired** — long-running `CREATE INDEX` and backfills are unaffected. |

## Gotchas

- **`sqd migration:create:unsafe` will drop custom-migration objects.** The unsafe command runs the generator against the live local DB. Every object created by `src/customDbMigrations/` and `src/apiSupport/apiMigrations/` is invisible to entity metadata, so each one shows up as a `DROP`. If such a migration is committed and applied to prod, production indexes / views / triggers disappear. Always use `sqd migration:create` unless you have a specific reason not to.
- **The shadow-DB script still emits real `DROP` statements for legitimate entity removals.** If you deleted a `@Column` / `@Entity` / `@Index` in `schema.graphql`, the next safe migration will (correctly) drop it. The warning printed by the script is a sanity check, not a guarantee of cleanliness.
- **Custom migration runner runs INSIDE the first batch of `processor.run`** (`src/main.ts:77`). SQD has already opened a transaction for hot-block rollback by this point. If a custom migration takes a heavyweight table lock on an entity table (`CREATE INDEX`, `ALTER TABLE`, `DROP INDEX`), it will block waiting for SQD's transaction to commit — but SQD's transaction can't commit until the batch handler (which is awaiting the migration) returns. Postgres cannot auto-detect this cycle. Without `lock_timeout`, the process hangs silently with no error. `DB_CUSTOM_MIGRATIONS_LOCK_TIMEOUT` (default `30s`) turns the hang into a `canceling statement due to lock timeout` error, which feeds into the retry loop. Retries usually exhaust within ~1 minute, the process crashes, and the orchestrator restarts it. On retry, hot-block rollback is usually already complete and the migration succeeds.
- **`CREATE INDEX CONCURRENTLY` cannot be used in `.sql` custom migrations.** `node-pg-migrate` wraps each `.sql` file in a transaction, and `CONCURRENTLY` cannot run inside a transaction. Use the plain `CREATE INDEX IF NOT EXISTS` form. On fresh DBs this is fine. On existing production DBs the indexes already exist from earlier runs, so the `IF NOT EXISTS` guards make subsequent runs no-ops.
- **`node-pg-migrate` tracks by filename.** If you rename a migration file (e.g. moving an index from `db/migrations/` into `src/customDbMigrations/migrations/` with a different name), it will be re-executed once on every existing DB even though the original migration ran. Use `IF NOT EXISTS` / `IF EXISTS` guards on every DDL statement in custom migrations so re-runs are idempotent.
- **The `migrations` table (native SQD) and `node_pg_migrations` table (custom) are independent.** Removing a row from one has no effect on the other. If you need to "un-record" a migration, target the right table.
- **`IS_CUSTOM_DB_MIGRATIONS_RUNNER` env flag elects a single processor instance to run custom migrations** when the indexer is launched in multiprocessor mode. The flag is checked in `src/main.ts:64`. If unset across all instances, no custom migrations run. If set on multiple instances, they race; `DbMigrationsManager`'s retry loop handles the resulting "already running at lock" errors, but it costs time.
- **The processor-side and API-side custom migration folders share the same `node_pg_migrations` table** (same `STATE_SCHEMA_NAME`). Don't put the same timestamp on a processor-side file and an API-side file — they'll collide on the `name` column.
- **Always test custom migrations on a fresh local DB before merging.** Existing prod DBs already have whatever objects you're "creating", so `IF NOT EXISTS` will mask bugs. A fresh DB will exercise the actual `CREATE` path.

## Examples

### Adding a new entity

1. Edit `schema.graphql`.
2. `sqd codegen` — regenerates TypeORM models.
3. `sqd build`.
4. `sqd up` — ensure local DB is running.
5. `sqd migration:apply` — apply existing migrations to the local DB so the baseline is in sync.
6. `sqd migration:create` — runs the shadow-DB workflow, generates a new migration in `db/migrations/`.
7. Inspect the generated file. The warning block at the end of the script's output lists any `DROP` statements — verify each one is intentional (e.g. you really did delete that `@Column`).
8. `sqd migration:apply` once more to apply the new migration locally.
9. Commit the new migration file alongside the `schema.graphql` change.

### Adding a custom index on an entity table

The index can't go in `schema.graphql` (the `@Index` directive doesn't support `WHERE` / `INCLUDE` / GIN ops). It must live in `src/customDbMigrations/migrations/`.

1. Pick a unique timestamp prefix (current epoch ms is fine).
2. Create `src/customDbMigrations/migrations/<timestamp>_<descriptive_name>.sql`.
3. Use `CREATE INDEX IF NOT EXISTS "..." ON "..." (...)`. Plain `CREATE INDEX` only — no `CONCURRENTLY`.
4. On next processor startup, the migration runs automatically. Verify in logs: "DB migrations have been successfully executed."
5. Verify in Postgres: `\d+ <table>` shows the new index.
6. Run `sqd migration:create` once more to confirm the generator does NOT include a `DROP INDEX` for your new index. (If it does, you put the index in the wrong place or the generator's shadow-DB scan is misbehaving.)

### Adding a computed column / view / trigger

Same as the index case — file in `src/customDbMigrations/migrations/` (or `src/apiSupport/apiMigrations/migrations/` if it's API-only support like a PostGraphile subscription trigger).

### Diagnosing a stuck processor on startup

1. Check logs for "starting migrations" or `[PostgreSQL :: CommonPgClient] connection established successfully` — if you see those but nothing after, the migration is blocked.
2. From a SQL client, run:
   ```sql
   SELECT pid, state, wait_event_type, wait_event, query
   FROM pg_stat_activity
   WHERE state != 'idle'
   ORDER BY query_start;
   ```
   Look for two sessions: one running `CREATE INDEX` / `ALTER TABLE` from your migration, one running SQD's hot-block rollback (typically `DELETE` / `UPDATE` / `INSERT` on hot-block-affected tables). If the migration session shows `wait_event_type = Lock`, this is the deadlock described in Gotchas.
3. Wait up to ~30 seconds — `lock_timeout` should fire and the migration session will error out, freeing SQD. The retry loop will retry the migration. By the second attempt, hot-block rollback usually completed and the migration succeeds.
4. If the migration keeps failing past `DB_CUSTOM_MIGRATIONS_MAX_RETRY` (50) attempts, the process crashes. The container orchestrator restarts it. On clean restart there's no hot-block rollback, so the migration runs unimpeded.

If the deadlock recurs frequently in production, the structural fix is to run custom migrations before `processor.run()` instead of inside the batch handler. See `src/main.ts:77`.