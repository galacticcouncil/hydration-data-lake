---
name: account_owned_asset lookup
description: Thin ownership table tracking which assets each account has ever held. Used to discover (account, asset) pairs without scanning balance history.
audience: ai-agent, human
related:
  - ../architecture/reorg-handling.md
  - ../flows/balance-events.md
---

# `account_owned_asset` lookup table

## When to read this
- Adding any code that needs the set of assets an account has held.
- Modifying `processBalanceEventsSequentially` or `initManyAccountAssetBalancesFromOnChainData`.
- Touching `prefetchAccountOwnedAssetsByAccountIds` / `prefetchLastAccountAssetBalances`.
- Investigating "this account/asset pair didn't get a balance row" type issues.

## Concepts

Thin table with rows keyed `<accountId>-<assetId>` (deterministic id) recording which assets each account has ever held.

Replaces scanning `account_asset_balance_historical_data` (which has hundreds of thousands of rows per pair on prod and previously made discovery dominate batch time).

### Semantics: ownership-only

A pair returning to a **zero balance is NOT removed**. The account may receive the asset again, and the historical lookup chain must remain intact across that gap.

### Write path

Every snapshot in `processBalanceEventsSequentially` and every pair created by `initManyAccountAssetBalancesFromOnChainData` calls `getOrCreateAccountOwnedAsset`.

- **Idempotent on reorg re-runs**: deterministic id, `firstSeenParaBlockHeight` set on creation only.

### Read path

`prefetchAccountOwnedAssetsByAccountIds` loads ownership for the batch's accounts. The resulting pair set feeds the LATERAL-join query in `prefetchLastAccountAssetBalances`.

- Correct in both **head** and **reaggregation** modes — looking up with `para_block_height < $blockHeight` returns zero rows for pairs not yet owned at that block.

## Code map

- `getOrCreateAccountOwnedAsset` — the canonical write helper.
- `processBalanceEventsSequentially` — primary write site.
- `initManyAccountAssetBalancesFromOnChainData` — secondary write site.
- `prefetchAccountOwnedAssetsByAccountIds` — read site.
- `prefetchLastAccountAssetBalances` — consumer that joins the pair set against the balance history.
- `prefetchedAccountIds` in `accountOwnedAssets.ts` — sibling app-lifecycle cache. See `caches/latest-processed-data-cache.md` gotchas.

## Gotchas

- **Never remove rows when a balance returns to zero.** Doing so breaks historical lookups for the next time that pair becomes non-zero.
- **`firstSeenParaBlockHeight` must not be overwritten on re-run.** It is set on creation only — preserve this when adding new write sites.
- **Sibling cache invalidation**: if you invalidate `prefetchedAccountIds` (or a similar module-level set), you must also consider what depends on it. The historical phantom-non-zero-balances bug was wiping one cache while a sibling remained populated.
- **`account_owned_asset` writes are not optional**: any new code path that records a balance must also call `getOrCreateAccountOwnedAsset` for that pair, or discovery will miss it.