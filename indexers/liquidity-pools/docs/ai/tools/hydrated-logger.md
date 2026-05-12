---
name: HydratedLogger
description: Dual-transport structured logger (pino console + batched Postgres). Backs `support.app_logs` — the canonical source for per-call timing, action_type breakdowns, and per-batch performance investigations.
audience: ai-agent, human
related:
  - ./batch-processing.md
  - ./transactions.md
---

# HydratedLogger

## When to read this

- Investigating slow batches: which call inside `handleX` actually spent the time?
- Asked about `support.app_logs` (column meaning, retention, who writes to it).
- Adding new instrumentation around an RPC / EVM / storage / DB call.
- Writing or grepping `db_read`, `db_write`, `storage_fetch`, `rpc_call`, `evm_read`, `other` — these are this logger's `action_type` values.
- Symbols to grep for: `HydratedLogger`, `getHydratedLogger`, `initHydratedLogger`, `measureStorageFetch`, `measureRpcCall`, `measureEvmContractCall`, `findWithLogs`, `findOneWithLogs`.
- Operational tasks where another engineer says "check the support.app_logs table".

## Concepts

A singleton structured logger with two transports running side-by-side:

1. **Console** — `pino` + `pino-pretty`. Always-on by default.
2. **Postgres** — batched in-memory buffer flushed to `support.app_logs` on a timer (default 1 s) or when the buffer hits `maxBatchSize` (default 100), whichever comes first.

DB logging is opt-in (`HLOG_DB_FLUSH_ENABLED`). When enabled it auto-creates the schema, table, indexes, and the `support.v_app_logs_action_stats` analytics view on first `init()`.

### What gets logged automatically

Most production traffic lands in `support.app_logs` not through direct `log.info(...)` calls but through three thin wrappers that already exist:

| Wrapper | Adds `action_type` | Located in |
|---|---|---|
| `measureStorageFetch` | `storage_fetch` | `src/utils/hydratedLogger/utils.ts` |
| `measureRpcCall` | `rpc_call` | `src/utils/hydratedLogger/utils.ts` |
| `measureEvmContractCall` | `evm_read` | `src/utils/hydratedLogger/utils.ts` |
| `storeUtils.findWithLogs` / `findOneWithLogs` / `upsertBatch...` | `db_read` / `db_write` | `src/utils/typeormDatabaseUtils.ts` |

These wrappers all suppress console output (`ignoreConsoleLogs: true`) — they exist so per-call telemetry can be queried later without spamming stdout.

### Row shape

Every row in `support.app_logs` is one timed operation. Columns that matter for analysis:

| Column | Meaning |
|---|---|
| `ts` | When the call finished. |
| `name` | Operation name. For storeUtils wrappers it is auto-generated as `find_<Entity>`, `findOne_<Entity>`, or `upsertBatch_<Entity>`. For RPC/EVM/storage it's the dotted call path (`omnipool.positions.getMany`, `tokens.accounts.get`, `CurrenciesApi.account`, …). |
| `action_type` | One of `db_read`, `db_write`, `storage_fetch`, `rpc_call`, `evm_read`, `other`. |
| `duration_ms` | Wall-clock time of the wrapped function. |
| `success` | `true` if the wrapped fn returned, `false` if it threw. |
| `para_block_height` | Single-block tag. Set by callers that work on one block. |
| `para_blocks_range` | Range tag like `12378949-12378949`. Set by `storeUtils` from `ctx.blocks[0..last].header.height` — so DB rows almost always carry this column, RPC/EVM/storage rows usually carry `para_block_height` instead. |
| `op_id` | Optional UUID to correlate paired events (e.g. begin/end of one operation). |
| `meta` | `jsonb` blob with the rest (e.g. `originCallFn`, `findOptions` serialised, `fetchArgs`). |

### Pre-built analytics view

`support.v_app_logs_action_stats` aggregates per `(name, action_type)` and exposes `calls, p50_ms, p90_ms, p99_ms, max_ms, success_rate_pct, first_ts, last_ts`. Use this for "what's slow in aggregate" without writing your own percentile SQL.

## Code map

- `src/utils/hydratedLogger/index.ts` — `HydratedLogger` class, `getHydratedLogger`, `initHydratedLogger`, `measure()`.
- `src/utils/hydratedLogger/utils.ts` — `measureStorageFetch`, `measureRpcCall`, `measureEvmContractCall` (the three wrappers most call sites use).
- `src/utils/hydratedLogger/db/baseMigration.ts` — schema + indexes for `support.app_logs`.
- `src/utils/hydratedLogger/db/viewsMigration.ts` — `support.v_app_logs_action_stats` percentile view.
- `src/utils/hydratedLogger/README.md` — quick-start API reference (configuration table, method signatures).
- `src/utils/typeormDatabaseUtils.ts:85` (`findWithLogs`), `:112` (`findOneWithLogs`) — where DB reads get auto-tagged with `paraBlocksRange`.
- `src/appConfig.ts:107–125` — `HLOG_*` env vars.
- `src/main.ts` — `initHydratedLogger()` call site.
- `src/parsers/chains/hydration/storage/*` — storage parsers that wrap fetches with `measureStorageFetch`.

## Configuration

All driven by env vars consumed in `AppConfig` (`HLOG_*`):

