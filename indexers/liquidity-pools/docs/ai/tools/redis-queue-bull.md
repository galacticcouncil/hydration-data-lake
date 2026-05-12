---
name: Redis-backed Bull queues
description: Two Bull queues — DATA_COMMITTER (writes time series samples) and PROCESSING_POOL (API-side historical scraping) — both backed by the Redis time series DB.
audience: ai-agent, human
related:
  - ../tools/redis-timeseries.md
  - ../flows/redis-volume-drainer.md
---

# Redis-backed Bull queues

## When to read this
- Touching `src/utils/redisSupport/redisTimeSeriesSupport/queueClient.ts`, `timeSeriesDataCommitManager.ts`, or `timeSeriesApiSupportManager.ts`.
- Adding a new Bull job type or producer.
- Debugging "data didn't reach Redis time series" — start by checking the queue.
- Designing flows that need to defer Redis writes outside the SQD batch transaction.

## Concepts

Two independent Bull queues, both connected to the same Redis instance that hosts the time series module (`TS_REDIS_HOST` / `TS_REDIS_PORT`, db `TS_REDIS_KEY_SPACE_ID`).

| Queue | Name template | Job names | Producer | Consumer |
|---|---|---|---|---|
| `dataCommitterQueue` | `${INDEXER_ID}_DATA_COMMITTER` | `commitAssetPriceVolume`, `commitAccountTotalBalance` | Indexer (and drainer); also API for backfill jobs | Indexer process (`TimeSeriesDataCommitManager.initCommiter`) |
| `assetPriceScrapperQueue` | `${INDEXER_ID}_PROCESSING_POOL` | `assetPriceHistData`, `accountTotalBalancesHistData` | API process (`TimeSeriesApiSupportManager.initHistDataScraper`) | API process (self-consumed; produces follow-up `commitAssetPriceVolume` / `commitAccountTotalBalance` jobs onto the committer queue) |

**Why two producers for the committer queue.** Time series samples can be committed from two independent paths:
1. **Indexer hot path** — `commitAssetPricesToRedisTimeSeries`, `commitAssetsPairVolumeToRedisTimeSeries`, `commitAccountTotalBalancesToRedisTimeSeries` in `src/handlers/historicalData/index.ts`. Runs during block processing; preferred path because data is in memory.
2. **API backfill path** — `TimeSeriesApiSupportManager` periodically scrapes historical rows from Postgres and re-enqueues commit jobs. Coverage net: catches anything the indexer didn't commit (e.g. due to crashes, feature toggles that were off, prior backfills). Mostly redundant when the indexer is healthy.

Both paths land on `dataCommitterQueue`. Idempotency relies on Redis time series `DUPLICATE_POLICY LAST` (see `redis-timeseries.md`) — two writes at the same `(seriesKey, timestamp)` collapse to one sample. The same-timestamp guarantee holds because both paths derive the timestamp from `block.timestamp.getTime()`, which is stable per finalized block height.

**Queue lifecycle.** `BullQueueClient` is a singleton (`getInstance()`) constructed lazily at first use. `Queue.add()` is the producer call; consumers are registered via `queue.process(jobName, concurrency, handler)`. Concurrency is **1** for both committer job types (intentional — protects Redis from concurrent `TS.MADD` storms and keeps `api_state` updates serial).

**Job options used today.**
- `jobId: crypto.randomUUID()` — unique per enqueue, so the same logical payload enqueued twice produces two jobs. Bull-level dedup is NOT relied on; idempotency lives at the Redis time series layer (`DUPLICATE_POLICY LAST`).
- `removeOnComplete: true` — completed jobs are immediately deleted. No completed-job table to query later.
- `delay` — only used by the scrapper queue (`TIME_SERIES_DATA_SCRAPPER_TIMEOUT_MS`, default 5s) to space out backfill ticks.

## Code map

- `src/utils/redisSupport/redisTimeSeriesSupport/queueClient.ts` — `BullQueueClient` singleton, queue construction, `setDataCommitterJob` / `setScrapperNextTickJob` enqueue methods, `wipeScrapperQueue` / `cleanUpScrapperNextTickJobs` admin helpers.
- `src/utils/redisSupport/redisTimeSeriesSupport/queueClient.ts:16` — `DataCommitterJobName` enum (`commitAssetPriceVolume`, `commitAccountTotalBalance`).
- `src/utils/redisSupport/redisTimeSeriesSupport/queueClient.ts:11` — `HistDataScrapperJobName` enum (`assetPriceHistData`, `accountTotalBalancesHistData`).
- `src/utils/redisSupport/redisTimeSeriesSupport/queueClient.ts:25` — `DataCommiterJobData` shape: `actionName`, optional `priceVolumeDataMany` / `accountTotalBalanceMany`, optional `*LatestProcessedBlock`, `metadata.requestSender: 'processor' | 'api'`.
- `src/utils/redisSupport/redisTimeSeriesSupport/timeSeriesDataCommitManager.ts:initCommiter` — registers committer-queue consumers (concurrency 1 per job type).
- `src/utils/redisSupport/redisTimeSeriesSupport/timeSeriesDataCommitManager.ts:addNewDataCommitterJob` — thin wrapper around `setDataCommitterJob`, used by indexer hot path and drainer.
- `src/utils/redisSupport/redisTimeSeriesSupport/timeSeriesApiSupportManager.ts:initHistDataScraper` — API-side scrapper loop bootstrap (registers consumers, seeds the first delayed tick job).
- `src/api.ts:246` — API process entry point that kicks off `initHistDataScraper`.

