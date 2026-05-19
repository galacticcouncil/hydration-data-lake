---
name: API CacheManager
description: Singleton two-tier (in-memory LRU + Postgres) cache used by GraphQL resolvers and REST controllers in the API process — including `/proxy/*` endpoints that exist only to be cached so upstream rate limits aren't hit.
audience: ai-agent, human
related:
  - ../tools/redis-timeseries.md
  - ../tools/typeorm-database-utils.md
  - ../tools/hydrated-logger.md
---

# API CacheManager

## When to read this

- Adding or modifying a GraphQL resolver under `src/apiSupport/api/graphql/plugins/**` and you need to cache its result.
- Adding a new `/proxy/*` REST handler (Subscan / DefiLlama / Kamino / Subsquare / similar) and wondering why we don't just call the upstream directly — read this first.
- Debugging a stale API response, an unexpected upstream-rate-limit hit, or a missing `support.api_cache` row.
- Changing TTLs (`API_CACHE_TTL_MS`, `API_PROXY_CACHE_TTL_MS_*`) in `AppConfig`.
- Anything referencing `cache-manager`, `Keyv`, `@keyv/postgres`, `CacheableMemory`, or the `support.api_cache` Postgres table.

## Concepts

`CacheManager` is a singleton **API-process** cache. It is **not** used by the indexer/processor flow — only by the Express + PostGraphile API process started from `src/api.ts`.

Two responsibilities:

1. **Cache GraphQL / REST resolver results** so repeated queries do not re-run expensive aggregations against Postgres.
2. **Cache responses from third-party APIs** behind `/proxy/*` endpoints. Several proxy endpoints exist purely so the API can sit in front of an upstream (Subscan, DefiLlama, Kamino, Subsquare) and serve cached responses — the upstream has rate limits the frontend would hit if it called directly.

### Storage layers

