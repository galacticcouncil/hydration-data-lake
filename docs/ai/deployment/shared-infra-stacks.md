---
name: Shared & all-in-one deployment stacks
description: The remaining self-hosted stacks — all-in-one full stack, time-series Redis, API health-checker, and the indexer health-checker. What each is for and when to touch it.
audience: ai-agent, human
related:
  - ./docker-swarm-overview.md
  - ./aggregation-indexer-stacks.md
  - ../support/support-apps.md
---

# Shared & all-in-one deployment stacks

## When to read this
- Deploying the combined dev/small-setup stack, the shared Redis, or a health checker.
- Editing `self-hosted/all-in-one/`, `time-series.stack.yml`, `api-health-checker.stack.yml`, or `indexer-health-checker/`.
- Figuring out which API a health checker is actually observing.

## Concepts

### `all-in-one/hydration-datalake-full-stack-selfhosted.stack.yml`
- Single stack that brings up **both indexers + their infra together**: aggregation processor/API, storage-dictionary processor/API, aggregator Postgres + pgbouncer, dictionary Postgres volume, Redis TimeSeries, Prometheus.
- Uses **`:latest`** images for both indexers (the category/orca stacks pin a SHA instead).
- `USE_STORAGE_DICTIONARY: 'true'` with all six `STORAGE_DICTIONARY_*_URL` pointing at the **same** in-stack dictionary API anchor (`*storage-dict-api-url`) — the single-instance pattern.
- API service sets `COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES: 'false'` (read-only on the time series), processor sets `'true'`.
- Purpose: dev / small chains / quick bring-up. It is the **slow path** for production reindex — prefer the split category stacks (`./storage-dictionary-stacks.md`).

### `time-series.stack.yml`
- Standalone shared **Redis Stack** (`redis/redis-stack:latest`) for the time-series DB (prices/volumes/balances). Exposed on host `6378:6379`, password from `TIME_SERIES_REDIS_DEV_PASS` external secret, persisted to a local volume.
- The per-env aggregation stacks embed their own `db-ts-redis-*` Redis; this standalone is the shared/dev variant.

### `api-health-checker.stack.yml`
- Runs the `support/api-health-checker` app image + a Redis. Continuously checks a deployed indexer GraphQL API and alerts Discord.
- **Observes an SQD-cloud-hosted API**, not the self-hosted one: `INDEXER_GRAPHQL_API_URL: https://galacticcouncil.squids.live/hydration-pools:unified-prod/api/graphql`.
- Image is in a **different GHCR namespace**: `ghcr.io/mckrava/hydration-indexer-api-health-checker` (not `galacticcouncil`).

### `indexer-health-checker/whale-indexer-health-checker.stack.yml`
- Same app, "whale" environment. Points at `hydration-pools:whale-prod` on `squids.live`. Traefik-exposed at `whale-health-checker-dev.kril.hydration.cloud`. Discord tokens from external secrets.

## Code map
- `self-hosted/all-in-one/hydration-datalake-full-stack-selfhosted.stack.yml` — combined stack (image anchors ~line 44/55, dictionary URL wiring ~line 143).
- `self-hosted/time-series.stack.yml` — shared Redis TimeSeries.
- `self-hosted/api-health-checker.stack.yml` — health-checker + Redis.
- `self-hosted/indexer-health-checker/whale-indexer-health-checker.stack.yml` — whale-env health checker.
- `support/api-health-checker/README.md` — what the checker validates (swap events, money-market ops, block lag). See `../support/support-apps.md`.

## Gotchas
- **Health checkers point at SQD-cloud APIs (`*.squids.live`), not the self-hosted swarm APIs.** When asked "is the indexer healthy", confirm which deployment the checker targets before drawing conclusions about the self-hosted stack.
- **Health-checker image lives under `ghcr.io/mckrava/...`, the indexers under `ghcr.io/galacticcouncil/...`.** Different build origin; the health-checker is not built by the main indexer image workflow.
- **All-in-one uses `:latest`.** A redeploy can pull a different image than expected. For reproducible production, use the SHA-pinned category / orca stacks.
- **The standalone time-series Redis exposes `6378` on the host with a dev password secret.** Don't assume it's the same Redis the production aggregation stack uses (that one is embedded per-env).
