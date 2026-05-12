---
name: Reorg handling
description: How SQD chain reorgs interact with caches and DB writes, idempotency rules, side-effect safety.
audience: ai-agent, human
related:
  - ../architecture/batch-processing.md
  - ../architecture/transactions.md
  - ../caches/batch-state.md
  - ../caches/latest-processed-data-cache.md
  - ../caches/account-owned-asset.md
---

# Reorg handling

## When to read this
- Adding or modifying any **app-lifecycle cache** (anything that outlives a batch).
- Adding new entity writes — especially when picking an `id`.
- Investigating "state is wrong after restart" or "duplicate rows" type bugs.
- Adding any external write (Redis, out-of-tx Postgres call).

## Concepts

SQD detects chain reorgs, **rolls back the DB transaction for the affected blocks**, and **re-runs the batch handler** for the new canonical chain. This guarantees DB consistency, but only for the DB.

Three classes of risk follow from this:

### 1. DB and in-memory caches desync
SQD only rolls back the DB. Any cache that lives longer than a batch (e.g. `LatestProcessedDataCacheManager`, module-level `Set`s like `prefetchedAccountIds` in `accountOwnedAssets.ts`) keeps the **post-reorg state from the old chain** unless explicitly invalidated.

**Sibling cache audit**: when you invalidate one such cache, audit for sibling caches with the same lifetime. Wiping one without the others is the historical bug behind phantom non-zero balances after restart — discovery paths skip accounts whose balance cache is empty, leaving stale derived state.

### 2. Idempotency of writes
The same block may be processed more than once. Every entity created during a batch must use a **deterministic id** so a re-run produces the same row, not a duplicate.

- Fields set **only on creation** (e.g. `firstSeenParaBlockHeight`) must never be overwritten on re-run.
- Use `getOrCreate`-style helpers that key on the deterministic id.

### 3. No side effects outside the SQD transaction during a batch
External writes for block-dependent data (Redis, out-of-tx Postgres) are **not rolled back**. Options:

- Only write block-invariant data outside the transaction.
- Move side effects to **batch-end, after the SQD commit**.

## Code map

- `src/processorHelpers/recalculationProcessing/` — reaggregation code paths; see also `flows/reaggregation.md`.
- Cache modules referenced in CLAUDE.md:
  - `LatestProcessedDataCacheManager` — see `caches/latest-processed-data-cache.md`.
  - `prefetchedAccountIds` in `accountOwnedAssets.ts` — module-level cache with reorg implications.
- `firstSeenParaBlockHeight` — example of a "set on creation only" field; grep usages before changing write semantics.

## Gotchas

- **Head batches are size 1**, so a bad block can re-run many times. Make the re-run cheap and idempotent.
- **Deterministic ids are not optional** — they are the only thing that lets a re-run not produce duplicates.
- **`account_owned_asset` semantics**: ownership-only, never removed when a balance returns to zero. The historical lookup chain must remain intact across reorgs. See `caches/account-owned-asset.md`.
- **Out-of-tx Postgres writes**: allowed only for data not dependent on the current transaction. See `architecture/transactions.md`.

## Examples

- **Phantom non-zero balances after restart**: caused by invalidating one cache while a sibling cache with the same lifetime kept stale entries. The discovery path then skipped accounts whose balance cache was empty.
- **Duplicate entity rows**: caused by non-deterministic ids (e.g. auto-increment or timestamp-based). Always derive the id from the natural key.