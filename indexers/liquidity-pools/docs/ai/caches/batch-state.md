---
name: batchState
description: Per-batch working cache lifecycle — init at batch start, collect entities, reference unsaved entities, save at batch end.
audience: ai-agent, human
related:
  - ../architecture/batch-processing.md
  - ../architecture/reorg-handling.md
  - ./latest-processed-data-cache.md
---

# `ctx.batchState.state`

## When to read this
- Adding a new entity that needs to be created during a batch.
- Wondering whether to query the DB mid-batch or look something up in `batchState`.
- Investigating "the entity I just created can't be found" issues during a batch.

## Concepts

`ctx.batchState.state` is a **per-batch working cache**. It is reset at the start of every new batch.

It is the right place to collect entities that will be saved at batch end.

### Lifecycle

1. **Init** at batch start.
2. **Create / prefetch** entities and store them in `batchState`.
3. **Reference** unsaved entities from `batchState` (do not re-query the DB for entities you just created in this batch).
4. **Save** `batchState` contents to DB at batch end.

## Code map

- `ctx.batchState.state` — main entry point.
- Search for usage with `batchState` (PascalCase / camelCase variants) to find the canonical patterns.

## Gotchas

- **Don't query the DB for entities you just created in the same batch** — they aren't committed yet under `READ COMMITTED`, and you'll either miss them or get stale data depending on the call site. Read them from `batchState`.
- **`batchState` is the only correct place to stage entities mid-batch.** Do not update app-lifecycle caches like `LatestProcessedDataCacheManager` until just before the batch-end DB save. See `caches/latest-processed-data-cache.md`.
- **Prices in batch**: `batchState` holds prices for every block in the batch. At save time they are deduped so only blocks where a price actually changed are persisted.

## Examples

- Creating an asset entity and immediately referencing it for a balance row created in the same handler invocation: both go via `batchState`.