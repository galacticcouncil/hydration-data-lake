---
name: Volume drainer — reorg-safe Redis time series commits
description: Postgres-backed finality buffer for `volume` time series writes. At head, payloads land in `pending_redis_ts_commit`; a drainer flushes them to Bull only after blocks pass `BLOCKS_FINALITY_OFFSET`.
audience: ai-agent, human
related:
  - ../tools/redis-timeseries.md
  - ../tools/redis-queue-bull.md
  - ../architecture/reorg-handling.md
---

# Volume drainer

## When to read this
- Touching `commitAssetsPairVolumeToRedisTimeSeries` in `src/handlers/historicalData/index.ts`.
- Working on `TimeSeriesDataCommitManager.submitVolume` / `startDrainer` / `drainOnce` / `flushPendingCommitRows`.
- Investigating volume chart doublecounting or missing samples.
- Reading or modifying `PendingRedisTsCommit` entity / `pending_redis_ts_commit` table.
- Tuning `REDIS_TS_VOLUME_DRAINER_ENABLED`, `REDIS_TS_DRAINER_POLL_INTERVAL_MS`, `REDIS_TS_DRAINER_BATCH_SIZE`, `REDIS_TS_DRAINER_FINALITY_SAFETY_MARGIN`, `REDIS_TS_DRAINER_AWAIT_BULL_ACK`.

## Concepts

**Problem.** Volume time series samples are derived per `(assetPair, paraBlockHeight)`. On reorg, SQD rolls back Postgres but cannot roll back Redis. If the indexer commits volume to Redis during the batch and SQD then reorgs the batch, the post-reorg replay emits volume for the new canonical block — usually at a different wallclock timestamp — producing a second time series sample for the same on-chain event. With `volume` series aggregated via `SUM`, this is exactly doublecounting on charts.

`DUPLICATE_POLICY LAST` doesn't help here: it deduplicates at the same `(key, timestamp)`, but reorged blocks have new timestamps.

**Solution.** Defer Redis commits until the block is past SQD's finality window:

1. At head (`ctx.isHead === true`), volume payloads are written to `pending_redis_ts_commit` via `ctx.store` **inside the SQD transaction**. Reorgs roll these rows back for free, alongside all other batch state.
2. A drainer (`setInterval` in the indexer process) polls every `REDIS_TS_DRAINER_POLL_INTERVAL_MS`, reads `processor_status.latest_processed_block`, and selects pending rows where `para_block_height <= latest_processed_block - (BLOCKS_FINALITY_OFFSET + REDIS_TS_DRAINER_FINALITY_SAFETY_MARGIN)`.
3. The drainer enqueues a single `commitAssetPriceVolume` Bull job containing the batch of payloads, then deletes the pending rows.

Because the drainer only reads rows for blocks SQD considers finalized (`setFinalityConfirmation(BLOCKS_FINALITY_OFFSET)`), SQD will never try to roll back a row the drainer has already deleted — the read filter aligns with SQD's hot block retention.

**Historical sync (`ctx.isHead === false`)**: drainer is bypassed. `submitVolume` enqueues directly to Bull as before. Reorgs don't happen during historical sync because SQD only releases historical blocks once they're past finality.

**Prices and balances are unchanged.** The drainer is volume-only. Prices/balances retain the original direct-Bull commit path — `DUPLICATE_POLICY LAST` masks their reorg duplicates because price charts use `AVG` (last value wins visually) and balance series are snapshots (latest wins). Volume is the only series where doublecounting is materially visible to users, so it's the only one paying the freshness cost.

**Idempotency on reorg replay.** Pending row id is deterministic: `commitAssetPriceVolume:<lo>:<hi>:<paraBlockHeight>` where `lo`/`hi` are the asset registry ids sorted numerically. Reorg replay re-saves with the same id → SQD's `ctx.store.save` upserts → no duplicate rows. The `payload` JSONB is overwritten with the post-reorg version; the drainer eventually sees the final canonical value.

**At-least-once delivery from drainer.** If the drainer crashes between Bull enqueue and pending row delete, the next tick re-enqueues the same payload. The Redis time series write uses the same `(seriesKey, blockTimestamp)`; `DUPLICATE_POLICY LAST` collapses it to a single sample. Same-timestamp guarantee holds because the payload's timestamp is derived from the (finalized, stable) block entity, not from "now".

## Code map

