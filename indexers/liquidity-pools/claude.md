# Project overview

Substrate blockchain indexer for **Hydration** (Polkadot parachain, 6s block time). Built on the [Subsquid (SQD) framework](https://docs.sqd.ai/).

## Stack

- **Framework**: Subsquid (`@subsquid/substrate-processor`)
- **Postgres**: Main storage. ORM is SQD's TypeORM wrapper (limited functionality). Isolation level: `READ COMMITTED`.
- **Redis + TimeSeries**: Caching and historical chart data.
- **API**: Express.js + PostGraphile GraphQL server (separate process).
- **DB MCP server**: `orca-prod-102-read-only` — **READ ONLY**. Never mutate unless the user explicitly asks.

## Entry points

- App entry: `src/main.ts`
- Single-processor mode: `src/processorHelpers/singleFlowAllInOneProcessor.ts` — handlers run in a fixed order; do not reorder.

## Concepts

- **Aggregation indexer**: This app. Custom business logic to aggregate and decorate blockchain data.
- **SQD Archive**: SQD-maintained API serving parsed/indexed on-chain events. Middleware between indexer and RPC. Not queryable with custom filters.
- **Storage dictionary**: Hydration-maintained custom SQD indexer. Provides parsed storage snapshots to avoid direct RPC calls. Used by this indexer when the dictionary has already processed the current block.

## Key constraints

1. **Batch processing**: Historical blocks are processed in batches (up to 800 blocks). At chain head, batch size is 1.
2. **Automatic transactions**: SQD opens a DB transaction at batch start and commits at batch end. This is not configurable.
3. **Reorg handling**: SQD detects chain reorgs, rolls back DB changes for affected blocks, and re-runs the batch handler.
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

## Asset IDs

Assets tracked from Asset Registry use their registry ID as the DB primary key (`id`). ERC20 assets use their H160 contract address instead. The `assetRegistryId` field stores the registry ID when one exists.

- `id` (required) — DB primary key. Numeric (registry ID) or H160 hex address (ERC20/debt tokens).
- `assetRegistryId` (nullable) — Asset Registry ID. Null for unregistered assets (e.g. AAVE debt tokens).

Debt tokens (AAVE) are not in Asset Registry but still have contract addresses, so they fit the same schema — they just lack an `assetRegistryId`.