| Env var | Default | Effect |
|---|---|---|
| `HLOG_DB_FLUSH_ENABLED` | `false` | Master switch for the Postgres transport. Schema/views are only created when this is on. |
| `HLOG_DB_FLUSH_MAX_BATCH_SIZE` | `100` | Flush early once the in-memory buffer reaches this many rows. |
| `HLOG_DB_FLUSH_INTERVAL_MS` | `1000` | Otherwise flush on this timer. |
| `HLOG_CONSOLE_LOGS_ENABLED` | `true` | Toggle pino-pretty stdout. |
| `HLOG_CONSOLE_LOGS_VERBOSE` | `false` | Include the `meta` object in console output. |
| `HLOG_LOG_FILE_ENABLED` | `false` | Mirror to a rotating file via `pino/file`. |
| `HLOG_LOG_FILE_PATH` | `./logs/app.log` | File path when file logging is on. |

## Gotchas

- **DB transport is opt-in.** If `HLOG_DB_FLUSH_ENABLED=false`, `support.app_logs` will be empty on that instance even though the wrappers are still wired everywhere. Confirm env before assuming the table is missing data.
- **Buffer can drop rows.** `flush()` swallows errors (`try { ... } catch { /* dropped batch */ }` at `src/utils/hydratedLogger/index.ts:354`). If Postgres is unreachable, the logger does not block the indexer but it also does not retry. Treat `app_logs` as a sampling / best-effort log, not an audit trail.
- **Async `getInstance` race.** `getHydratedLogger()` returns a promise; the singleton is created lazily. First call from a hot path costs one schema-ensure round trip. Call `initHydratedLogger()` once at startup (already done in `main.ts`) so handlers don't pay that cost.
- **Console-suppressed by default in the wrappers.** `measureStorageFetch`/`measureRpcCall`/`measureEvmContractCall` and the storeUtils wrappers all set `ignoreConsoleLogs: true`. If you grep stdout for an operation name, you will *not* see them — query the DB instead.
- **Schema-ensure is fire-and-forget on failure.** If `ensureSchema()` fails (e.g. missing permissions), the logger logs a warning and continues. Subsequent inserts will fail per-batch and be dropped. If `app_logs` is unexpectedly empty, check pino warnings at startup.
- **`para_blocks_range` vs `para_block_height` are written by different layers**:
  - `storeUtils.findWithLogs` / `findOneWithLogs` / `upsertBatch...` set `paraBlocksRange` (range tag).
  - `measureStorageFetch` / `measureRpcCall` / `measureEvmContractCall` set `paraBlockHeight` (single block).
  - When grouping per batch, key on `COALESCE(para_blocks_range, para_block_height::text)`.
- **Pino transport writes go through a worker thread.** Shutdown without `await log.shutdown()` may lose the last buffered console lines. `initHydratedLogger()` already wires SIGINT/SIGTERM handlers.
- **The DB pool is separate from the indexer's `ctx.store` pool.** Log inserts use `CommonPgPool` and run outside the SQD transaction — they are not rolled back on reorg. Consequence: a reorg's re-runs *will* duplicate `app_logs` rows for the same block range. Dedup with `MIN(ts)` per `(name, para_blocks_range)` if you need exact-once analytics.
- **Singleton across the process.** `HydratedLogger.getInstance()` returns the same instance with whatever config the *first* call used. Reconfiguring later does nothing. Configure in `main.ts` before any handler runs.

## Examples

### Find slowest operations in the last 15 min

```sql
SELECT name, action_type, count(*) AS calls,
       round(avg(duration_ms)::numeric, 1) AS avg_ms,
       round(sum(duration_ms)::numeric, 0) AS total_ms,
       round(max(duration_ms)::numeric, 0) AS max_ms
FROM support.app_logs
WHERE ts > now() - interval '15 minutes' AND duration_ms IS NOT NULL
GROUP BY name, action_type
ORDER BY total_ms DESC NULLS LAST
LIMIT 20;
```

### Per-batch breakdown by action_type

```sql
SELECT COALESCE(para_blocks_range, para_block_height::text) AS batch_key,
       round(sum(duration_ms) FILTER (WHERE action_type='rpc_call')::numeric, 0)       AS rpc_ms,
       round(sum(duration_ms) FILTER (WHERE action_type='storage_fetch')::numeric, 0)  AS storage_ms,
       round(sum(duration_ms) FILTER (WHERE action_type='evm_read')::numeric, 0)       AS evm_ms,
       round(sum(duration_ms) FILTER (WHERE action_type='db_read')::numeric, 0)        AS db_read_ms,
       round(sum(duration_ms) FILTER (WHERE action_type='db_write')::numeric, 0)       AS db_write_ms
FROM support.app_logs
WHERE ts > now() - interval '15 minutes'
GROUP BY batch_key
ORDER BY (COALESCE(sum(duration_ms), 0)) DESC
LIMIT 10;
```

### Pre-built percentile view

```sql
SELECT name, action_type, calls, p50_ms, p90_ms, p99_ms, success_rate_pct
FROM support.v_app_logs_action_stats
ORDER BY calls DESC
LIMIT 20;
```

### Adding instrumentation in code

Prefer the existing wrappers — they already set `action_type`, suppress console, and accept the standard `originFn` / `blockHeight` metadata:

```ts
import { measureStorageFetch } from '../../../utils/hydratedLogger/utils';

const positions = await measureStorageFetch({
  fn: () => api.query.omnipool.positions.entries(),
  storageName: 'omnipool.positions.getMany',
  originFn: 'getOmnipoolLiquidityPositions',
  blockHeight: blockHeader.height,
});
```

For DB reads, prefer `ctx.storeUtils.findWithLogs` / `findOneWithLogs` over `ctx.store.find` / `findOne` so the call appears in `support.app_logs`.

For a custom one-off measurement (rare), use the generic `measure()` on the singleton:

```ts
const log = await getHydratedLogger();
await log.measure({
  fn: () => doExpensiveThing(),
  name: 'doExpensiveThing',
  actionType: 'other',
  meta: { paraBlockHeight: blockHeader.height },
});
```