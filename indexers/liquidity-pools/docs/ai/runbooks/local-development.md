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

## Status

**Placeholder.** The owner will fill in detailed steps for each subsection below. Until then, see the links and pointers provided.

## DB migrations

For everything related to creating, applying, and structuring DB migrations — both native SQD migrations and the custom-migration folders (`src/customDbMigrations/migrations/`, `src/apiSupport/apiMigrations/migrations/`) — see:

- [`docs/ai/flows/db-migrations.md`](../flows/db-migrations.md)

Quick summary so you don't take a wrong turn early in onboarding:

- **`sqd migration:create`** — safe. Generates against an isolated shadow DB. Preserves custom-migration objects.
- **`sqd migration:create:unsafe`** — legacy. Will drop indexes/views/triggers created by custom migrations. Avoid.
- Indexes/views/computed columns/triggers that can't be expressed on an entity belong in `src/customDbMigrations/migrations/` (processor) or `src/apiSupport/apiMigrations/migrations/` (API), **never** in `db/migrations/`.

## TODO — sections to fill in

- Prerequisites (Docker, Node version, env files)
- Local environment setup — `.env.hydration.local`, `.env.hydration-paseo-next.local`
- Bringing up local Postgres + Redis (`sqd up`, `docker-compose.yml` overview)
- Restoring a DB dump from `db/dev/` (see `/reset-and-init-orca-local-alt` skill)
- Running the processor app locally (`sqd process` vs `sqd process:fast`)
- Running the API server locally (`sqd api` vs `sqd api:fast`)
- Adding a new entity end-to-end
- Adding a new handler / processing flow
- Type generation: `sqd codegen`, `sqd typegen`, `papi-typegen`
- Tests and one-off probes (`tests/` folder)
- Debugging tips (using the MCP `orca-local`/`orca-local-alt` servers, hydrated logger, Bull dashboard)

## Code map

- `commands.json` — full list of `sqd` subcommands available in this project.
- `package.json` — additional npm scripts (`db:backfill`, `ingester-codegen:all`, etc.).
- `docker-compose.yml` — local Postgres (port `23798`) and Redis (port `6379`) containers.
- `scripts/` — pure-JS local utilities (`safe-migration-create.js`, `sub-client.js`, `db-backfill-runner.ts`, etc.).