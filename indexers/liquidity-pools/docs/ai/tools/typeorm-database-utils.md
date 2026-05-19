---
name: TypeormDatabaseUtils
description: Wrapper around `ctx.store` providing measured `find` / `findOne` / batched `upsert` plus a Postgres-aware retry helper. Exposed on the batch context as `ctx.storeUtils`. The reason `support.app_logs` ever sees `find_*` / `findOne_*` / `upsertBatch_*` rows.
audience: ai-agent, human
related:
  - ./hydrated-logger.md
  - ../architecture/transactions.md
  - ../architecture/batch-processing.md
  - ../caches/batch-state.md
---

# TypeormDatabaseUtils (`ctx.storeUtils`)

## When to read this

- Writing a handler that needs to read from or write to the DB during a batch.
- Asked "why is my SQL not showing up in `support.app_logs`?" — almost always because the code used `ctx.store.find` directly instead of `ctx.storeUtils.findWithLogs`.
- Investigating a `Could not serialize access` / deadlock / lock timeout error; the retry policy lives here.
- Adding a new bulk-upsert path and unsure about batching.
- Symbols to grep for: `TypeormDatabaseUtils`, `ctx.storeUtils`, `findWithLogs`, `findOneWithLogs`, `upsertWithBatches`, `runWithRetry`.

## Concepts

`TypeormDatabaseUtils` is a thin instance-per-batch wrapper around the SQD `Store`. It exists to give every DB access three things at once:

1. **Observability.** Every call is wrapped in `HydratedLogger.measure(...)`, so it appears in `support.app_logs` with `action_type` ∈ {`db_read`, `db_write`}, `duration_ms`, and `paraBlocksRange` (the `12378949-12378949` style tag) auto-attached. See `tools/hydrated-logger.md`.
2. **Retry for transient Postgres errors.** Writes go through `runWithRetry` with exponential backoff (with jitter) for a small set of SQLSTATE codes that are safe to retry.
3. **Automatic batching** for writes. `upsertWithBatches` splits any array bigger than `DB_ACTION_MAX_BATCH_SIZE` into chunks and runs each chunk through retry + measure.

A fresh `TypeormDatabaseUtils` is constructed at the start of every batch and bound to `ctx.storeUtils`. The constructor captures the batch's block range into `currentProcessingBlocksRangeTag` once — so every log row from this instance gets the same range label.

### Retry policy

`runWithRetry` retries only on these SQLSTATE codes (see `typeormDatabaseUtils.ts:19`):

| Code | Meaning | Why retry is safe |
|---|---|---|
| `25P02` | Transaction aborted, commands ignored until end of block | After a serialization failure inside the same SQD batch — the framework rolls back and the next attempt is a clean tx. |
| `40P01` | Deadlock detected | Postgres has already aborted one of the deadlocked transactions; the other side has progressed. |
| `40001` | Serialization failure | Concurrent writers contended; one tx must retry. |
| `55P03` | Lock not available (`NOWAIT` / `lock_timeout`) | The blocking transaction may have released the lock by the next attempt. |

Any other error rethrows immediately. Defaults (from `AppConfig`):

| Setting | Default | Source |
|---|---|---|
| `DB_ACTION_RETRIES_NUMBER` | `3` | `src/appConfig.ts:433` |
| `DB_ACTION_RETRIES_BASE_DELAY_MS` | `50` | `src/appConfig.ts:436` |
| `DB_ACTION_RETRIES_MAX_DELAY_MS` | `1000` | `src/appConfig.ts:439` |
| `DB_ACTION_MAX_BATCH_SIZE` | `2500` | `src/appConfig.ts:442` |

Backoff is `min(baseDelay * 2 ** attempt + jitter, maxDelay)` where jitter ∈ `[0, baseDelay)`.

### What gets written to `support.app_logs`

