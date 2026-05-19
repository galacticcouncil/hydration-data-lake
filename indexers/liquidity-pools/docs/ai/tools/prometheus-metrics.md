---
name: Prometheus metrics
description: Custom Prometheus metrics exposed alongside SQD's built-in ones — per-handler timing histograms/gauges, batch duration, and reorg detection. Served on the same `/metrics` endpoint the SQD processor already serves.
audience: ai-agent, human
related:
  - ./hydrated-logger.md
  - ../architecture/reorg-handling.md
  - ../architecture/batch-processing.md
---

# Prometheus metrics (`src/utils/prometheusMetrics`)

## When to read this

- Adding a new `mt.track('name', ...)` call site, or wondering why timings show up automatically in Grafana.
- Investigating Grafana panels driven by `sqd_handler_duration_*`, `sqd_batch_duration_*`, `sqd_reorg_*` series.
- Adding a new processor variant — you need to extend the `ProcessorType` union.
- Asked "is there a reorg metric?" — yes, see `createReorgTracker`.
- Symbols to grep for: `createMetricsTracker`, `createReorgTracker`, `sqdRegistry`, `ProcessorType`, `sqd_handler_duration_seconds`, `sqd_batch_duration_seconds`, `sqd_reorg_total`, `sqd_reorg_depth_blocks`.

## Concepts

Custom Prometheus counters/gauges/histograms registered against **SQD's own private registry**, not the prom-client global default. SQD serves `/metrics` from its private registry; by attaching to it we get our custom series on the same endpoint as `sqd_processor_last_block`, `sqd_rpc_request_count`, etc. — no separate HTTP server needed.

Three concerns covered by this folder:

| Concern | Helper | What it emits |
|---|---|---|
| Per-handler timing | `createMetricsTracker(processorType).track(name, fn)` / `trackSync` | Histogram + last-value gauge, labelled by `function_name` + `processor_type`. Also pairs with `console.time/timeEnd`. |
| Per-batch total time | `createMetricsTracker(processorType).startBatch()` (returns `endBatch`) | Histogram + last-value gauge for the whole batch wall-clock, labelled by `processor_type`. |
| Reorg detection | `createReorgTracker(processorType).observeBatch(ctx)` | Counter + depth histogram + last-height gauge + info-style gauge with `block_height` / `block_hash` / `block_timestamp` labels. |

### Why a custom reorg metric exists

SQD does **not** expose a "this batch is a re-run after reorg" flag on the context. When a reorg happens, SQD silently rolls back the DB transaction and re-runs the batch handler with overlapping block heights. The detection here works by tracking the highest block height seen across batches in a closure and comparing each new batch's first height to it: if `first.height <= maxObservedHeight`, the batch is a re-run caused by a reorg, and `depth = maxObservedHeight - first.height + 1`. See `reorgTracker.ts:74` (`observeBatch`).

This is the only way the indexer knows a reorg is in progress. Anything else that needs "are we in a reorg?" signal should consume this metric or duplicate the same height-comparison pattern — not assume SQD will tell it.

## Metric reference

All metrics are registered against `sqdRegistry` (the SQD private `Registry` extracted via `(processor as any).prometheus.registry`).

### Handler timing — `handlerMetricsTracker.ts`

| Metric | Type | Labels | Buckets / notes |
|---|---|---|---|
| `sqd_handler_duration_seconds` | Histogram | `function_name`, `processor_type` | Buckets: 1 ms → 60 s (1ms, 5ms, 10ms, 25ms, 50ms, 100ms, 250ms, 500ms, 1s, 2.5s, 5s, 10s, 30s, 60s) |
| `sqd_handler_duration_last_seconds` | Gauge | `function_name`, `processor_type` | Latest observation; useful for "current value" Grafana panels |
| `sqd_batch_duration_seconds` | Histogram | `processor_type` | Buckets: 100 ms → 300 s |
| `sqd_batch_duration_last_seconds` | Gauge | `processor_type` | Latest batch wall-clock |

### Reorg tracking — `reorgTracker.ts`

| Metric | Type | Labels | Notes |
|---|---|---|---|
| `sqd_reorg_total` | Counter | `processor_type` | Increments once per detected reorg. |
| `sqd_reorg_depth_blocks` | Histogram | `processor_type` | Buckets: 1, 2, 3, 5, 10, 25, 50, 100, 250 blocks |
| `sqd_reorg_last_block_height` | Gauge | `processor_type` | Height of the incoming first block of the most recent reorg. |
| `sqd_reorg_last_block_info` | Gauge (info-style) | `processor_type`, `block_height`, `block_hash`, `block_timestamp` | Value always `1`; data lives in the labels. Render as a Table panel in Grafana. `block_timestamp` is ms-since-epoch as a string. |

## Code map

- `src/utils/prometheusMetrics/index.ts` — barrel: re-exports `ProcessorType`, `sqdRegistry`, `createMetricsTracker`, `createReorgTracker`.
- `src/utils/prometheusMetrics/registry.ts` — defines `sqdRegistry` (extracted from the processor instance) and the `ProcessorType` union.
- `src/utils/prometheusMetrics/handlerMetricsTracker.ts` — `createMetricsTracker` factory and the four handler/batch metrics.
- `src/utils/prometheusMetrics/reorgTracker.ts` — `createReorgTracker` factory and the four reorg metrics; reorg detection lives in `observeBatch` at `:74`.
- `src/main.ts:46` — calls `createReorgTracker('single_flow')` once at module load; `:60` calls `observeBatch(ctx)` first thing in each batch.
- `src/processorHelpers/singleFlowAllInOneProcessor.ts:83` — `const mt = createMetricsTracker('single_flow')`; many `mt.track(name, fn)` call sites follow.
- `src/processorHelpers/multiprocessorHandlers/{coreProcessor,balacesProcessor,poolAndAssetMetricsProcessor,spotPriceProcessor}.ts` — each constructs its own tracker with its `ProcessorType`.

