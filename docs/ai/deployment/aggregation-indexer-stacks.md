---
name: Aggregation-indexer deployment stacks
description: The self-hosted/aggregation-indexer/ stacks (orca-full-orca.yml, orca-full-catfish.yml) — the liquidity-pools indexer plus its Redis TimeSeries and Prometheus sidecars, and how it is wired to the storage dictionary.
audience: ai-agent, human
related:
  - ./docker-swarm-overview.md
  - ./storage-dictionary-stacks.md
  - ./postgres-secret-management.md
  - ../architecture/indexer-topology.md
---

# Aggregation-indexer deployment stacks

## When to read this
- Deploying or editing the liquidity-pools (aggregation) indexer on the swarm.
- Working in `self-hosted/aggregation-indexer/orca-full-orca.yml` or `orca-full-catfish.yml`.
- Wiring the consumer to the storage dictionary, Redis TimeSeries, or Prometheus.
- Questions about the consumer's `PROCESS_FROM_BLOCK`, feature flags, or default processor flow in production.

> Authoritative behaviour spec is `indexers/liquidity-pools/CLAUDE.md` + `indexers/liquidity-pools/docs/ai/`. This file documents the **deployment topology**.

## Concepts

`self-hosted/aggregation-indexer/` holds two near-identical full stacks for two production environments:
- `orca-full-orca.yml`
- `orca-full-catfish.yml`

They differ by environment naming/hosts/RPC endpoints, not by application structure.

### Services in a stack
- **`aggregator-processor-<env>`** — the liquidity-pools processor (`node lib/main.js` after migrations). Default production flow is the single-flow all-in-one processor (`ALL_IN_ONE_SINGLE_FLOW_PROCESSOR` semantics; see the indexer's `CLAUDE.md`).
- **`aggregator-api-<env>`** — PostGraphile + Express API, Traefik-exposed (e.g. routers `orca-sh-p1-101` / `-http`).
- **`db-aggregator-indexer-<env>`** — `postgres:15`, hand-tuned, fronted by `db-aggregator-pgbouncer-<env>`.
- **`db-ts-redis-<env>`** — `redis/redis-stack:latest` for the Redis TimeSeries (prices/volumes/balances charts).
- **`prometheus-<env>`** + **`prometheus-config-writer-<env>`** — metrics scrape of the processor, Traefik-exposed (e.g. `*-stats.orca.hydration.cloud`). The config-writer (`alpine`) renders the prometheus config into a shared volume on startup.

### Storage-dictionary wiring
- `USE_STORAGE_DICTIONARY: 'true'`.
- Six per-category URLs point at the dictionary APIs (`storage-dict-<cat>-hist-data-v2.orca.hydration.cloud/graphql`). With a single shared dictionary instance, all six point at the same URL. See `../architecture/indexer-topology.md`.

### Notable env in the production anchors (`x-aggregator-proc-default-envs`)
- `PROCESS_FROM_BLOCK: 11565981`, `PROCESS_TO_BLOCK: -1` (follow head).
- `BLOCKS_FINALITY_OFFSET: 50` — finality buffer for the reorg-safe Redis volume drainer.
- `PERSIST_HIST_DATA_ONLY_ON_CHANGE: 'true'`, `COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES: 'true'`.
- `USE_XYKPOOLS_DATA_IN_TRADE_ROUTER: 'false'` (XYK-only assets are priced via the interim-asset path, not the Router — see the indexer's spot-prices doc).
- `ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION: 'true'` (head-mode route cache).
- Balances feature flags: `USE_EVENTS_DRIVEN_BALANCE_TRACKING`, `ACCOUNT_BALANCES_REAGGREGATION_ENABLED`, `BALANCES_LOG_ENABLED`, `ACCOUNT_LIQUIDITY_BALANCES_FLUSH_ENABLED`, etc.
- `IGNORE_ARCHIVE_DATA_SOURCE: 'false'` + `GATEWAY_HYDRATION_HTTPS` (SQD Archive in use).

## Code map
- `self-hosted/aggregation-indexer/orca-full-orca.yml` — full reference stack (anchors at top; processor env block ~lines 50–150).
- `self-hosted/aggregation-indexer/orca-full-catfish.yml` — sibling env.
- `self-hosted/time-series.stack.yml` — standalone shared Redis TimeSeries (the per-stack `db-ts-redis-*` is the embedded variant).
- `indexers/liquidity-pools/CLAUDE.md` — meaning of every env flag above.
- `indexers/liquidity-pools/docs/ai/flows/redis-volume-drainer.md` — `BLOCKS_FINALITY_OFFSET` finality buffer.

## Gotchas
- **The consumer needs the dictionary indexed for its block range.** If the dictionary lags, the consumer falls back to RPC (slower, still correct). Do not deploy a fresh consumer expecting dictionary speed before the dictionary has caught up — see `self-hosted/README.md`.
- **Redis TimeSeries is an out-of-transaction side effect.** Head writes are buffered and only flushed past `BLOCKS_FINALITY_OFFSET` (reorg safety). Changing the offset changes how much head data is held before commit.
- **API service overrides some processor envs.** The API container sets `COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES: 'false'` (it reads, doesn't write the time series). Don't copy the processor anchor onto the API service blindly.
- **Two envs, one structure.** A change usually needs applying to BOTH `orca` and `catfish` files. They drift only in hosts/RPC/naming — keep app-level changes in sync across both.
- **Prometheus is exposed via Traefik on its own host.** Metrics endpoints are public-ish behind TLS; the `prometheus-config-writer` must run before prometheus or the config volume is empty.
