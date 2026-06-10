---
name: Support & test apps
description: Overview of the auxiliary apps that share the monorepo but are not part of the active indexer pipeline — support/api-health-checker, support/db-backfill-from-reapers, and tests/api-tests.
audience: ai-agent, human
related:
  - ../deployment/shared-infra-stacks.md
  - ../ci-cd/api-tests.md
  - ../architecture/monorepo-layout.md
---

# Support & test apps

## When to read this
- A task explicitly targets `support/api-health-checker`, `support/db-backfill-from-reapers`, or `tests/api-tests`.
- Understanding what the health checker monitors or how the reaper backfill works.
- Confirming whether a folder is part of the active indexer pipeline (it isn't — these are auxiliary).

## Concepts

These are workspaces (`support/*`, `tests/*`) but **not part of the runtime indexer pipeline**. Each has its own README/docs; this file is a pointer + orientation only. Default to treating them as support/legacy unless the task names them.

### `support/api-health-checker` (NestJS)
- Continuously validates a deployed indexer's GraphQL API and alerts Discord on discrepancies.
- Subscribes to on-chain events via WSS RPC, queries the indexer's GraphQL API, compares, tracks per-event-type health scores, exposes REST health endpoints.
- Monitors: swap events (`Broadcast_Swapped3`), money-market Supply/Borrow, and block-height lag (on-chain vs indexer).
- Uses `polkadot-api` (PAPI) descriptors (`.papi/`), Bull + Redis, urql GraphQL client.
- Deployed via `self-hosted/api-health-checker.stack.yml` / `indexer-health-checker/whale-indexer-health-checker.stack.yml`. **Image:** `ghcr.io/mckrava/hydration-indexer-api-health-checker` (different namespace from the indexers). **Targets SQD-cloud APIs** (`*.squids.live`). See `../deployment/shared-infra-stacks.md`.

### `support/db-backfill-from-reapers` (plain Node.js)
- One-off tooling to migrate/merge data from multiple "reaper" indexer DBs (partial-history) into a single "harvester" DB (full history).
- Cursor-based streaming, batched bulk INSERT or PostgreSQL `COPY` mode (5–10× faster), dependency-ordered table waves, resumable progress tracking, validation + reports.
- Lots of operational `.md` notes in the folder (`COPY_MODE.md`, `INDEX_MANAGEMENT_WORKFLOW.md`, `PERFORMANCE_DEGRADATION_FIX.md`, etc.). Has its own `docker-compose*.yml` / `stack.yml`.
- Run with `node index.js` / `npm run check-progress`. Not wired into CI.

### `tests/api-tests`
- GraphQL API assertion suite for the liquidity-pools / storage-dictionary APIs.
- **Primary consumer is CI**, not day-to-day dev — invoked by the API-test workflows via `npm run test:liq-pools-api`. See `../ci-cd/api-tests.md`.

## Code map
- `support/api-health-checker/README.md` — full feature/architecture/config reference.
- `support/api-health-checker/package.json` — NestJS app (`start:prod` = `node dist/main`), `papi-typegen`, codegen scripts.
- `support/db-backfill-from-reapers/README.md` + `STRUCTURE.md` — backfill tool overview and layout.
- `tests/api-tests/` — the API assertion suite used by CI.

## Gotchas
- **Not in the indexer pipeline.** Changes here don't affect indexer behaviour or the published indexer images. Don't conflate the health-checker image with the indexer images.
- **Health checker observes SQD-cloud-hosted APIs, not the self-hosted swarm.** "Indexer healthy per the checker" ≠ "self-hosted stack healthy". Confirm `INDEXER_GRAPHQL_API_URL` before drawing conclusions.
- **`db-backfill-from-reapers` is destructive by nature** (it writes into a target DB, newer reaper data overwrites older for the same id). It's one-off migration tooling — never point it at a live production DB without the validation steps in its own docs.
- **`tests/api-tests` is effectively CI-only.** Treat as legacy for local work unless explicitly asked.