| Method | `name` column | `action_type` | Extra meta |
|---|---|---|---|
| `findWithLogs` | `find_<className>` | `db_read` | `originCallFn`, serialized `findOptions`, `paraBlocksRange` |
| `findOneWithLogs` | `findOne_<className>` | `db_read` | same as above |
| `upsertWithBatches` | `upsertBatch_<EntityCtor>` | `db_write` | `opId` (one UUID shared by every chunk of the same `upsertWithBatches` call), `upsertBatchSize`, `paraBlocksRange` |

`className` for find/findOne defaults to `entityClass?.constructor.name`, but callers usually pass it explicitly (e.g. `className: 'OmnipoolLiquidityPosition'`) — the explicit form is what shows up in the logs. The constructor-name fallback is unreliable for some bundling setups.

## Code map

- `src/utils/typeormDatabaseUtils.ts:18` — `TypeormDatabaseUtils` class.
- `src/utils/typeormDatabaseUtils.ts:19` — `retryableCodes` set (the four SQLSTATE codes).
- `src/utils/typeormDatabaseUtils.ts:26` — block-range tag captured in constructor.
- `src/utils/typeormDatabaseUtils.ts:35` — `runWithRetry` (backoff + jitter loop).
- `src/utils/typeormDatabaseUtils.ts:59` — `upsertWithBatches` (chunk → measure → retry).
- `src/utils/typeormDatabaseUtils.ts:85` — `findWithLogs`.
- `src/utils/typeormDatabaseUtils.ts:112` — `findOneWithLogs`.
- `src/processor.ts:100` — type declaration: `storeUtils: TypeormDatabaseUtils` on the batch context.
- `src/main.ts:90` — instance construction per batch (`new TypeormDatabaseUtils(ctxWithBatchState, extLogger)`).

## Configuration

All four `DB_ACTION_*` knobs in `AppConfig` (see table above). Override via env vars of the same names. The retryable-codes set is hard-coded — to add a new code, edit `typeormDatabaseUtils.ts:19` (do not extend it lightly; only add codes you know are safe to retry without causing duplicates).

## Gotchas

