# Project overview

Substrate blockchain indexer for **Hydration** (Polkadot parachain, 6s block time) that focuses solely on **per-block storage state**. It is intentionally a "thin" indexer: it does not run business logic, it just captures parsed storage snapshots for every block and exposes them via GraphQL so that higher-level indexers (e.g. the `liquidity-pools` aggregation indexer) can read storage from Postgres instead of hitting an RPC node. Built on the [Subsquid (SQD) framework](https://docs.sqd.ai/).

## Why this indexer exists

The Subsquid framework's standard batch flow (parse events → collect storage keys → `getMany` prefetch → reuse in handlers) reduces per-block RPC roundtrips but still suffers three problems:

- **Reindexing time**: every new version of an aggregation indexer reprocesses history, paying the full RPC cost again.
- **RPC node load**: extensive `getMany` calls during reindexing put heavy pressure on the node.
- **Redundant calls**: multiple aggregation indexers running in parallel each re-fetch the same storage.

The Storage Dictionary indexes storage state for selected pallets on **every block** into its own DB and serves it over GraphQL. The data is immutable (chain storage at block N never changes), so the same Storage Dictionary instance acts as **centralized, reusable middleware** for any number of high-level indexers. The aggregation indexer (`../liquidity-pools`) reads storage from here whenever the dictionary has already covered the current block; otherwise it falls back to RPC.

## Resources
- https://github.com/galacticcouncil/hydration/blob/main/general/hydration.md
- https://github.com/galacticcouncil/hydration/blob/main/general/omnipool.md

## Stack

- **Framework**: Subsquid (`@subsquid/substrate-processor`).
- **Postgres**: Main storage. ORM is SQD's TypeORM wrapper. Isolation level: `READ COMMITTED`.
- **API**: PostGraphile GraphQL server (separate process from the processor — `src/api.ts`).
- **Compression**: `pako` (gzip) + base64 for `BlockCompressedData` rows.

## Entry points

- **Processor app**: `src/main.ts` — runs the SQD batch handler. Orchestrates prefetch, per-block handlers, and the batch-end "unique data" persist step.
- **API app**: `src/api.ts` — Express + PostGraphile. Reads the same DB that the processor writes to.
- **Per-batch orchestration**: `runProcessor()` in `src/main.ts`. Handlers run in a fixed order; do not reorder.

## Concepts

- **Storage dictionary** (this app): per-block storage snapshots for selected pallets, exposed via GraphQL. No event/call business logic.
- **Aggregation indexer** (`../liquidity-pools`): consumer of this dictionary. Reads storage snapshots from here when available, falls back to RPC otherwise.
- **SQD Archive / Gateway**: SQD-maintained API serving parsed/indexed on-chain events. Middleware between the indexer and the RPC node. Configurable via `GATEWAY_HYDRATION_HTTPS` + `GATEWAY_HYDRATION_API_KEY`; can be bypassed with `IGNORE_ARCHIVE_DATA_SOURCE=true`.
- **Pool category toggles** (`PROCESS_LBP_POOLS`, `PROCESS_XYK_POOLS`, `PROCESS_OMNIPOOLS`, `PROCESS_STABLEPOOLS`, `PROCESS_GENERIC_HIST_DATA`, `PROCESS_ACCOUNTS`): each toggle scopes a processor instance to one data category. Deployed separately so a parsing fix or backfill can be re-run for one category without touching the others. Deployment files are split by hosting target — see the **Deployment** section below.

  **Improvement notice — keep categories table-independent.** Cross-table foreign-key relationships between categories should be avoided. The category split is what makes parallel indexing, independent reindex, and independent scaling possible; every cross-category FK reintroduces ordering constraints and forces coordination that the design is trying to eliminate. Concrete current offender: the `Asset` relationship referenced from per-block snapshot entities (`AssetHistoricalData.asset`, `Aavepool.reserveAsset` / `aToken`, etc.) couples every category to the `Asset` table, which is why exactly one processor must run as `ASSETS_TRACKER_PROCESSOR` and all others must block in `waitForAssetsActualisation` before they can write. Eliminating this relationship — e.g. denormalize to a plain `assetId: String!` column on snapshot entities and let consumers join on `Asset` only when they need the metadata — would let each category processor start cold without waiting on a sibling. Apply the same rule to any future cross-category link.

## Key constraints

1. **Batch processing**: Historical blocks are processed in batches (SQD can hand up to ~100k blocks in one batch during reindexing). At chain head, batch size is 1.
2. **Sub-batching for RPC safety**: A single SQD batch is split into smaller sub-batches by `SubProcessorStatusManager.calcSubBatchConfig()` to avoid blowing past RPC rate limits. Sub-batch size = `INDEXER_MAX_SUB_BATCH_SIZE / <active sub-processors count>`. Between sub-batches, the processor sleeps for a random delay capped at `SUB_BATCH_MAX_TIMEOUT_MS` to spread load.
3. **Automatic transactions**: SQD opens a DB transaction at batch start and commits at batch end. Not configurable.
4. **Reorg handling**: SQD detects chain reorgs, rolls back DB changes for affected blocks, and re-runs the batch handler. **Risks to watch for**:
   - **DB and in-memory caches desync**: SQD only rolls back the DB. Any app-lifecycle cache (`LatestProcessedDataCacheManager`, `AaveMoneyMarketsRegistry`, module-level singletons) keeps post-reorg state and must be re-validated against DB before being trusted. When invalidating one cache, audit sibling caches with the same lifetime — partial invalidation has caused subtle "last known value" drift before.
   - **Idempotency of writes**: every entity created during a batch must use a deterministic id (e.g. `<poolAddress>-<paraBlockHeight>`, `<accountId>-<assetId>-<paraBlockHeight>`) so re-running the same block produces the same row, not a duplicate. Schema ids in `schema.graphql` already encode this pattern — preserve it.
   - **Head batches are size 1**: a single bad block can re-run repeatedly. Avoid unconditional cold-start work without a "done" guard (e.g. `xykPoolsProcessedBlocks` / `assetHistoricalDataProcessedBlocks` guards on each handler).
5. **Data flow**:
   - **Storage**: Blockchain RPC -> Indexer (via `parsers/storage/*`, batched via `getMany`).
   - **Events** (used only to drive balance/account snapshots and asset-registry refresh, not as the main payload): Blockchain RPC -> SQD Gateway -> Indexer.
6. **`ctx.batchState.state`** (`src/utils/batchState.ts`) — per-batch working cache (reset on each new batch). All snapshots collected during processing are staged here keyed by deterministic ids, then persisted at batch end. The `*ProcessedBlocks` Sets per category exist so re-running the same block within a batch is a no-op.
   Flow: init at batch start → run per-block handlers that write into `batchState` → at batch end, either save everything directly (default) or run the dedupe path (`persistUniqueEntities`, see below).
7. **`LatestProcessedDataCacheManager`** (`src/utils/latestProcessedDataCacheManager.ts`) — app-lifecycle cache holding the most recent persisted historical record per entity (per-asset / per-pool-asset / per-account-asset). Used **only** by the `PERSIST_HIST_DATA_ONLY_ON_CHANGE = true` path to compare a new candidate snapshot against the last persisted one. Populate the cache right before persisting (so the cache always reflects what is actually in DB) and update it with the just-persisted rows. Never populate it from mid-batch staged data.
8. **`PERSIST_HIST_DATA_ONLY_ON_CHANGE`**:
   - `false` (default per `appConfig`): every block-handler saves its row directly inside the per-block handler. Storage cost is high but the DB always has one row per `(entity, block)`.
   - `true`: per-block handlers only stage into `batchState`. At batch end, `persistUniqueEntities()` runs each category through its `get<Category>HistDataWithUniqueData()` helper, which diffs each candidate against `LatestProcessedDataCacheManager` and writes only when something actually changed. This is the deduplicated mode used by long-running historical-data sub-indexers.
   - **Block-data compression interacts with this flag**: in `false` mode, `compressBlockStorage` runs inline per block (right after the per-block handlers); in `true` mode, the compression step is deferred to the end of `persistUniqueEntities` because `compressBlockStorage` mutates cached entity references (it rewrites relation fields to `{ id }` stubs to keep the compressed payload small) — running it before dedup would corrupt the entities still in `batchState`.

## Multiprocessor mode

The indexer can run as a single processor or as N parallel processors all writing to the same DB. The split is controlled by SQD's `stateSchema` mechanism and a few extra fields on `SubProcessorStatus`.

- **`STATE_SCHEMA_NAME`** — Postgres schema where each processor stores its own SQD state (current `height`, `fromBlock`, `toBlock`). Defaults to `squid_processor` (see `src/appConfig.ts`). Must be unique per processor in a multiprocessor deployment — if you spin up a second processor without overriding it, both will share the default schema and trample each other's status row.
- **`SUB_PROCESSORS_RANGES`** — `schema1:from:to;schema2:from:to;...` map of every sub-processor's range. The API reads this to expose a unified `squidStatus` GraphQL query that aggregates per-processor progress; falls back to a single entry derived from `STATE_SCHEMA_NAME` + `PROCESS_FROM_BLOCK` + `PROCESS_TO_BLOCK` if not provided.
- **`INDEXER_SUB_PROCESSORS_NUMBER`** — how many sub-processors the operator deployed. Sub-batch size is divided across them so the aggregate RPC load stays under `INDEXER_MAX_SUB_BATCH_SIZE`.
- **`ASSETS_TRACKER_PROCESSOR`** + **`ASSETS_ACTUALISATION_PROC_STATE_SCHEMA_NAME`** — exactly one processor in the cluster runs the Asset Registry actualization (`actualiseAssets()`), to avoid concurrent inserts into the shared `asset` table deadlocking each other. Every other processor calls `waitForAssetsActualisation()` and blocks (polling `SubProcessorStatus.assetsActualisedAtBlock`) until the assets-tracker has published at least one batch. In a single-processor deployment, set the actualization schema name equal to `STATE_SCHEMA_NAME`.
- **`IS_CUSTOM_DB_MIGRATIONS_RUNNER`** — exactly one processor should run hand-written migrations (`src/customDbMigrations/`). The other processors set this to `false` to avoid racing each other through `node_pg_migrations`. The migration runner has retry logic so concurrent runs are safe but slower.

## Per-batch flow (`src/main.ts:runProcessor`)

Read this end-to-end before editing anything in `main.ts` — the ordering matters.

1. **Custom DB migrations** (first batch only, only on the designated migrations runner).
2. **`BatchState` + `SubProcessorStatusManager`** construction. The status manager also computes `subBatchConfig` based on how many processors are currently active.
3. **Assets actualization sync** — `waitForAssetsActualisation` blocks non-tracker processors; `prefetchAllAssets` loads every `Asset` row into `batchState`; `ensureNativeToken` upserts HDX (id `0`); `actualiseAssets` refreshes from chain (tracker processor only).
4. **`prefetchAll<Category>RecordsForBlocksRangeToEnsureMissedBlocks`** — only runs when `PROCESS_ONLY_MISSED_BLOCKS = true`. Loads rows already in DB into `batchState` and marks their block heights as processed, so the per-block handlers below become no-ops for any block that's already been indexed. This is the **backfill mode**: deploy with this flag on, set a custom block range, and the processor will only fill in gaps without redoing existing snapshots.
5. **`AaveMoneyMarketsRegistry.initContractInstances`** — pinned to the latest block in the batch. EVM contract handles are cached at the registry level; do not reinitialize per block.
6. **`PROCESS_ACCOUNTS` batch-scoped prefetches** — runs `prefetchAllAccountsExtensions` and `handleEvmEventsInBlocksBatch` once for the whole batch (NOT in the per-block parallel loop, hence the comment "must be processed outside of the parallel processing").
7. **Sub-batch loop** — splits `ctx.blocks` into chunks of size `subBatchConfig.subBatchSize`. Per sub-batch:
   - `handleBlockEntities` (sequential, fills `Block` entities from `relayChainInfo.currentBlockNumbers` events).
   - `Promise.all` over the sub-batch's blocks running the enabled per-block handlers (`handleLbpPoolsStorage`, `handleXykPoolsStorage`, `handleOmnipoolStorage`, `handleStablepoolStorage`, plus the `PROCESS_GENERIC_HIST_DATA` group `handleAssetsStorage` + `handleOracles` + `handleAavePoolsStorage`, plus the `PROCESS_ACCOUNTS` per-block `handleAssetAccountBalancesPerBlock`).
   - Random sleep up to `SUB_BATCH_MAX_TIMEOUT_MS` between sub-batches (RPC backpressure).
   - In `PERSIST_HIST_DATA_ONLY_ON_CHANGE = false` mode, `compressBlockStorage` is called inside the parallel loop per block. In `true` mode, it is skipped here and deferred to step 9.
8. **`persistUniqueEntities`** — dedupe + bulk upsert path for the `PERSIST_HIST_DATA_ONLY_ON_CHANGE = true` mode. For each enabled category, builds the "changed only" set against `LatestProcessedDataCacheManager`, upserts it, and updates the cache with the persisted rows. Then re-runs `compressBlockStorage` for every block at the end.
9. **`SubProcessorStatusManager.setSubProcessorStatus({ height: <last block height> })`** — advances this processor's recorded height.

## `BlockCompressedData` — what it is and why it exists

`BlockCompressedData` is a single row per block containing a gzip+base64 blob of **all** dictionary entities for that block (every pool, every pool-asset, every oracle entry, every account balance, every asset historical data row, etc., grouped by category — see `CompressedBlockData` in `src/handlers/blockDataCompresion/index.ts`).

Purpose: consumers (the aggregation indexer) can fetch one row instead of running N joined queries per block. This collapses a multi-table GraphQL query into a single `blockCompressedDataByPk(id: $height)` fetch + client-side gzip decompression via `PakoManager`.

Two compounding wins make this worthwhile:

1. **Fewer round-trips / joins**: one row instead of N joined queries per block.
2. **Less data on the wire**: a gzipped blob is dramatically smaller than the equivalent human-readable rows + relations + JSON-encoded enums / BigInts. In practice this measures at roughly **~10× faster** end-to-end (DB → API → consumer) than fetching the same block as full denormalized rows, simply because the bytes pulled out of Postgres and pushed through the API layer are an order of magnitude smaller. Compression cost is paid once at write time per block; decompression cost is paid once per consumer fetch.

Trade-off / shape: relation fields are stripped to `{ id }` stubs and some `BigInt` fields are coerced to strings before compression, so the decoded payload is not directly identical to the entity shape — it's a flat snapshot meant for the consumer to rehydrate.

**Dual persistence**: the storage dictionary writes both the compressed blob **and** the full human-readable per-entity rows (`Xykpool` / `XykpoolAssetsData` / `Omnipool` / `Stableswap` / `AssetHistoricalData` / `Aavepool` / `EmaOracle` / `AccountAssetBalanceHistoricalData` / etc.). The compressed row is the hot path for high-throughput consumers like the aggregation indexer; the full rows stay queryable via the PostGraphile API for ad-hoc research, analytics, debugging, and any case where you need to filter / aggregate across blocks (which the compressed blob cannot serve). Both representations describe the same block state and are written in the same SQD transaction, so they cannot diverge.

## `MinifiedDataStructuresManager` — compact tagged values

Several entity fields are typed as `MinifiedDataStructure { t: DataStructureTypeName, d: [String!] }` instead of being modeled as separate columns / nested objects (`AccountBalances`, `AssetDynamicFee`, `OmnipoolAssetState`). The motivation is the same as `BlockCompressedData`: keep the row small and let the consumer rehydrate via the matching schema. `MinifiedDataStructuresManager.getMinifiedDataStructure` is the single producer; consumers must decode by `t` (the `DataStructureTypeName` enum). Field order in `d[]` is positional and load-bearing — do not reorder fields inside a case branch.

## DB migrations — two parallel tracks

This project runs two migration systems against the same DB.

- **Native SQD migrations** (`db/migrations/`) — generated from `schema.graphql` / TypeORM entities by `sqd migration:create`. Auto-applied by SQD on processor startup. **Scope: only objects derivable from entity metadata** (tables, columns, FK constraints, simple `@Index` declarations).
- **Custom migrations** (`src/customDbMigrations/migrations/`) — hand-written `.sql` files (composite/lookup indexes optimized for the aggregation indexer's query patterns). Applied by `node-pg-migrate` on processor startup, tracked in `node_pg_migrations`. Runner gated by `IS_CUSTOM_DB_MIGRATIONS_RUNNER`.
- **Backfill migrations** (`db/backfillMigrations/`) — parking lot for one-off `.js` migrations already applied to every deployed env and no longer relevant to fresh DBs. Not auto-run by anything; kept visible for historical reference.

**WARNING — do not put custom DB objects in `db/migrations/`.** SQD's generator diffs entity metadata against the live DB; any DB object that doesn't appear on an entity (a partial index, a covering index) looks like drift and will be emitted as `DROP ...` in the next generated migration. Always put non-entity DB objects in `src/customDbMigrations/migrations/`.

### Safe migration generator (`sqd migration:create`)

`sqd migration:create` runs `scripts/safe-migration-create.js`, not the raw generator. The script spins up a throwaway `postgres:15` Docker container on a random port, applies only `db/migrations/` to it, then invokes `squid-typeorm-migration generate` against that **shadow DB**. Because the shadow DB never has custom-migration objects, the generated diff is provably free of spurious `DROP` statements for them.

After generation, the script scans the new file for `DROP INDEX|TABLE|VIEW|COLUMN|FUNCTION|TRIGGER|MATERIALIZED VIEW|SCHEMA|CONSTRAINT` and prints a warning — since the shadow DB starts clean, every remaining DROP corresponds to a real entity-side removal worth verifying.

Requires the Docker daemon (already required by `sqd up`). The old behavior is preserved as `sqd migration:create:unsafe` for the rare case where diffing against the live DB is intentional.

| Command | Behavior |
|---|---|
| `sqd migration:create` | Shadow DB. Safe. Default. |
| `sqd migration:create:unsafe` | Direct generate against the connected DB — will drop any object the entities don't declare. Avoid. |
| `sqd migration:apply` | Apply pending `db/migrations/` (always against the connected DB). |

## Schema id conventions

Composite ids in `schema.graphql` are deterministic and load-bearing for reorg-safety (re-running a block produces the same row id, so upsert wins over duplicate insert). Preserve them when adding entities.

- Per-block snapshots: `<entityKey>-<paraBlockHeight>` (e.g. `Xykpool`, `Omnipool`, `Stableswap`, `AssetHistoricalData`, `Aavepool`, `EmaOracle`).
- Per-pool-asset per-block: `<poolAddress>-<assetId>-<paraBlockHeight>`.
- Per-account-asset per-block: `<address>-<assetId>-<paraBlockHeight>`.
- Per-account-mm-position per-block: `<accountId>-<poolAddress>-<paraBlockHeight>`.
- `BlockCompressedData.id = block_number` (one row per block).
- `SubProcessorStatus.id = STATE_SCHEMA_NAME` (one row per sub-processor).

## Deployment

The storage dictionary is currently **self-hosted via Docker Swarm**. SQD-cloud hosting is no longer the active target.

### Why parallel deployment matters

Indexing time is the dominant operational cost of this project (every reindex of mainnet history is millions of blocks × dozens of storage calls per block). The deployment topology is designed around two layered parallelisms that compound to cut total reindex time from weeks to days:

1. **Category-level parallelism (across stacks)**: each `st-dict-*.stack.yml` deployment runs an independent processor cluster scoped to one `PROCESS_*` category (LBP, XYK, omnipool, stableswap, generic, accounts). They share the DB but write to disjoint tables, so they run fully in parallel against the chain — total wall-clock indexing time becomes `max(category_times)` instead of `sum(category_times)`. This is also why a parsing fix in one category does not force a global rewind: only the affected stack needs to backfill.
2. **Sub-processor-level parallelism (within a stack)**: a single stack can spin up N processors, each pinned to its own `STATE_SCHEMA_NAME` and a disjoint block range via `SUB_PROCESSORS_RANGES` / `PROCESS_FROM_BLOCK` / `PROCESS_TO_BLOCK`. The processors all write to the same category tables but never touch overlapping `(entity, paraBlockHeight)` rows because their block ranges don't overlap. `INDEXER_MAX_SUB_BATCH_SIZE / INDEXER_SUB_PROCESSORS_NUMBER` keeps the aggregate RPC load constant as N grows. With enough sub-processors and enough RPC capacity, historical reindex time for a category scales near-linearly with N.

In practice, an "all-in-one" deployment is convenient for dev / small chains but is the slow path. For production reindex / backfill the playbook is: deploy each category as its own stack, set `INDEXER_SUB_PROCESSORS_NUMBER` to the number of disjoint ranges you've carved, populate `SUB_PROCESSORS_RANGES` accordingly, and let exactly one processor per category run as `ASSETS_TRACKER_PROCESSOR` + `IS_CUSTOM_DB_MIGRATIONS_RUNNER`. Once history is caught up, scale each category back down to a single head-following processor.

- **Active: Docker Swarm stack files** — `../../self-hosted/storage-dictionary-indexer/` (repo path: `hydration-data-lake/self-hosted/storage-dictionary-indexer/`). One stack file per category, each spinning up the relevant `PROCESS_*` processor(s), the API process, and shared infra:
  - `st-dict-all-in-one.stack.yml` — single-processor catch-all (every `PROCESS_*` flag on).
  - `st-dict-lbp-hist-data.stack.yml`
  - `st-dict-xyk-hist-data.stack.yml`
  - `st-dict-omnipool-hist-data.stack.yml`
  - `st-dict-stableswap-hist-data.stack.yml`
  - `st-dict-generic-hist-data.stack.yml`
  - `st-dict-account-hist-data.stack.yml`
- **Legacy / reference: SQD Cloud manifests** — `sqd-hosting-manifests/` inside this project (`deployment-lbp-pool.yaml`, `deployment-xyk-pool.yaml`, `deployment-omnipool.yaml`, `deployment-stablepool.yaml`, `deployment-generic-hist-data.yaml`, `deployment-account-hist-data.yaml`, `deployment-all-in-one.yaml`). These were used when the indexer ran on SQD's multiprocessor cloud hosting. Kept as a reference for env-var combinations per category; the active source of truth for production deployments is the swarm stack files.

When adding or modifying a deployment, edit the matching `st-dict-*.stack.yml` in `../../self-hosted/storage-dictionary-indexer/`. Touch the SQD-hosting YAMLs only when intentionally restoring SQD cloud as a target.

## Local development

Two long-running processes need to be started for a full local stack:

- `sqd process` → builds, applies SQD migrations, runs the processor (`src/main.ts`).
- `sqd api` → builds, runs PostGraphile against the same DB (`src/api.ts`).

Postgres is brought up via `sqd up` (which runs `docker compose up -d`). Env files are auto-loaded from `.env.hydration.local` / `.env.hydration.test` by `appConfig.ts` based on `NODE_ENV`.

For pool-category-scoped local runs, mirror the production manifests: set exactly one of `PROCESS_*_POOLS` / `PROCESS_GENERIC_HIST_DATA` / `PROCESS_ACCOUNTS` to `true` and the rest to `false`, give the processor its own `STATE_SCHEMA_NAME`, and (if running alongside other categories) set `ASSETS_TRACKER_PROCESSOR=false` on all but one.

### Running locally (full flow)

All commands below come from `./commands.json` and require the SQD CLI (`npm i -g @subsquid/cli@latest`).

1. **Typegen** — `sqd typegen` reads `./typegen.json` and emits TypeScript for events, calls, and storage into the paths declared there.
2. **Codegen** (only if `schema.graphql` changed) — `sqd codegen` regenerates TypeORM entities and enums. An enum must be referenced by an entity, otherwise it won't be emitted.
3. **Build** — `sqd build` (required before generating migrations).
4. **Native migrations** — `sqd migration:create` generates against an isolated shadow DB (see "DB migrations — two parallel tracks" above for why this matters).
5. **Start infra** — `sqd up` boots the Docker containers (Postgres, etc.).
6. **Run processor** — `sqd process` rebuilds, applies all native + custom migrations (`src/customDbMigrations/migrations`), and starts the indexer. Custom migrations only run on the processor with `IS_CUSTOM_DB_MIGRATIONS_RUNNER=true`.
7. **Run API** — `sqd api` starts the PostGraphile GraphQL server against the same DB.

## Environment variables

Full reference with defaults lives in `.env.example`. Quick map of the ones that change behavior in non-obvious ways:

- `IGNORE_ARCHIVE_DATA_SOURCE` — skip the SQD gateway and pull events directly from RPC.
- `PROCESS_FROM_BLOCK` / `PROCESS_TO_BLOCK` — block range; `-1` for `to` means "follow head".
- `PROCESS_<CATEGORY>` — per-category enablement (see manifests).
- `STATE_SCHEMA_NAME` — Postgres schema for this processor's SQD state row.
- `ASSETS_TRACKER_PROCESSOR` / `ASSETS_ACTUALISATION_PROC_STATE_SCHEMA_NAME` — exactly-one assets actualizer in a multiprocessor cluster.
- `INDEXER_MAX_SUB_BATCH_SIZE` / `INDEXER_SUB_PROCESSORS_NUMBER` / `SUB_BATCH_MAX_TIMEOUT_MS` — RPC backpressure controls.
- `SUB_PROCESSORS_RANGES` — `schema:from:to;...` cluster map for the `squidStatus` API.
- `PROCESS_ONLY_MISSED_BLOCKS` — backfill mode (skip blocks already in DB).
- `PERSIST_HIST_DATA_ONLY_ON_CHANGE` — dedupe path vs always-persist (see Key constraints #8).
- `IS_CUSTOM_DB_MIGRATIONS_RUNNER` — gate the custom-migration runner to one processor.