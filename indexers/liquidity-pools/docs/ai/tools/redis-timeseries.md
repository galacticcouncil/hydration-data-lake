---
name: Redis TimeSeries (prices, volumes, balances)
description: Bucketed time series storage for asset prices, asset-pair volumes, and account total balances. Read by chart APIs, written by indexer and API backfill.
audience: ai-agent, human
related:
  - ./redis-queue-bull.md
  - ../flows/redis-volume-drainer.md
---

# Redis TimeSeries

## When to read this
- Touching `src/utils/redisSupport/redisTimeSeriesManager/`.
- Adding a new series type (new `RedisTimeSeriesName` enum value) or changing a key structure.
- Investigating wrong chart values (gaps, duplicates, doublecounting).
- Writing a Redis time series migration in `redisTimeSeriesManager/migrations.ts`.
- Designing any write path that lands data in TS keys — must understand the dedup/idempotency rules.

## Concepts

Redis TimeSeries module (`@redis/time-series`) stores three categories of bucketed data:

| Series name (`RedisTimeSeriesName`) | Aggregation in charts | Key format | Sample shape |
|---|---|---|---|
| `price` | `AVG` per bucket | `ts:<INDEXER_ID>:price:<assetAId>:<assetBId>` | One sample per pair per block where price changed |
| `volume` | `SUM` per bucket | `ts:<INDEXER_ID>:volume:<assetAId>:<assetBId>` | One sample per pair per block with trading activity |
| `acc_bal_tot_tns` / `acc_bal_tot_loc` / `acc_bal_tot_debt` | `AVG` per bucket | `ts:<INDEXER_ID>:<name>:<accountId>` | One sample per account per balance-change block |

Keys are namespaced by `INDEXER_ID` so multiple indexer instances (mainnet, paseo, etc.) coexist in one Redis DB if needed.

**Pair ordering for volume keys.** Asset pair keys are NOT canonical-ordered at the key level — `volume:5:10` and `volume:10:5` are distinct keys. Consumers handle this by querying both directions or via the `volPair` label (sorted: `${lower}:${higher}`) using `TS.MRANGE` filter. Writers should pick a deterministic order at write time; the volume drainer flow uses sorted-by-numeric-id (`+a < +b ? a : b`).

**Sample timestamp = `block.timestamp.getTime()`** (wallclock ms). All write paths derive timestamps from the canonical para block entity, never from "now". Reorg-safety relies on this: a reorged block keeps its (new) timestamp when re-emitted, and `DUPLICATE_POLICY LAST` collapses old + new samples at the same timestamp.

**`DUPLICATE_POLICY LAST` is set on every series at creation** (`ensureTimeSeries`). This makes re-writes at the same `(key, timestamp)` a value-replace, not a new sample. Essential for:
- At-least-once Bull job delivery (drainer retries after crash).
- API-side backfill re-emitting the same sample the indexer already wrote.
- Reorg replay where a block's volume is recomputed and re-emitted at the same timestamp.

**It does NOT protect against** re-writes at *different* timestamps (e.g. a reorged block whose new wallclock time differs from the old one — would create two samples). The volume drainer flow (`flows/redis-volume-drainer.md`) is the defense against that.

**Series labels.** Set at creation for filtering in `TS.MRANGE`:
- `indVer = <INDEXER_ID>` on every series.
- Price/volume series: `astAId`, `astBId`, `name`, `volPair = sorted(astAId, astBId)`.
- Balance series: `accountId`, `name`.

**Migrations.** `RedisTimeSeriesMigrationsManager` runs declared migrations on indexer startup (`initClientAndRunMigrations`). Use it for one-time data cleanup (range deletes, key renames, retention changes). Migrations live in `redisTimeSeriesManager/migrations.ts` and are tracked in a Redis hash so each runs exactly once.

## Code map

- `src/utils/redisSupport/redisTimeSeriesManager/index.ts` — `RedisTimeSeriesManager` singleton; all reads and writes go through this class.
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:29` — `RedisTimeSeriesName` enum (`price`, `volume`, `acc_bal_tot_tns`, `acc_bal_tot_loc`, `acc_bal_tot_debt`).
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:48` — `AddMultiplePricesPayload` (used for both prices and volumes).
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:57` — `AddMultipleAccountTotalBalancesPayload`.
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:154` — `getSeriesKey` — canonical key construction. Match this format when writing migrations or admin scripts.
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:203` — `ensureTimeSeries` — idempotent series creation with `DUPLICATE_POLICY LAST` and labels.
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:274` — `addMultiplePrices` — bulk write (used by both `price` and `volume` series).
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:322` — `addMultipleAccountTotalBalances` — bulk write for balance series.
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:359` — `getPricesAndVolumesFromTimeSeries` — read path used by chart resolvers.
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:510` — `getAccTotalBalancesFromTimeSeries` — balance chart read path.
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:611` — `clearTimeSeriesByKeyPrefix` — wipes all keys matching prefix. Migration utility — do NOT use in hot paths.
- `src/utils/redisSupport/redisTimeSeriesManager/index.ts:650` — `clearTimeSeriesByKeyPrefixAndTimeRange` — range delete across all keys. Migration utility — do NOT use in hot paths.
- `src/utils/redisSupport/redisTimeSeriesManager/migrations.ts` — declared migrations array.
- `src/utils/redisSupport/redisTimeSeriesManager/migrationsManager.ts` — runner; tracks applied migrations in Redis.