- **Prefer `ctx.storeUtils.*` over `ctx.store.*`.** Direct `ctx.store.find` / `ctx.store.findOne` / `ctx.store.upsert` calls work, but they bypass measurement and retry. A "missing call site" in `support.app_logs` almost always means someone used `ctx.store` directly. The compiler will not catch this.
- **`findOptions` is JSON-stringified for logs.** Anything not JSON-safe (e.g. a `BigInt`, a circular object, or a TypeORM operator that doesn't serialize cleanly) silently degrades to `findOptionsDecorated = null` (caught and swallowed at `:94`). If you can't see your `where` in the log row, that's why; it doesn't affect the query itself.
- **`upsertWithBatches` returns nothing.** It does not return inserted IDs. If you need the saved entity back, hold the reference you passed in — SQD's upsert mutates the entity in place for autogenerated fields where applicable.
- **`opId` groups chunks of one `upsertWithBatches` call.** All chunks of a single call share the same UUID. Use it to count `(rows, ms)` per logical save in SQL: `SELECT op_id, sum(meta->>'upsertBatchSize')::int, sum(duration_ms) FROM support.app_logs WHERE action_type='db_write' GROUP BY op_id`.
- **The retry helper is local-only.** It does NOT retry across the SQD-managed transaction boundary. If the framework aborts the entire batch (e.g. on reorg or commit failure), retries inside `runWithRetry` are irrelevant — SQD will re-run the whole batch handler. Don't use `runWithRetry` as a substitute for handling reorgs.
- **Be careful adding `25P02` retries to reads.** `25P02` ("current transaction is aborted") means the SQD transaction itself is already poisoned. A retry inside the same aborted tx will just hit the same error. The code retries it anyway because the same code path is reused for writes where the calling context may differ — but in practice you should treat `25P02` on reads as "someone else corrupted the tx" and fix that, not rely on retry.
- **Block-range tag is captured once in the constructor.** If your code somehow extends the batch (it can't under SQD, but if it appears to in custom flows), the tag in logs will be stale relative to the actual blocks being processed. Don't reuse a `TypeormDatabaseUtils` instance across batches.
- **Console output is suppressed by all three methods** (`ignoreConsoleLogs: true`). Grep stdout will not show these calls; query `support.app_logs` instead. This is intentional — the call volume is high (thousands per batch).
- **Don't query for entities you created earlier in the same batch.** Per `READ COMMITTED` and SQD's batch-tx model, those rows aren't committed yet. Read them from `ctx.batchState.state` instead. See `caches/batch-state.md`.

## Examples

### Reading

```ts
const positions = await ctx.storeUtils.findWithLogs(
  OmnipoolLiquidityPosition,
  {
    where: {
      accountId: In(accountIds),
      destroyedAtParaBlockHeight: IsNull(),
    },
  },
  {
    className: 'OmnipoolLiquidityPosition',
    originCallFn: 'getOmnipoolLiquidityPositionsForAccounts',
  }
);
```

The resulting log row in `support.app_logs`:

```
name              = 'find_OmnipoolLiquidityPosition'
action_type       = 'db_read'
para_blocks_range = '12378949-12378949'
meta              = { originCallFn: 'getOmnipoolLiquidityPositionsForAccounts', findOptions: '...' }
```

### Single-row read

```ts
const status = await ctx.storeUtils.findOneWithLogs(
  ProcessorStatus,
  { where: { id: ProcessorStatus.DEFAULT_ID } },
  { className: 'ProcessorStatus', originCallFn: 'processorStatusManager.init' }
);
```

### Bulk upsert

```ts
const rows = Array.from(ctx.batchState.state.someEntityMap.values());
await ctx.storeUtils.upsertWithBatches(rows);
```

`rows.length / 2500` round trips, each one retried up to 3× on transient errors. One shared `op_id` across all of them so you can analyse a single logical save.

### Custom retry around a non-store operation

```ts
import { TypeormDatabaseUtils } from '../utils/typeormDatabaseUtils';

// rare — only when you need the retry semantics on a non-store call that still talks to PG
await ctx.storeUtils.runWithRetry(async () => {
  await pgPool.query('UPDATE something SET ...');
});
```

### Querying the resulting telemetry

```sql
-- p99 of every find/findOne by entity class, last 15 min
SELECT name, count(*) AS calls,
       round(avg(duration_ms)::numeric, 1) AS avg_ms,
       round(max(duration_ms)::numeric, 0) AS max_ms
FROM support.app_logs
WHERE action_type = 'db_read'
  AND ts > now() - interval '15 minutes'
GROUP BY name
ORDER BY count(*) DESC
LIMIT 20;

-- which upsertWithBatches calls saved how much, last hour
SELECT
  name,
  meta->>'op_id' AS op_id,
  count(*) AS chunks,
  sum((meta->>'upsertBatchSize')::int) AS rows,
  round(sum(duration_ms)::numeric, 0) AS total_ms
FROM support.app_logs
WHERE action_type = 'db_write'
  AND ts > now() - interval '1 hour'
GROUP BY name, op_id
ORDER BY total_ms DESC NULLS LAST
LIMIT 20;
```

## Relationship to other tools

- **`HydratedLogger`** — provides the `measure()` primitive `TypeormDatabaseUtils` builds on. The `db_read` / `db_write` rows in `support.app_logs` exist because of this wrapper; no other code path produces them.
- **`measureStorageFetch` / `measureRpcCall` / `measureEvmContractCall`** — the parallel wrappers for non-DB calls (`storage_fetch`, `rpc_call`, `evm_read`).
- **Prometheus metrics (`createMetricsTracker.track`)** — separate concern; produces aggregated histograms keyed by handler `name`, not per-call rows in Postgres. A typical handler is wrapped in both: outer `mt.track('handleX', ...)` for the Prometheus histogram + inner `ctx.storeUtils.findWithLogs(...)` calls for per-call telemetry.
- **`ctx.batchState`** — the right place to read entities you just created during the current batch. `ctx.storeUtils.*` is for entities already in the DB or being written to it at batch end. See `caches/batch-state.md`.