Built on [`cache-manager`](https://www.npmjs.com/package/cache-manager) v6 with two stacked Keyv stores (looked up in order, set into both):

| Layer | Backend | Purpose |
|---|---|---|
| L1 — in-memory | `cacheable` `CacheableMemory` (LRU, `lruSize: 5000`) | Sub-ms hits for hot keys within a single API process. |
| L2 — Postgres | `@keyv/postgres` → table `support.api_cache` | Survives process restarts; shared across replicas pointed at the same DB. |

Both layers use the same default TTL (`appConfig.API_CACHE_TTL_MS`, **600_000 ms = 10 min** as of 2026-05). Individual `cache.set(key, value, ttl)` calls override per-entry.

### Singleton + lazy init

`CacheManager.getInstance()` returns the singleton. The first access triggers `initCache()`, which constructs the `createCache(...)` instance with both Keyv stores. The `cache` getter also re-initialises on demand if `cacheInstance` is ever falsy. No explicit shutdown hook — the Postgres pool used by `@keyv/postgres` lives for the process lifetime.

### Usage shape

Every caller follows the same get-or-compute pattern. Cache key prefix identifies the call site; an md5 of the variable input goes after `::`.

```ts
const cacheKey = `PLATFORM_TOTAL_VOLS_BY_PERIOD::${crypto
  .createHash('md5')
  .update(JSON.stringify(filter))
  .digest('hex')}`;

const cached = await CacheManager.getInstance().cache.get<ResponseT>(cacheKey);
if (cached) return cached;

const fresh = await computeExpensiveResult();

await CacheManager.getInstance().cache.set<ResponseT>(cacheKey, fresh /*, ttlMsOverride */);
return fresh;
```

## Code map

- `src/apiSupport/utils/cacheManager.ts` — singleton class, two-layer `createCache(...)` wiring.
- `src/appConfig.ts:676` — `API_CACHE_TTL_MS` (default TTL, 600_000 ms).
- `src/appConfig.ts:826` / `:829` / `:832` / `:835` — per-proxy TTL overrides: `API_PROXY_CACHE_TTL_MS_DEFILLAMA`, `_KAMINO`, `_SUBSCAN`, `_SUBSQUARE`.
- `src/api.ts` — API process entry; CacheManager is implicitly initialised on first resolver/controller call.

### Resolvers that cache (key prefix → file)

GraphQL resolvers all under `src/apiSupport/api/graphql/plugins/query/`:

| Key prefix | File |
|---|---|
| `PLATFORM_TOTAL_VOLS_BY_PERIOD::` | `metrics/globalMetrics/resolvers/platformTotalVolumesByPeriod.resolver.ts` |
| `ALL_ASSETS_YIELD_METRICS::` (verify prefix on read) | `metrics/globalMetrics/resolvers/allAssetsYieldMetrics.resolver.ts` |
| `PLATFORM_TOTAL_TVL::` (verify prefix on read) | `metrics/globalMetrics/resolvers/platforTotalTvl.resolver.ts` |
| `OMNIPOOL_ASSETS_LATEST_TVL::` (verify prefix on read) | `omnipool/omnipoolTvlMetrics/resolvers/omnipoolAssetsLatestTvl.resolver.ts` |
| `OMNIPOOL_ASSETS_YIELD_METRICS::` (verify prefix on read) | `omnipool/omnipoolYieldMetrics/resolvers/omnipoolAssetsYieldMetrics.resolver.ts` |
| `STABLESWAP_YIELD_METRICS::` (verify prefix on read) | `stableswap/stableswapYieldMetrics/resolvers/stableswapYieldMetrics.resolver.ts` |
| `STABLESWAPS_LATEST_TVL::` (verify prefix on read) | `stableswap/stableswapTvlMetrics/resolvers/stableswapsLatestTvl.resolver.ts` |
| `XYKPOOLS_LATEST_TVL::` (verify prefix on read) | `xykpool/xykpoolTvlMetrics/resolvers/xykpoolsLatestTvl.resolver.ts` |

REST under `src/apiSupport/api/rest/`:

| Key prefix | File | TTL |
|---|---|---|
| `REST_API_MM_RESERVES_STATE::` | `controllers/mmReserves.controller.ts` | hard-coded `3_000` ms (3s) |
| `PROXY_SUBSCAN::` | `proxyApiHandlers/resources/subscan.ts` | `API_PROXY_CACHE_TTL_MS_SUBSCAN` — opt-in via `x-custom-cache-on: true` header |
| `PROXY_DEFILLAMA::` | `proxyApiHandlers/resources/defillama.ts` | `API_PROXY_CACHE_TTL_MS_DEFILLAMA` — always on |
| `PROXY_KAMINO::` | `proxyApiHandlers/resources/kamino.ts` | `API_PROXY_CACHE_TTL_MS_KAMINO` — always on |
| `PROXY_SUBSQUARE::` (verify prefix on read) | `proxyApiHandlers/resources/subsquare.ts` | `API_PROXY_CACHE_TTL_MS_SUBSQUARE` — verify on read |

(Resolver list above is current as of 2026-05; new resolvers may have been added — `grep -rn "CacheManager" src/apiSupport` to confirm.)

## Gotchas

- **API process only.** This cache is constructed in the API process (`src/api.ts`). The indexer process does not use it and would not benefit from it — for per-batch caches see `caches/batch-state.md`, for app-lifecycle reads see `caches/latest-processed-data-cache.md`. Don't import `CacheManager` from handler code.

- **Two-layer means two writes.** A `set` writes to both the LRU and to Postgres. Postgres-side writes happen synchronously through `@keyv/postgres` — if `support.api_cache` is missing or the DB is wedged, `set` will throw. The L1 layer is not a fallback for an unhealthy L2.

- **Per-replica L1.** The in-memory layer is per process. If you run multiple API replicas, only the L2 Postgres layer is shared. A user hitting replica A then replica B can still see a Postgres-served (L2) hit; expect divergence only on the LRU window between replicas.

- **Why `/proxy/*` exists at all.** Subscan, DefiLlama, Kamino, Subsquare all have rate limits that the frontend would burn through if it called them directly. The proxy endpoints exist primarily to insert this cache in front. The handler keys on `crypto.createHash('md5').update(req.url).digest('hex')` — query string differences produce different keys, so requests with permuted query params will cache-miss separately.

- **Subscan is opt-in.** `handleProxyReqSubscanAny` only consults / writes the cache when the request carries `x-custom-cache-on: true`. The other three proxy resources cache unconditionally. Verify the header path before assuming Subscan calls are cached.

- **`mmReserves.controller.ts` uses a 3s override.** A literal `3_000` is passed to `cache.set` — much shorter than the global default. This is intentional (reserve state changes block-by-block); do not "normalise" it to the global TTL.

- **No invalidation, no busting.** Every entry expires by TTL only. If you cache a result that depends on data that can become stale faster than the TTL, the API will serve stale. Either (a) shorten the per-call TTL like `mmReserves`, or (b) hash a freshness-relevant field (e.g. block number) into the cache key so a new value produces a new key.

- **Cache key must encode all inputs.** Several resolvers `md5(JSON.stringify(filter))` to derive a key. If a new optional field is added to the filter and the existing cache contains entries keyed without it, those entries will still hit — the new field is silently ignored. Bumping the prefix (`PLATFORM_TOTAL_VOLS_BY_PERIOD_V2::`) is the cheapest way to invalidate everything when filter semantics change.

- **`Keyv.default` interop dance.** `cacheManager.ts` does `require('keyv')` and tries `Keyv.default` (ESM-interop fallback). The constructor then uses `new Keyv.default(...)` directly — note the `default` is reached even on the path where `Keyv.default` is undefined. If a `Keyv` upgrade changes the export shape, init will throw `Keyv.default is not a constructor`. Pin the version before upgrading.

- **Table = `support.api_cache`.** Lives in the same DB as the indexer's data, schema `support` (same place `app_logs` lives — see `tools/hydrated-logger.md` / `tools/typeorm-database-utils.md`). `@keyv/postgres` will create the table on first use if missing. Don't migrate it manually.

- **Postgres TTL cleanup.** `@keyv/postgres` does not have a background purger; expired rows linger until they are accessed (then deleted) or until you `DELETE FROM support.api_cache WHERE expires_at < now()` yourself. On a long-running process the table can accumulate dead rows — check periodically if you suspect bloat.

## Examples

### Adding cache to a new resolver

```ts
import crypto from 'node:crypto';
import { CacheManager } from '../../../../../../../utils/cacheManager';

export async function myResolver(_, args, ctx) {
  // Key: prefix identifies the call site; md5(input) keeps the key short.
  const cacheKey = `MY_RESOLVER_V1::${crypto
    .createHash('md5')
    .update(JSON.stringify(args.filter))
    .digest('hex')}`;

  const cached = await CacheManager.getInstance().cache.get<MyResponse>(cacheKey);
  if (cached) return cached;

  const fresh = await computeExpensive(args.filter, ctx);

  // Omit the third arg to use API_CACHE_TTL_MS (default 10 min).
  await CacheManager.getInstance().cache.set<MyResponse>(cacheKey, fresh);

  return fresh;
}
```

### Adding a new `/proxy/*` upstream

1. Add `API_PROXY_CACHE_TTL_MS_<NAME>` to `AppConfig` (mirror the existing four).
2. Add the allow-list (see `allowedQueriesDefillama` / `allowedQueriesSubscan` for the shape).
3. Mirror `defillama.ts` (always-cache) or `subscan.ts` (`x-custom-cache-on` opt-in) depending on the upstream's policies.
4. Pick a unique key prefix (e.g. `PROXY_NEWVENDOR::`) — make sure it doesn't collide with any existing prefix listed in the "Code map" table above.

### Manually clearing a cached entry

There is no API for this. Either:

- Bump the key prefix in code and redeploy (cheapest), or
- `DELETE FROM support.api_cache WHERE key LIKE 'PLATFORM_TOTAL_VOLS_BY_PERIOD::%';` against the DB, and restart the API process to also clear the L1 LRU.