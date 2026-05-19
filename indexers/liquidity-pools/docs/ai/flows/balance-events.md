---
name: Balance events processing
description: How `processBalanceEventsSequentially` discovers accounts, takes snapshots, and writes balance history. Skeleton — fill in as work touches this area.
audience: ai-agent, human
related:
  - ../caches/account-owned-asset.md
  - ../architecture/reorg-handling.md
---

# Balance events processing

## When to read this
- Modifying `processBalanceEventsSequentially` or any balance event handler.
- Adding a new balance-affecting event (transfer, deposit, withdraw, etc.).
- Investigating missing or duplicated balance snapshots.

## Concepts
TODO. Notes to capture:
- High-level pipeline: events → discovery → on-chain state read → snapshots → `account_owned_asset` writes → balance history rows.
- How discovery uses `account_owned_asset` (see `caches/account-owned-asset.md`).
- How `initManyAccountAssetBalancesFromOnChainData` is used for cold-start or new pairs.
- Idempotency on reorg.

## Code map
- `processBalanceEventsSequentially` — main loop.
- `initManyAccountAssetBalancesFromOnChainData` — cold-start path.
- `getOrCreateAccountOwnedAsset` — required for every pair written.

## Gotchas
TODO.

## Examples
TODO.