- `src/model/generated/pendingRedisTsCommit.model.ts` — entity. Fields: `id`, `jobName`, `paraBlockHeight`, `sampleTimestampMs`, `payload` (jsonb), `createdAt`. Indexes on `jobName` and `paraBlockHeight`.
- `db/migrations/1778608574139-Data.js` — migration creating `pending_redis_ts_commit` table.
- `src/utils/redisSupport/redisTimeSeriesSupport/pendingCommitsPgClient.ts` — raw-pg client for the drainer. `getLatestProcessedBlock`, `fetchPendingCommits`, `deletePendingCommits`. Uses `CommonPgPool`; does NOT use `ctx.store` (drainer runs outside SQD batches).
- `src/utils/redisSupport/redisTimeSeriesSupport/timeSeriesDataCommitManager.ts:submitVolume` — head-vs-historical router. At head + drainer enabled, saves `PendingRedisTsCommit` via `ctx.store`. Otherwise, direct Bull enqueue.
- `src/utils/redisSupport/redisTimeSeriesSupport/timeSeriesDataCommitManager.ts:startDrainer` — `setInterval` lifecycle, called once from `main.ts`.
- `src/utils/redisSupport/redisTimeSeriesSupport/timeSeriesDataCommitManager.ts:drainOnce` — single drain pass. Computes cutoff, loops fetching batches of `REDIS_TS_DRAINER_BATCH_SIZE` until `rows.length < batchSize`.
- `src/utils/redisSupport/redisTimeSeriesSupport/timeSeriesDataCommitManager.ts:flushPendingCommitRows` — builds the Bull job, enqueues, returns rows only if enqueue succeeded (so they get deleted).
- `src/utils/redisSupport/redisTimeSeriesSupport/timeSeriesDataCommitManager.ts:buildPendingVolumeId` — id construction. Sorted asset ids → deterministic across reorg replays.
- `src/handlers/historicalData/index.ts:commitAssetsPairVolumeToRedisTimeSeries` — caller; one `submitVolume` per payload.
- `src/main.ts` — `startDrainer()` called once after `initCommiter()`.
- `src/processor.ts:77` — `setFinalityConfirmation(appConfig.BLOCKS_FINALITY_OFFSET)`. This is the SQD-side bound the drainer's cutoff aligns to.
- `src/appConfig.ts` (`RedisConfig`) — env vars listed below.

## Configuration

| Env var | Default | Effect |
|---|---|---|
| `BLOCKS_FINALITY_OFFSET` | (existing, prod=50) | SQD hot block window. Drainer cutoff = `latestProcessedBlock - (BLOCKS_FINALITY_OFFSET + REDIS_TS_DRAINER_FINALITY_SAFETY_MARGIN)`. |
| `REDIS_TS_VOLUME_DRAINER_ENABLED` | `true` | Kill switch. If `false`, volumes use the old direct-Bull path at head too. |
| `REDIS_TS_DRAINER_POLL_INTERVAL_MS` | `5000` | Drainer tick cadence. |
| `REDIS_TS_DRAINER_BATCH_SIZE` | `1000` | Max pending rows per drain pass. Drainer loops within a tick until the table drains below this. |
| `REDIS_TS_DRAINER_FINALITY_SAFETY_MARGIN` | `5` | Extra blocks added to `BLOCKS_FINALITY_OFFSET` for the cutoff. Cheap insurance against off-by-one with SQD's hot window. |
| `REDIS_TS_DRAINER_AWAIT_BULL_ACK` | `false` | If `true`, `drainOnce` calls `job.finished()` after enqueue — blocks until the Bull consumer actually writes to Redis. Default `false` favors liveness (lose a sample on Bull failure rather than block the drainer). |

## Gotchas

