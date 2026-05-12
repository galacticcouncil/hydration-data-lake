---
name: Debug a suspected reorg issue
description: Where to look when post-reorg state looks wrong. Skeleton — fill in as incidents accumulate.
audience: ai-agent, human
related:
  - ../architecture/reorg-handling.md
  - ../caches/latest-processed-data-cache.md
  - ../caches/account-owned-asset.md
---

# Debug a suspected reorg issue

## When to read this
- Symptoms include: state correct mid-run, wrong after restart; duplicate rows for a single block height; "phantom" balances; a value that doesn't match DB after the indexer warms up.

## Checklist

1. **Identify which caches are involved.** List every app-lifecycle cache touched by the affected flow. The DB was rolled back; the caches were not.
2. **Find sibling caches with the same lifetime.** The historical bug pattern is: one cache invalidated, a sibling not. Audit them together.
3. **Check idempotency of writes.** Was the entity id deterministic? Was any "set on creation only" field (e.g. `firstSeenParaBlockHeight`) overwritten on a re-run?
4. **Check for out-of-tx side effects.** Were any Redis or out-of-tx Postgres writes made for block-dependent data during the batch?
5. **Reproduce locally** if possible by replaying the affected block range against a fresh DB.

## Code map
TODO.

## Gotchas
- Head batches are size 1; a bad block can re-run many times. Look for handlers whose cost scales with re-runs.