## Gotchas

- **Two producer paths share these keys.** The indexer process commits during block processing (`historicalData/index.ts:commitAssetPricesToRedisTimeSeries`, `commitAssetsPairVolumeToRedisTimeSeries`, `commitAccountTotalBalancesToRedisTimeSeries`). The API process runs a periodic scrapper (`TimeSeriesApiSupportManager.initHistDataScraper`, started from `src/api.ts:246`) that reads historical Postgres rows and re-emits commit jobs as a coverage net. Both target the same keys. Idempotency = `DUPLICATE_POLICY LAST` + timestamps derived deterministically from block entities. **Prefer the indexer hot path** — the API scrapper exists to catch gaps, not as the primary write path.
- **Changing key structure loses access to existing data.** Renaming `ts:<INDEXER_ID>:price:<a>:<b>` to anything else means existing samples are orphaned at the old key. No automatic migration. If you need to restructure, write a migration that copies samples to the new key (with `TS.RANGE` + `TS.MADD`) before changing writers.
- **`DUPLICATE_POLICY` is a per-series setting, NOT a key setting.** It can be altered on an existing series with `TS.ALTER <key> DUPLICATE_POLICY LAST` without touching samples. New series are already created with `LAST` via `ensureTimeSeries`. Pre-existing series from before this was added may have the default `BLOCK` policy — verify with `TS.INFO`.
- **`ensureTimeSeries` swallows "key already exists" errors but throws on "key exists but is not a TimeSeries".** The latter would only happen if someone manually set a plain key at the same path. Bug fix path: delete the offending key.
- **The Volume `getSeriesKey` default `assetBId = '10'`.** `'10'` is DOT. This is a legacy default — explicit `assetBId` is always passed today, but if you write a new caller, set it explicitly.
- **Reaggregation flows skip `correlateAssetSpotPrices`** (per `CLAUDE.md` rule 9). They read prices from DB rather than computing them, so they hit `RedisTimeSeriesManager` with already-derived values. Don't add fresh price-derivation logic into the time series read path.
- **Series retention is 0** = infinite. Disk and memory grow forever. If retention becomes a concern, change `RETENTION: 0` in `ensureTimeSeries` AND write a migration to set retention on existing series via `TS.ALTER`.
- **NaN samples come from `EMPTY: true` aggregations.** `getPricesAndVolumesFromTimeSeries` and balance reads request `EMPTY: true` so charts get a continuous timeline. Empty buckets return `NaN`. Balance reads call `fillNaNWithPrevious`; price/volume reads return `NaN` to the caller — chart resolvers handle it.
- **`TS.MRANGE` filters by labels, not key globs.** Adding a new label requires backfilling it on existing series via `TS.ALTER ... LABELS`. New series get the label for free via `ensureTimeSeries`.

## Examples

**Read prices+volumes for a pair across a time range**
```ts
const result = await RedisTimeSeriesManager.getInstance()
  .getPricesAndVolumesFromTimeSeries({
    assetInId: '5',
    assetOutId: '10',
    startTimestamp,
    endTimestamp,
    indexerId: appConfig.INDEXER_ID,
    bucketSizeMs: 60_000,  // 1-minute buckets, AVG for price, SUM for volume
  });
// result.priceData: Map<'<a>:<b>', Map<timestamp, sample>>
// result.volumeData: Map<timestamp, sample>
```

**Write a single sample (rare — prefer batch writers)**
```ts
await RedisTimeSeriesManager.getInstance().addToTimeSeries({
  name: RedisTimeSeriesName.price,
  assetAId: '5',
  assetBId: '10',
  timestamp: blockTimestampMs,
  value: 1.234,
  keyPrefix: appConfig.INDEXER_ID,
});
```

**Range delete (migration only)**
```ts
await RedisTimeSeriesManager.getInstance()
  .clearTimeSeriesByKeyPrefixAndTimeRange({
    keyPrefix: appConfig.INDEXER_ID,
    fromTimestamp,
    toTimestamp,
  });
```
Crash between this call and a follow-up re-write would leave a permanent gap. Only use from migration scripts where reapply-on-failure is safe.