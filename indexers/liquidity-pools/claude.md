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
