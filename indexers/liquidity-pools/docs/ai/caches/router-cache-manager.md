---
name: RouterCacheManager — head-mode route cache for spot price calculation
description: App-lifecycle cache of best-spot-price routes (Map<routeKey, Hop[]>) reused across consecutive head batches. Active only when batch size is 1; off in historical sync where blocks are processed in parallel. Up to ~60% spot-price calculation speedup at head.
audience: ai-agent, human
related:
  - ../domain/spot-prices.md
  - ../architecture/batch-processing.md
---

# RouterCacheManager

## When to read this

- Touching `RouterCacheManager` or `OfflineTradeRouterManager.getBestSpotPriceWitRoute` in `src/handlers/assets/assetHistoricalData/utils/offlineTradeRouterManager/index.ts`.
- Investigating spot-price calculation latency at head vs during historical sync.
- Tuning `ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION` or `CACHED_ROUTES_FOR_PRICE_CALCULATION_TTL_BLOCKS`.
- Adding a new pool type that changes which routes the Router builds.
- Debugging "stale" routes that point at a pool that has since been destroyed or had its reserves shift significantly.

## Concepts

The indexer prices assets through the SDK Router (`TradeRouter` from the Hydration SDK). Each `getBestSpotPriceWitRoute(assetIn, assetOut)` call internally traverses the route graph — pools, hops, asset adjacencies — to find the best path. That graph traversal is the dominant cost of pricing at head, where the indexer processes one block at a time and re-prices every tracked asset on every block.

**Observation:** between two consecutive blocks, the route graph almost never changes. New pools are rare, destructions are rare, asset registrations are rare. The reserves inside each pool change, but the **shape** of the best route between two assets typically stays the same. Reusing the previously-computed `Hop[]` and only recomputing prices along those hops is dramatically cheaper than rebuilding the route from scratch.

`RouterCacheManager` is the cache that captures this:

| Field | Type | Lifetime | Meaning |
|---|---|---|---|
| `mlrCached` | `Map<routeKey, Hop[]>` | App lifecycle (with periodic wipe) | Best-route hop list keyed by `routeKey` (a deterministic string identifying the `(assetIn, assetOut)` pair). |
| `cacheInvalidatedAtBlock` | `number` | App lifecycle | Block height at which the cache was last wiped. Used to enforce the TTL. |

### Two modes — head vs historical

The wipe policy in `RouterCacheManager.wipeCache(ctx)` discriminates by batch shape, not by config:

| Batch shape | Wipe behaviour | Net effect |
|---|---|---|
| `ctx.blocks.length === 0` | Wipe immediately, reset `cacheInvalidatedAtBlock = 0`. | Defensive — should not occur in normal flow. |
| `ctx.blocks.length > 1` (historical sync) | **Wipe every batch**, set `cacheInvalidatedAtBlock = lastBlockHeight`. | Cache is effectively disabled during historical sync. |
| `ctx.blocks.length === 1` (head) | Wipe only if `currentBlock - cacheInvalidatedAtBlock > CACHED_ROUTES_FOR_PRICE_CALCULATION_TTL_BLOCKS`. | Cache is reused across consecutive head batches; refreshed on a rolling TTL window. |

**Why historical sync skips the cache:** SQD processes historical batches of up to 800 blocks. Within a batch, blocks can be processed in any order (in particular `initForBlocksBatch` parallelises router construction across all blocks via `Promise.all`). The cache is a single `Map` shared by every concurrent caller. There is no clean way to invalidate it per-block in the right order without serialising the whole batch, which would defeat the parallelism. Wiping every batch was chosen as the simple, correct option — the cost of rebuilding routes per batch is amortised across hundreds of blocks in that batch anyway.

**Why head benefits so much:** at head, batches are typically size 1 — a single block. The handler is called once per block, prices every tracked asset, and the route shapes are almost always identical to the previous block. Reusing them avoids re-traversing the route graph for every asset on every block. Measured impact: **up to ~60% reduction in spot-price calculation time**.

### Read path

`OfflineTradeRouterManager.getBestSpotPriceWitRoute` (lines 161–206 of `src/handlers/assets/assetHistoricalData/utils/offlineTradeRouterManager/index.ts`):

1. If `ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION` is `false`, call the SDK directly and return. Cache is bypassed entirely.
2. Otherwise, call `routerInstance.getBestSpotPriceWitRoute(assetIn, assetOut, mlrCached)` — passing the cache map as a hint. The SDK's `TradeRouter` is cache-aware: if a hop list exists for the `(assetIn, assetOut)` route key, it reuses that hop list and only recomputes the spot price along those hops.
3. If that throws (e.g. cached hop list now points at an asset/pool that no longer exists), fall through to the **non-cached** path: `routerInstance.getBestSpotPriceWitRoute(assetIn, assetOut)` without the cache argument. The SDK rebuilds the route from scratch.
4. On success (either path), store the result back into `mlrCached` under its `routeKey`. The next call for the same pair reuses it.

### Write path

There is no explicit write path beyond step 4 above. The cache is **populated lazily** as `getBestSpotPriceWitRoute` is called for each asset pair in each block. The first head batch after a wipe pays the full cost; subsequent batches within the TTL window read mostly from the cache.

