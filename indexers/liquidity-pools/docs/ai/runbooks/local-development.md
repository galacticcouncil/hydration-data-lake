---
name: Local development flow
description: End-to-end local development workflow for this indexer — setting up the dev DB, running the processor and API, regenerating types and migrations, and common iteration loops.
audience: ai-agent, human
related:
  - ../flows/db-migrations.md
  - ./reset-local-db.md
---

# Local development flow

## When to read this

- First time setting up the project locally.
- Onboarding a new developer.
- Confused about which `sqd` command to run for a given change.
- Reference for the iteration loop when adding entities, handlers, indexes, or API support.

## Prerequisites

- **SQD CLI** — install globally: `npm i -g @subsquid/cli@latest`. Every command below is an `sqd` subcommand defined in `commands.json`.
- **Docker** daemon running — required for `sqd up` (local Postgres + Redis) and for the safe migration generator (`sqd migration:create` spins up a throwaway shadow Postgres container).
- **Node** `>=16` (see `package.json` `engines`).
- **Env file** — the processor and API load configuration via `--require=dotenv/config`. Provide a `.env` (or one of the per-network files such as `.env.hydration.local`, `.env.hydration-paseo-next.local`). Start from `.env.example`.

## Running locally (full flow)

The end-to-end sequence below comes from `commands.json` and is the canonical onboarding path. Run the steps in order the first time; on subsequent iterations you only re-run the steps whose inputs changed (see the iteration loops further down).

1. **Typegen** — `sqd typegen` reads `/typegenConfig/*` and emits TypeScript for events, calls, and storage.

   For chains **without** an SQD Archive (e.g. testnet), first generate a local metadata file and point the relevant typegen config's `specVersions` at it:

   ```bash
   npx squid-substrate-metadata-explorer --rpc wss://paseo-rpc.play.hydration.cloud --out ./typegenAssets/paseo-metadata.jsonl
   ```

   (The `sqd metadatagen-paseo` command wraps the equivalent invocation for the Paseo testnet.)

2. **Codegen** — `sqd codegen` regenerates TypeORM entities and enums from `schema.graphql`. **Only needed if `schema.graphql` changed.** Note: an enum must be referenced by an entity, otherwise it won't be emitted.

3. **Build** — `sqd build`. Required before generating migrations (the generator reads compiled entity metadata from `lib/`).

4. **Native migrations** — `sqd migration:create` generates a migration against an isolated shadow DB. See [DB migrations](#db-migrations) below and [`docs/ai/flows/db-migrations.md`](../flows/db-migrations.md) before running this — there are two parallel migration tracks and a destructive failure mode in the unsafe generator.

5. **Start infra** — `sqd up` boots the Docker containers: Postgres (port `23798`) and Redis (port `6379`). Tear down with `sqd down`.

6. **Run processor** — `sqd process` rebuilds, applies all native (`db/migrations/`) and custom processor migrations (`src/customDbMigrations/migrations/`), then starts the indexer. Use `sqd process:fast` to skip the rebuild + native-migration-apply step when you know the build and schema are already current.

7. **Run API** — `sqd api` starts the GraphQL + REST server (PostGraphile) and applies API-side custom migrations (`src/apiSupport/apiMigrations/migrations/`). Use `sqd api:fast` to skip the rebuild step.

### process vs process:fast / api vs api:fast

| Command | Rebuilds + applies migrations first | Use when |
|---|---|---|
| `sqd process` | Yes (`deps: build, migration:apply`) | After a code change, schema change, or new migration. |
| `sqd process:fast` | No | Tight iteration loops where `lib/` and the DB schema are already up to date. |
| `sqd api` | Rebuilds only (`deps: build`) | After a code change to the API process. |
| `sqd api:fast` | No | Tight iteration loops on an already-built API. |

## Restoring a local DB dump

To skip a full historical sync, restore a prepared dump from `db/dev/` instead of indexing from genesis. The `/reset-and-init-orca-local-alt` skill resets the local dev container and restores a dump — use it rather than restoring by hand.

## DB migrations

For everything related to creating, applying, and structuring DB migrations — both native SQD migrations and the custom-migration folders (`src/customDbMigrations/migrations/`, `src/apiSupport/apiMigrations/migrations/`) — see:

- [`docs/ai/flows/db-migrations.md`](../flows/db-migrations.md)

Quick summary so you don't take a wrong turn early in onboarding:

- **`sqd migration:create`** — safe. Generates against an isolated shadow DB. Preserves custom-migration objects.
- **`sqd migration:create:unsafe`** — legacy. Will drop indexes/views/triggers created by custom migrations. Avoid.
- Indexes/views/computed columns/triggers that can't be expressed on an entity belong in `src/customDbMigrations/migrations/` (processor) or `src/apiSupport/apiMigrations/migrations/` (API), **never** in `db/migrations/`.

## Iteration loops

Which steps to re-run depends on what you changed:

| You changed | Re-run |
|---|---|
| `schema.graphql` | `sqd codegen` → `sqd build` → `sqd migration:create` → `sqd migration:apply` → `sqd process` |
| A custom migration (`src/customDbMigrations/`, `src/apiSupport/apiMigrations/`) | `sqd process` / `sqd api` (custom migrations apply on startup) |
| Processor source (handlers, flows) | `sqd process` (or `sqd build` + `sqd process:fast`) |
| API source | `sqd api` (or `sqd build` + `sqd api:fast`) |
| Chain metadata / typegen config | `sqd typegen` → `sqd build` → `sqd process` |

### Adding a new entity end-to-end

See the worked example in [`docs/ai/flows/db-migrations.md`](../flows/db-migrations.md#adding-a-new-entity): edit `schema.graphql` → `sqd codegen` → `sqd build` → `sqd up` → `sqd migration:apply` (sync baseline) → `sqd migration:create` (shadow-DB generate) → inspect for unintended `DROP`s → `sqd migration:apply` → commit migration alongside the schema change.

### Adding a custom index / view / trigger / computed column

These **cannot** live in `schema.graphql` or `db/migrations/` — they belong in the custom-migration folders. See [`docs/ai/flows/db-migrations.md`](../flows/db-migrations.md) for the full rationale and worked examples.

## DB MCP servers

The `orca-local` and `orca-local-alt` MCP servers point at the local dev DB and are the convenient way to inspect data while iterating. Connect to one before issuing queries. (Read-only prod servers like `orca-prod-102-read-only` also exist — never mutate prod.)

## Code map

- `commands.json` — full list of `sqd` subcommands available in this project.
- `package.json` — additional npm scripts (`db:backfill`, `ingester-codegen:all`, etc.).
- `docker-compose.yml` — local Postgres (port `23798`) and Redis (port `6379`) containers.
- `scripts/` — pure-JS local utilities (`safe-migration-create.js`, `sub-client.js`, `db-backfill-runner.ts`, etc.).