## Configuration

There is no app-level config here — the helpers are always-on once a tracker is created. The Prometheus port is whatever the SQD processor is configured to serve on (framework default, currently 3030); the SQD CLI / runtime owns that. Custom metrics simply ride along on the same endpoint.

## Gotchas

- **Don't use the prom-client global default registry.** Anything registered against the default singleton will never appear on the SQD `/metrics` endpoint. Always pass `registers: [sqdRegistry]` (or call `sqdRegistry.registerMetric(...)`) — this is enforced by convention, not by the compiler.
- **`(processor as any).prometheus.registry` is a private SQD API.** If SQD framework refactors, this stops working. The cast is intentional. If the cast ever throws or returns undefined, the metric module crashes at import time — by design, so you notice immediately rather than silently losing telemetry.
- **`ProcessorType` is a closed union.** Adding a new processor (say `'mm_aggregator'`) requires editing `registry.ts:20` first; otherwise the call to `createMetricsTracker('mm_aggregator')` won't typecheck.
- **`mt.track` always pairs with `console.time/timeEnd` using the same `name`.** Don't also wrap the call in your own `console.time(name)` or you'll get duplicate-label warnings on stdout (and the second `timeEnd` will read negative).
- **Reorg detection state lives in a closure.** `createReorgTracker(...)` returns an object whose `maxObservedHeight` is held in its closure. There is one such closure per `createReorgTracker` call. In `single_flow` mode there's exactly one (constructed at module load in `main.ts:46`). In multi-processor mode each processor that wants reorg detection needs its own tracker. Don't create a new tracker per batch — you'd reset `maxObservedHeight` to `-1` every time and detect nothing.
- **`observeBatch` must be called first in every batch handler.** Per the code comment at `reorgTracker.ts:71`: "Call once at the very start of every batch handler, before any other state is initialized — that way even a reorg arriving before batchState setup is recorded." If it's moved later, the metric will undercount any handler that fails before reaching it.
- **`sqd_reorg_last_block_info` rotates labels.** The implementation calls `.remove(prevLabels)` before `.set(newLabels, 1)` so only one info-series is active. This is deliberate: leaving old label combinations creates Prometheus cardinality growth (a unique `block_hash` per reorg). Don't change that pattern.
- **`block_timestamp` may be detection wall-clock, not block production time.** If `ctx.blocks[0].header.timestamp` is missing, the tracker falls back to `Date.now()`. Treat the label as "approximately when the reorg was detected" rather than "exact block production time".
- **No durable persistence on shutdown.** All counters/gauges/histograms reset on process restart. Use Prometheus retention + counter semantics (`rate()`/`increase()`) for cumulative metrics; do not expect `sqd_reorg_total` to survive a redeploy.

## Examples

### Standard per-handler timing

```ts
import { createMetricsTracker } from '../../utils/prometheusMetrics';

const mt = createMetricsTracker('balances');
const endBatch = mt.startBatch();

await mt.track('handleAssetAccountBalances', () =>
  handleAssetAccountBalances(ctx, parsedEvents)
);

mt.trackSync('processPoolsTvlNormalized', () =>
  processPoolsTvlNormalized({ ctx })
);

endBatch();
```

### Per-batch reorg observation (singleton pattern)

```ts
// module scope — constructed once, lives for process lifetime
import { createReorgTracker } from './utils/prometheusMetrics';
const reorgTracker = createReorgTracker('single_flow');

// inside the batch handler — first thing
processor.run(db, async (ctx) => {
  reorgTracker.observeBatch(ctx as SqdProcessorContext<Store>);
  // ... rest of batch ...
});
```

### Useful PromQL one-liners

```promql
# p95 of any handler in the last 5 min
histogram_quantile(0.95, sum by (le, function_name) (
  rate(sqd_handler_duration_seconds_bucket[5m])
))

# top 10 slowest handlers right now (last observation)
topk(10, sqd_handler_duration_last_seconds)

# reorg rate per hour
increase(sqd_reorg_total[1h])

# reorg depth p99 (how deep do they go when they happen?)
histogram_quantile(0.99, sum by (le) (rate(sqd_reorg_depth_blocks_bucket[1h])))

# Grafana Table panel for the latest reorg info (labels carry the data)
sqd_reorg_last_block_info
```

## Relationship to HydratedLogger

`HydratedLogger` and `prometheusMetrics` cover overlapping ground but answer different questions:

- **HydratedLogger / `support.app_logs`** — every single timed call, ad-hoc SQL queries, "what happened in batch 12378949". Reach for this when investigating one event.
- **Prometheus** — aggregated time-series, alerts, dashboards. Reach for this when watching trends or paging on threshold breaches.

A handler call wrapped in `mt.track(...)` produces a Prometheus observation but **does not** write to `support.app_logs`. The `storeUtils.findWithLogs` / `measureStorageFetch` / `measureRpcCall` / `measureEvmContractCall` wrappers write to `support.app_logs` but do **not** emit Prometheus. If you need both for the same call site, wrap once at each layer. See `tools/hydrated-logger.md`.