## Code map

- `src/handlers/assets/assetHistoricalData/utils/offlineTradeRouterManager/index.ts:17` — `RouterCacheManager` class definition.
- `src/handlers/assets/assetHistoricalData/utils/offlineTradeRouterManager/index.ts:31` — `wipeCache(ctx)` with the head-vs-historical branching.
- `src/handlers/assets/assetHistoricalData/utils/offlineTradeRouterManager/index.ts:161` — `getBestSpotPriceWitRoute` read path with cache-then-fallback.
- `src/handlers/assets/assetHistoricalData/utils/offlineTradeRouterManager/index.ts:190` — the cache-hint call (`getBestSpotPriceWitRoute(..., mlrCached)`).
- `src/handlers/assets/assetHistoricalData/utils/offlineTradeRouterManager/offlineTradeRouterManagerHelper.ts` — sibling class for prefetching historical data the offline SDK needs.
- `src/appConfig.ts` — `ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION`, `CACHED_ROUTES_FOR_PRICE_CALCULATION_TTL_BLOCKS`.

Grep landmarks: `RouterCacheManager`, `mlrCached`, `cacheInvalidatedAtBlock`, `getBestSpotPriceWitRoute`.

## Configuration

| Env var | Default | Effect |
|---|---|---|
| `ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION` | (see `appConfig.ts`) | Master switch. When `false`, the cache is bypassed entirely and every spot-price call goes straight to the SDK. Use only when investigating a suspected cache-poisoning bug. |
| `CACHED_ROUTES_FOR_PRICE_CALCULATION_TTL_BLOCKS` | (see `appConfig.ts`) | At head, the cache is wiped if `currentBlockHeight - cacheInvalidatedAtBlock > TTL`. Higher value = longer reuse, lower CPU, higher risk of using stale routes after pool topology changes. |

## Gotchas

- **Cache is wiped on every historical batch.** Don't assume the cache is "warm" during reaggregation or initial sync. It isn't. The cache is essentially a head-only optimisation.
- **`ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION = false` short-circuits at line 184**, BEFORE the cache map is consulted. Disabling does not just stop writes — it also stops reads. There is no "warm but don't update" mode.
- **The SDK can throw if a cached hop list references a since-destroyed pool / removed asset.** The fallback path (lines 193–196) catches this and rebuilds the route. If you see frequent fallbacks in logs, the TTL may be too high relative to pool churn — consider lowering `CACHED_ROUTES_FOR_PRICE_CALCULATION_TTL_BLOCKS`.
- **`mlrCached` is a single shared Map.** Reads/writes during the same batch are racy under parallel iteration. This is safe at head because head batches are size 1 — the handler processes blocks serially. It would NOT be safe under historical-mode parallelism, which is precisely why `wipeCache` zero-disables itself on `blocks.length > 1`.
- **Wipe is keyed off `ctx.blocks.length`, not `ctx.isHead`.** A head batch that exceptionally contains 2 blocks (block arrived during prior batch) will trigger the full-wipe historical branch and lose the cache for that tick. Cache will re-warm on the next size-1 batch. This is intentional — correctness over a single batch's throughput.
- **`cacheInvalidatedAtBlock = 0` initially.** On the very first batch after process start, `currentBlock - 0` is always greater than any sane TTL, so the cache wipes on the first head call. This is fine — the cache was already empty.
- **The cache is NOT in `LatestProcessedDataCacheManager` and does NOT participate in its prefetch flow.** It's a separate singleton, populated lazily by the read path. Don't add cross-cache invalidation hooks "for safety" — the wipe-on-batch-shape policy is the entire invalidation strategy.
- **Removed dead field `mlrCachedPerBlock`.** An earlier attempt to also cache per-block in historical mode lived on this class but was never wired up. Deleted; do not re-add without a working invalidation strategy for parallel block processing.

## Examples

### Verifying the cache is active at head

Add a log inside `getBestSpotPriceWitRoute` after line 190:

```ts
console.log(`route cache size=${RouterCacheManager.getInstance().mlrCached.size}`);
```

At head you should see the size grow on the first block, then stay roughly constant (or grow slowly as new asset pairs are priced) for `CACHED_ROUTES_FOR_PRICE_CALCULATION_TTL_BLOCKS` blocks, then snap back to a small number after a wipe.

### Disabling the cache for a comparison run

Set `ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION=false`. Compare per-block batch duration in `support.app_logs` (the `prices` action_type rows). Expect ~2–3x slower spot-price calculation at head.

### Investigating "wrong price after a pool destruction"

If a pool is destroyed at block N and the wrong price appears at block N+1, check:

1. Was the destruction handled in the same batch that priced N+1? If yes, this isn't a cache issue.
2. If different batches: the cached hop list for the destroyed pool's pair may have been reused. The fallback should have caught it (the destroyed pool would make the cached lookup throw). If the fallback didn't trigger, the SDK is treating a destroyed pool as live — that's an SDK bug, not a cache bug. File against the SDK or the destruction handler, not here.
3. To rule the cache in/out quickly: re-run with `ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION=false` and see if the wrong price persists.