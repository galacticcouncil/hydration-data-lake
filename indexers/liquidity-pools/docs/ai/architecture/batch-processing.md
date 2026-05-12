---
name: Batch processing
description: How SQD batches blocks, transaction lifecycle, head vs historical sizing, implications for handler design.
audience: ai-agent, human
related:
  - ../architecture/reorg-handling.md
  - ../architecture/transactions.md
  - ../caches/batch-state.md
---

# Batch processing

## When to read this
- Touching anything in `src/processorHelpers/` or the handler ordering in `singleFlowAllInOneProcessor.ts`.
- Designing logic that must run "once per batch" vs "once per block".
- Investigating performance issues that may scale per re-run at chain head.
- Anything that mentions `ctx.batchState`, batch size, or block ranges.

## Concepts

- Historical blocks are processed in **batches of up to 800 blocks**. At chain head, batch size is **1**.
- SQD opens a DB transaction at batch start and commits at batch end. This is **not configurable**.
- A single handler invocation receives multiple blocks; design handlers to iterate, not assume one block per call.
- `ctx.batchState.state` is the per-batch working cache. It is **reset on each new batch** and collects entities to be saved at batch end.

### Typical batch lifecycle

1. SQD opens DB transaction.
2. `batchState` initialised.
3. Handlers run in the fixed order defined in `singleFlowAllInOneProcessor.ts`. They:
   - Create / prefetch entities.
   - Store them in `batchState`.
   - Reference unsaved entities from `batchState` rather than re-querying.
4. At batch end, `batchState` contents are saved to DB.
5. App-lifecycle caches (e.g. `LatestProcessedDataCacheManager`) are updated **just before** the save — never mid-batch.
6. SQD commits the transaction.

## Code map

- `src/main.ts` — app entry point.
- `src/processorHelpers/singleFlowAllInOneProcessor.ts` — single-processor mode; handler order is fixed, do not reorder.
- `ctx.batchState.state` — see `caches/batch-state.md` for the full lifecycle.

## Gotchas

- **Head batches are size 1.** Any cold-start prefetch or expensive initialisation that runs unconditionally will re-run on every single block at head. Use a "done" guard.
- **Bad blocks at head re-run repeatedly.** If a head batch fails and SQD retries, your handler runs again on the same block. Logic whose cost scales per re-run is a problem.
- **Do not reorder handlers** in `singleFlowAllInOneProcessor.ts` — later handlers depend on `batchState` being populated by earlier ones.
- **No side effects outside the SQD transaction** for block-dependent data during a batch. External writes (Redis, out-of-tx Postgres) are not rolled back on reorg. See `architecture/reorg-handling.md`.

## Examples

- **Cold-start prefetch with a guard**: the historical bug behind phantom non-zero balances after restart involved one cache being wiped while a sibling cache was not. Audit sibling caches with the same lifetime when invalidating.
- **Per-batch vs per-block work**: prefetching an account set should happen once per batch (with the batch's accounts), not once per block.