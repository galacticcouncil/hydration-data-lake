---
name: Transactions and out-of-tx writes
description: SQD's automatic transaction lifecycle, isolation level, when out-of-transaction Postgres writes are safe, Redis caveats.
audience: ai-agent, human
related:
  - ../architecture/batch-processing.md
  - ../architecture/reorg-handling.md
---

# Transactions and out-of-tx writes

## When to read this
- Adding any Postgres write outside the SQD-managed transaction.
- Adding any Redis write or other external side effect from a handler.
- Investigating "Redis state survived a reorg but DB didn't" type issues.

## Concepts

- **Isolation level**: `READ COMMITTED` for the SQD transaction.
- SQD opens a DB transaction at batch start and commits at batch end. Not configurable.
- **Out-of-transaction Postgres calls** exist in the codebase, but only for data **not dependent on the current transaction** — i.e. data that is invariant under reorg.
- **Redis / TimeSeries writes** are not part of the SQD transaction and will **not** be rolled back on reorg.

## Code map

- Search for direct `pg`/`pool` usage versus `ctx.store.*` usage — direct usage indicates out-of-tx writes.
- Redis client wiring lives outside the per-batch context.

## Gotchas

- Anything written out-of-transaction during a batch is **not rolled back on reorg**. Restrict out-of-tx writes to reorg-invariant data, or move them to after the SQD commit.
- `READ COMMITTED` does not protect against write skew or non-repeatable reads — design queries accordingly.
- Redis TimeSeries entries written mid-batch for block-dependent data are a latent reorg bug; prefer writing them after commit if possible.