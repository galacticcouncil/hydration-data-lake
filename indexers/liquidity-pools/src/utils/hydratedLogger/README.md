# HydratedLogger

Dual-transport structured logger: **console** (pino-pretty) + **Postgres** (`support.app_logs`).

## Quick start

```ts
// At app startup (registers SIGINT/SIGTERM for graceful shutdown)
import { initHydratedLogger } from './utils/hydratedLogger';
await initHydratedLogger();

// Anywhere else
import { getHydratedLogger } from './utils/hydratedLogger';
const log = await getHydratedLogger();

log.info('indexing started');
log.info({ actionType: 'db_write', paraBlockHeight: 123 }, 'saved block');
log.warn('something off');
log.error({ err }, 'handler failed');
```

## Configuration

All settings come from `AppConfig` (env vars). The constructor accepts `HydratedLoggerConfig`:

| Option | Default | Description |
|---|---|---|
| `level` | `"info"` | Minimum log level (`trace` .. `fatal`) |
| `consoleLogsEnabled` | `true` | Enable pino-pretty console output |
| `consoleLogsVerbose` | `true` | Include meta object in console output |
| `logFileEnabled` | `false` | Write logs to a file |
| `logFilePath` | `./logs/app.log` | File path when file logging is on |
| `db.enabled` | `false` | Enable batched Postgres logging |
| `db.maxBatchSize` | `100` | Rows buffered before an early flush |
| `db.flushIntervalMs` | `1000` | Timer-based flush interval |

## Logging methods

All level methods accept arguments in either order:

```ts
log.info('message', { meta });
log.info({ meta }, 'message');
```

Available levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`.

### `measure()`

Wraps an async/sync function, measures wall-clock duration, and logs success or failure with timing:

```ts
const result = await log.measure({
  fn: () => fetchData(),
  name: 'fetchPrices',
  actionType: 'rpc_call',
  meta: { paraBlockHeight: 100 },
});
```

### Runtime options

Pass `{ ignoreConsoleLogs: true }` as the last argument to suppress console output while still writing to the DB buffer.

## Convenience wrappers (`utils.ts`)

Pre-configured `measure()` calls for common action types:

- **`measureStorageFetch()`** -- `actionType: 'storage_fetch'`, console suppressed
- **`measureRpcCall()`** -- `actionType: 'rpc_call'`, console suppressed
- **`measureEvmContractCall()`** -- `actionType: 'evm_read'`, console suppressed

```ts
import { measureStorageFetch } from './utils/hydratedLogger/utils';

const balances = await measureStorageFetch({
  fn: () => api.query.tokens.accounts(addr),
  storageName: 'tokens.accounts',
  originFn: 'getBalances',
  blockHeight: 42000,
});
```

## DB schema

On first `init()` (when DB logging is enabled) the logger auto-creates:

- **Table** `support.app_logs` -- timestamp, level, name, action_type, duration_ms, success, meta (jsonb), block context fields
- **Indexes** on ts, name+action_type, op_id, action_type, success, and a GIN index on meta
- **View** `support.v_app_logs_action_stats` -- aggregated stats per name/action_type (call count, p50/p90/p99 latency, success rate)

## Action types

| Type | Usage |
|---|---|
| `db_read` | Database read operations |
| `db_write` | Database write operations |
| `storage_fetch` | On-chain storage queries |
| `rpc_call` | Substrate RPC calls |
| `evm_read` | EVM contract read calls |
| `other` | Default / uncategorised |

## Shutdown

`initHydratedLogger()` registers signal handlers automatically. If managing lifecycle manually, call `await log.shutdown()` to flush the buffer and close the PG pool.
