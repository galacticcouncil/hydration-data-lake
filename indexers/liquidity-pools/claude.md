# Project overview

Substrate blockchain indexer for **Hydration** (Polkadot parachain, 6s block time). Built on the [Subsquid (SQD) framework](https://docs.sqd.ai/).

## Resources
https://github.com/galacticcouncil/hydration/blob/main/general/hydration.md
https://github.com/galacticcouncil/hydration/blob/main/general/omnipool.md

## Stack

- **Framework**: Subsquid (`@subsquid/substrate-processor`)
- **Postgres**: Main storage. ORM is SQD's TypeORM wrapper (limited functionality). Isolation level: `READ COMMITTED`.
- **Redis + TimeSeries**: Caching and historical chart data.
- **API**: Express.js + PostGraphile GraphQL server (separate process).
- **DB MCP server**: `orca-prod-102-read-only` — **READ ONLY**. Never mutate unless the user explicitly asks.

## Entry points

- App entry: `src/main.ts`
- Single-processor mode: `src/processorHelpers/singleFlowAllInOneProcessor.ts` — handlers run in a fixed order; do not reorder.

**Default working flow**: The normal/default mode of this indexer runs with `ALL_IN_ONE_SINGLE_FLOW_PROCESSOR = true`, which uses `singleFlowAllInOneProcessor` as the orchestrator. Assume this flow for all tasks unless the user explicitly specifies a different processor flow (e.g. `REAGGREGATION_SINGLE_PROCESSOR` or another mode) in the current session.

## Concepts

- **Aggregation indexer**: This app. Custom business logic to aggregate and decorate blockchain data.
- **SQD Archive**: SQD-maintained API serving parsed/indexed on-chain events. Middleware between indexer and RPC. Not queryable with custom filters.
- **Storage dictionary**: Hydration-maintained custom SQD indexer. Provides parsed storage snapshots to avoid direct RPC calls. Used by this indexer when the dictionary has already processed the current block.

## Key constraints

1. **Batch processing**: Historical blocks are processed in batches (up to 800 blocks). At chain head, batch size is 1.
2. **Automatic transactions**: SQD opens a DB transaction at batch start and commits at batch end. This is not configurable.
3. **Reorg handling**: SQD detects chain reorgs, rolls back DB changes for affected blocks, and re-runs the batch handler. **Risks to watch for**:
   - **DB and in-memory caches desync**: SQD only rolls back the DB. Any app-lifecycle cache (e.g. `LatestProcessedDataCacheManager`, module-level `Set`s like `prefetchedAccountIds` in `accountOwnedAssets.ts`) keeps post-reorg state and must be invalidated explicitly. When invalidating one such cache, audit for sibling caches with the same lifetime — wiping one without the others (the historical bug behind phantom non-zero balances after restart) leaves discovery paths skipping accounts whose balance cache is empty.
   - **Idempotency of writes**: every entity created during a batch must use a deterministic id so re-running the same block produces the same row, not a duplicate. Fields set only on creation (e.g. `firstSeenParaBlockHeight`) must never be overwritten on re-run.
   - **No side-effects outside the SQD transaction during the batch**: external writes (Redis, out-of-tx Postgres) for block-dependent data are not rolled back. Only do them for data that is invariant under reorg, or move them to batch-end after the SQD commit.
   - **Head batches are size 1**: a single bad block can re-run repeatedly. Avoid logic whose cost scales per re-run (e.g. unconditional cold-start prefetches without a "done" guard).
4. **Out-of-transaction DB calls**: Some Postgres calls happen outside the main transaction, but only for data not dependent on the current transaction.
5. **Data flow**:
   - **Historical blocks**:
     - On-chain events: Blockchain RPC -> SQD Archive -> Indexer
     - Storage data: Blockchain RPC -> Indexer, or Storage Dictionary -> Indexer (if dictionary has current block)
   - **Head (latest block)**:
     - Blockchain RPC -> Indexer, or Storage Dictionary -> Indexer (if dictionary has current block)
6. **`ctx.batchState.state`** — per-batch working cache (reset on each new batch). Collects entities to be saved at batch end.
   Flow: init at batch start → create/prefetch entities → store in `batchState` → reference unsaved entities from `batchState` → save to DB at batch end.
7. **`LatestProcessedDataCacheManager`** — app-lifecycle cache holding the latest records of historical data to avoid expensive DB reads. Only populate this cache right before saving `batchState` data to DB — never elsewhere.
   Flow: prefetch from DB once (if cache is empty) → use cached latest data during processing → update cache just before DB save.
8. **Prices in batch**: During batch processing, `ctx.batchState` contains prices for all blocks in the batch — they are always calculated regardless. At DB save time, prices are deduped so only blocks where a price actually changed are persisted.
9. **`correlateAssetSpotPrices`**: Not used in the normal processing flow. Only needed in reaggregation flows where prices are fetched from DB instead of being calculated during block processing.
10. **Money market asset pricing**: Within the same money market reserve, the underlying asset, aToken, and Debt token all share the same spot price. Debt tokens (`resourceType = Debt`) cannot be priced by the Router — their price is always taken from the underlying asset. aTokens (`resourceType = aToken`) can be priced by the Router, but if the Router doesn't return a price, the underlying asset's price is used as fallback.
11. **`account_owned_asset` lookup table**: Thin table (`<accountId>-<assetId>`, deterministic id) tracking which assets each account has ever held. Used by the events-driven balance flow to discover an account's `(account, asset)` pair set without scanning `account_asset_balance_historical_data` (which has hundreds of thousands of rows per pair on prod and made discovery dominate batch time).
    - **Semantics**: ownership-only. A pair returning to a zero balance is NOT removed — the account may receive the asset again, and the historical lookup chain must remain intact.
    - **Write path**: every snapshot in `processBalanceEventsSequentially` and every pair created by `initManyAccountAssetBalancesFromOnChainData` calls `getOrCreateAccountOwnedAsset`. Idempotent on reorg re-runs (deterministic id, `firstSeenParaBlockHeight` set on creation only).
    - **Read path**: `prefetchAccountOwnedAssetsByAccountIds` loads ownership for the batch's accounts; the resulting pair set then feeds the LATERAL-join query in `prefetchLastAccountAssetBalances` (correct in both head and reaggregation modes — lookup with `para_block_height < $blockHeight` returns zero rows for pairs not yet owned at that block).

## Asset IDs

Assets tracked from Asset Registry use their registry ID as the DB primary key (`id`). ERC20 assets use their H160 contract address instead. The `assetRegistryId` field stores the registry ID when one exists.

- `id` (required) — DB primary key. Numeric (registry ID) or H160 hex address (ERC20/debt tokens).
- `assetRegistryId` (nullable) — Asset Registry ID. Null for unregistered assets (e.g. AAVE debt tokens).

Debt tokens (AAVE) are not in Asset Registry but still have contract addresses, so they fit the same schema — they just lack an `assetRegistryId`.

## Spot price calculation

Entry point: `handleAssetSpotPricesHistoricalDataAtBlock` in `src/handlers/assets/assetHistoricalData/assetSpotPrices.ts`. Dispatches each asset to one of three processors based on `getXykOnlyAssets(ctx)`:

- **`processAssetSpotPrices`** — assets with non-XYK liquidity (omnipool, stableswap, `ARTIFICIAL_OMNIPOOL_ASSET_IDS_SET`, or aTokens/Debt whose underlying has non-XYK liquidity). Priced via the SDK Router.
- **`processXykInvolvedAssetSpotPrices`** — XYK-only assets in a tradable pool. Priced via the **interim asset** (`XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID`, usually DOT; falls back to HDX if no DOT pool exists).
- **`processXykUntradableAssetSpotPrices`** — XYK-only assets whose only pools are destroyed, and share tokens of destroyed XYK pools. Writes `price = 0` with empty route.

**Why XYK-only assets use the interim asset, not the Router**: XYK-only assets can only be traded in XYK pools, so the Router would compute their price along a deterministic XYK route. To save the cost of running the Router and traversing the route graph, we approximate the price as `(pool reserve ratio) × (interim asset's already-computed spot price)`. **More importantly**, indexer instances run with XYK pool state intentionally not provided to the Router (`USE_XYKPOOLS_DATA_IN_TRADE_ROUTER = false`), which both saves router execution time and prevents the Router from building any routes through XYK pools — so XYK-only assets must be priced by this path.

## Account balances aggregation

For debugging balances aggregation, the following tables provide layered visibility — from per-asset snapshots up to a full trace of every balance that contributed to an account's total.

| Table | Purpose | Toggle |
|---|---|---|
| `account_asset_balance_historical_data` | Per-asset balance snapshot at a given block (one row per `(account, asset, block)`). | Always written. |
| `account_total_balance_historical_data` | Snapshot of an account's **total balance in the reference asset** at a given block. Aggregates all asset balances **plus** the value of all liquidity positions held by the account. | Always written. |
| `account_liquidity_balance_historical_data` | Per-liquidity-position snapshots per account per block (the per-position breakdown behind the liquidity component of the total balance). | `ACCOUNT_LIQUIDITY_BALANCES_FLUSH_ENABLED` — table may be empty if disabled. |
| `account_total_balance_historical_data_log` | **Full trace** of every balance line item included in a total-balance snapshot — use this to see exactly which balances/positions rolled up into a given `account_total_balance_historical_data` row. | `BALANCES_LOG_ENABLED` — table may be empty if disabled. |

**Debugging hint**: start at `account_total_balance_historical_data` for the suspect block, then join into `account_total_balance_historical_data_log` (if enabled) to inspect the contributing rows. Cross-check individual components against `account_asset_balance_historical_data` and `account_liquidity_balance_historical_data`.

## Local development

### DB migrations — two parallel tracks

This project runs two migration systems against the same DB. The split exists because of a destructive failure mode in SQD's generator; understanding it is mandatory before adding any DB object.

- **Native SQD migrations** (`db/migrations/`) — auto-generated from `schema.graphql` / TypeORM entities by `sqd migration:create`. Auto-applied by SQD on every processor startup. **Scope: only objects derivable from entity metadata** (tables, columns declared on entities, FK constraints, simple `@Index` declarations).
- **Custom migrations** — hand-written `.sql` files in `src/customDbMigrations/migrations/` (processor) and `src/apiSupport/apiMigrations/migrations/` (API process). Applied by `node-pg-migrate` on app startup, tracked in `node_pg_migrations`. **Scope: everything the generator can't express** — partial indexes, covering indexes with `INCLUDE`, GIN indexes with custom ops, computed columns, views, triggers, API support helpers.

**WARNING — do not put custom DB objects in `db/migrations/`.** SQD's generator diffs entity metadata against the live DB. Anything in the DB that doesn't appear on an entity (a partial index, a view, a computed column) looks like drift to the generator and will be emitted as `DROP ...` in the next generated migration. Committing such a migration has destroyed production indexes before. Always put non-entity DB objects in the custom-migration folders.

**Use `sqd migration:create` (NOT `:unsafe`).** The default `sqd migration:create` runs `scripts/safe-migration-create.js`, which generates against an isolated throwaway Postgres container that has only `db/migrations/` applied to it. The shadow DB never sees custom-migration objects, so the generated diff is provably free of spurious drops for them. The old direct-generate behavior is preserved as `sqd migration:create:unsafe` for the rare case it's actually needed.

Deep dive (when to read, code map, gotchas, debugging stuck migrations): `docs/ai/flows/db-migrations.md`.

Onboarding / full local dev workflow: `docs/ai/runbooks/local-development.md`.

## Further reading

Deep documentation lives in `docs/ai/`. Start with `docs/ai/INDEX.md`, then load only the topic(s) relevant to the task.

Quick links by topic:
- Batch / reorg / transactions → `docs/ai/architecture/`
- Spot price calculation → `docs/ai/domain/spot-prices.md`
- Money market pricing → `docs/ai/domain/money-market-pricing.md`
- Asset IDs → `docs/ai/domain/asset-ids.md`
- `batchState`, `LatestProcessedDataCacheManager`, `account_owned_asset`, API CacheManager (GraphQL / REST / `/proxy/*`) → `docs/ai/caches/`
- Balance events, reaggregation, price pipeline → `docs/ai/flows/`
- Redis time series, Bull queues, volume drainer (reorg-safe commits) → `docs/ai/tools/redis-timeseries.md`, `docs/ai/tools/redis-queue-bull.md`, `docs/ai/flows/redis-volume-drainer.md`
- Utility modules (HydratedLogger / `support.app_logs`, Prometheus metrics / reorg detection, `ctx.storeUtils`) → `docs/ai/tools/`
- Operational tasks → `docs/ai/runbooks/`