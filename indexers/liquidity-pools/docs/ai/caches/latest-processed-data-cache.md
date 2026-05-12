---
name: LatestProcessedDataCacheManager
description: App-lifecycle cache of the latest historical rows; populated once from DB, updated only at batch end before DB save.
audience: ai-agent, human
related:
  - ../architecture/batch-processing.md
  - ../architecture/reorg-handling.md
  - ./batch-state.md
---

# `LatestProcessedDataCacheManager`

## When to read this
- Touching anything that reads "the latest known value of X" for an asset / account / pool.
- Adding a new historical entity that needs a "latest" lookup.
- Investigating stale-after-restart or post-reorg-desync bugs.

## Concepts

`LatestProcessedDataCacheManager` is an **app-lifecycle cache** holding the latest records of historical data to avoid expensive DB reads on every block.

### Lifecycle

1. **Prefetch from DB once**, when the cache is empty (cold start or after deliberate invalidation).
2. **Use** the cached latest data during block processing.
3. **Update** the cache **just before** the batch-end DB save — **never elsewhere**.

## Code map

- Grep `LatestProcessedDataCacheManager` for the singleton and its consumers.

## Gotchas

- **Update timing**: only update this cache right before persisting `batchState` to DB. Updating mid-batch leaks pre-commit state into a cache that survives reorgs. Updating after the DB save (post-commit) is also fine in principle, but the codebase convention is "just before save" — match it.
- **Reorg desync**: SQD rolls back the DB on reorg but this cache survives. The DB rollback + cache survival combination is the historical bug behind phantom non-zero balances. Audit **sibling caches** (e.g. `prefetchedAccountIds` in `accountOwnedAssets.ts`) when invalidating — wiping one without the others creates the same class of bug.
- **Do not populate from inside random handlers.** The "populate when empty, just before save" rule keeps the cache coherent.