## Gotchas

- **`Queue.add` only awaits the enqueue write, not job execution.** `setDataCommitterJob` returns once Bull has persisted the job into Redis. The actual time series write happens later on the consumer side. Callers that need execution confirmation must call `job.finished()` themselves (e.g. the volume drainer's `REDIS_TS_DRAINER_AWAIT_BULL_ACK` mode).
- **Consumer concurrency is 1.** Adding parallelism here risks race conditions on `api_state` (`upsertApiState` is a read-modify-write) and increases `TS.MADD` pressure. If higher throughput is needed, batch larger jobs rather than parallelising consumers.
- **Scrapper queue is wiped on every API startup.** `initHistDataScraper` calls `wipeScrapperQueue` before seeding the first tick. Any in-flight scrapper jobs at restart are lost — fine, because the scrapper resumes from `api_state.assetPriceLatestProcessedBlock` / `accTotalBalanceLatestProcBlock`, which the consumer updates as it makes progress.
- **`api_state` is a Postgres table, not Redis state.** Two queue consumers update it: the committer (`assetPriceLatestProcessedBlock` / `accTotalBalanceLatestProcBlock` via `upsertApiState`) and the scrapper (its next-tick block height). These writes happen *outside* any SQD transaction — they are the API process's view of "how far we've reached", not the indexer's.
- **`metadata.requestSender`** distinguishes indexer-originated jobs (`'processor'`) from API-originated jobs (`'api'`). Used today only for observability; if you add per-source behavior, look here.
- **The committer queue has two producers but ONE consumer process.** Today the indexer process owns committer-queue consumption (via `initCommiter` called from `main.ts`). The API process only produces onto it. Don't add `queue.process(...)` for committer jobs in `src/api.ts` — you'll double-consume and break the concurrency-1 invariant.
- **No retry policy is configured.** Bull defaults apply: a job that throws is moved to `failed` and not retried. With `removeOnComplete: true` (no `removeOnFail`), failed jobs accumulate in Redis. Monitor via Bull dashboard or `dataCommitterQueue.getJobs(['failed'])` if you suspect silent loss.
- **Both queues share Redis with the time series data.** Heavy Bull traffic and heavy `TS.RANGE` queries hit the same Redis instance. Backpressure on time series reads can starve queue ops and vice versa.

## Examples

**Producer: indexer hot path (volume commit, historical sync)**
```ts
await TimeSeriesDataCommitManager.getInstance().addNewDataCommitterJob({
  actionName: DataCommitterJobName.commitAssetPriceVolume,
  priceVolumeDataLatestProcessedBlock: latestBlock,
  priceVolumeDataMany: volumesData,  // AddMultiplePricesPayload[]
  metadata: {
    commitRequestedAtParaBlock: ctx.blocks.at(-1)!.header.height,
    requestSender: 'processor',
  },
});
```

**Producer: indexer head path (volume commit goes through the drainer)**
See `../flows/redis-volume-drainer.md`. At head, `submitVolume` writes to `pending_redis_ts_commit` via `ctx.store` instead of enqueueing directly; the drainer enqueues the Bull job later, after the block has aged past `BLOCKS_FINALITY_OFFSET`.

**Consumer: committer job (price+volume)**
- Defined in `timeSeriesDataCommitManager.ts:commitAssetPriceVolumeJobHandler`.
- Splits `priceVolumeDataMany` into sub-batches of `TIME_SERIES_DATA_COMMIT_SUB_BATCH_MAX_SIZE` (default 1000), calls `RedisTimeSeriesManager.addMultiplePrices` per sub-batch.
- Updates `api_state.assetPriceLatestProcessedBlock` after writes complete (gated by `ENABLE_REDIS_TS_UPDATE_COMMIT_DATA_COUNTER_ON_COMMIT`).

**Admin: clear stuck scrapper jobs**
```ts
await BullQueueClient.getInstance().cleanUpScrapperNextTickJobs(
  HistDataScrapperJobName.assetPriceHistData
);
```
Use sparingly — only when the scrapper is wedged on a known-bad job. The normal recovery path is API restart, which calls `wipeScrapperQueue`.