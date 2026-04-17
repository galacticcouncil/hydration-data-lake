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
       No newline at end of file
6. ctx.batchState.state is a working cache with TTL of 1 processing blocks batch. It inits on the beginning of processing of
   each batch. Used for collecting entities which will be saved in the end of the batch.
   Usage flow: init ctx.batchState.state in the beginning of blocks batch processing handler ->
   create new entity || prefetch required data from DB (e.g. Asset, Xykpool, etc) -> add entity to ctx.batchState.state ->
   use new unsaved entity in the code from ctx.batchState.state -> save entity to DB

7. LatestProcessedDataCacheManager manages cache within application lifecycle (from start to shutdown). Main goal -
   to collect latest records of different historical data which saved in DB to avoid an expencive reading from DB.
   Records to this cache should not be added in any place except before saving data from ctx.batchState.state to DB.
   Usage flow: prefetch data from DB once, if cache accumulator for specific entity is empty -> use latest historical
   data within the codebase -> set fresh latest hist data entities to cache accumulator just before saving data to DB.
