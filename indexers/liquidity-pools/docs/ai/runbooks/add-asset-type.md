---
name: Add a new tracked asset type
description: Checklist for introducing a new asset category (new token standard, new pool source). Skeleton — fill in as the first such addition happens.
audience: ai-agent, human
related:
  - ../domain/asset-ids.md
  - ../domain/spot-prices.md
  - ../domain/money-market-pricing.md
---

# Add a new tracked asset type

## When to read this
- Introducing a new asset category that doesn't fit the existing registry / ERC20 / debt-token shape, or one that requires a new pricing path.

## Checklist

1. **ID shape**: does the new asset fit the existing `id` / `assetRegistryId` model (`domain/asset-ids.md`)? If not, document why.
2. **Pricing path**: which spot-price processor applies (`domain/spot-prices.md`)? If none does, you are adding a fourth path — discuss with the user first.
3. **Money market relationship**: if this is a wrapped or derived token (`domain/money-market-pricing.md`), define its fallback rules.
4. **Discovery**: ensure any code that records balances for this asset also writes `account_owned_asset` rows (`caches/account-owned-asset.md`).
5. **batchState**: identify where this asset's entities will be staged (`caches/batch-state.md`).
6. **Reorg**: confirm deterministic ids, idempotent writes, no out-of-tx side effects (`architecture/reorg-handling.md`).
7. **Tests**: TODO — link to a representative test pattern when one exists.

## Code map
TODO.

## Gotchas
TODO.