- **Drainer cutoff must be ≥ `BLOCKS_FINALITY_OFFSET`.** SQD will never roll back blocks older than this. If you ever reduce `BLOCKS_FINALITY_OFFSET` without checking the drainer config, you risk the drainer touching rows SQD might still roll back, which would produce SQD rollback errors. Treat `REDIS_TS_DRAINER_FINALITY_SAFETY_MARGIN >= 5` as the contract.
- **Drainer uses raw pg, not `ctx.store`.** Pending row deletes are NOT logged in `hot_block_logs`. This is intentional — SQD has nothing to roll back because the row is for a finalized block, and SQD has already pruned its own hot block log for that height. Don't "fix" this by switching to `ctx.store` (it has no batch context outside a handler).
- **`ctx.isHead` is the head signal, NOT `ctx.blocks.length < 2`.** SQD sets `isHead` based on its own knowledge of chain head proximity. Historical batches can occasionally be size 1 (gaps in event matches), and head batches can occasionally be size 2 (block arrives during prior batch).
- **Drainer keeps running even when `ctx.isHead === false`.** Important after a long pause/restart: pending rows from the pre-pause head period are now far behind head and need flushing. The drainer's tick doesn't care what the indexer is currently doing.
- **No drainer shutdown hook is wired today.** `setInterval` is torn down with the process. If you add a graceful shutdown path, call `shutdownDrainer()` to await any in-flight drain pass (`isDraining` flag).
- **Reorgs deeper than `BLOCKS_FINALITY_OFFSET` (50) are out of scope.** If one ever happens, some drained rows are already in Redis at the now-stale chain's timestamps, and SQD itself can't recover without manual intervention. Cleanup path: `clearTimeSeriesByKeyPrefixAndTimeRange` for the affected timestamp range. Monitor reorg depth (`createReorgTracker` in `src/utils/prometheusMetrics.ts`) and alarm if it approaches the offset.
- **`AWAIT_BULL_ACK = true` will block the drainer behind the Bull consumer.** If consumers stall (Redis time series slow, network blip), pending rows accumulate. Default `false` matches the operational preference: lose a sample over block the drainer.
- **`Queue.add()` itself is a Redis write.** Even with `AWAIT_BULL_ACK = false`, the drainer awaits the enqueue. If Bull's Redis is down, the drainer's `addNewDataCommitterJob` rejects; pending rows stay; next tick retries. Self-healing — no manual intervention.
- **Drainer can lap itself.** `isDraining` flag prevents overlapping ticks. If a single drain takes longer than `REDIS_TS_DRAINER_POLL_INTERVAL_MS`, subsequent ticks no-op until the current one finishes.
- **The pending table will be empty during historical sync.** Don't be surprised if you see no rows for hours after a fresh reindex — the indexer takes the direct-Bull path (`isHead = false`) and writes nothing to `pending_redis_ts_commit`. Rows only appear once the indexer reaches head.

## Flow diagram (head path)

```
Indexer batch (ctx.isHead = true)
    │
    ├─ commitAssetsPairVolumeToRedisTimeSeries
    │     └─ submitVolume per pair
    │           └─ ctx.store.save(PendingRedisTsCommit)  ← inside SQD tx
    │                  → rolled back automatically on reorg
    │
SQD commits batch → processor_status.latest_processed_block updated

(some time later, on drainer tick)

Drainer (setInterval)
    ├─ PendingCommitsPgClient.getLatestProcessedBlock()
    ├─ cutoff = latest - (BLOCKS_FINALITY_OFFSET + 5)
    ├─ fetchPendingCommits(cutoff, batchSize)
    ├─ flushPendingCommitRows
    │     └─ BullQueueClient.dataCommitterQueue.add(commitAssetPriceVolume, ...)
    └─ deletePendingCommits(rowIds)

Bull consumer (in indexer process, see redis-queue-bull.md)
    └─ commitAssetPriceVolumeJobHandler
          └─ RedisTimeSeriesManager.addMultiplePrices
                → TS.MADD with DUPLICATE_POLICY LAST
```

## Examples

**Disable drainer in an emergency**
```
REDIS_TS_VOLUME_DRAINER_ENABLED=false
```
Volumes immediately fall back to direct Bull at head — same behavior as prices/balances, doublecounting risk returns. Use only if the pending table is causing operational issues.

**Investigate "no recent volume samples in Redis"**
1. Check `SELECT COUNT(*), MAX(para_block_height) FROM pending_redis_ts_commit;` — is the drainer draining?
2. Check `SELECT latest_processed_block FROM processor_status;` — is the indexer making progress?
3. Compute cutoff manually: `latest - (BLOCKS_FINALITY_OFFSET + 5)`. Rows above cutoff are correctly waiting.
4. Check indexer logs for `TimeSeriesDataCommitManager::drainOnce error`.
5. Check Bull queue: `dataCommitterQueue.getJobs(['failed'])`.

**Investigate "doublecounting still happening"**
1. Confirm `ctx.isHead` is `true` when the affected block was processed (log it).
2. Confirm `REDIS_TS_VOLUME_DRAINER_ENABLED` was `true` at the time.
3. Inspect samples in Redis: `TS.RANGE ts:<INDEXER_ID>:volume:<a>:<b> <start> <end>`. Two samples at different timestamps for the same on-chain event ⇒ either (a) reorg deeper than offset, or (b) drainer was disabled, or (c) historical sync path was taken when it shouldn't have been (check `isHead`).