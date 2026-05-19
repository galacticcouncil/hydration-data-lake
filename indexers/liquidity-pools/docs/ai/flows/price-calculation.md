---
name: Price calculation pipeline
description: How per-block spot prices are computed, staged in `batchState`, deduped, and persisted. Skeleton — fill in as work touches this area.
audience: ai-agent, human
related:
  - ../domain/spot-prices.md
  - ../domain/money-market-pricing.md
  - ../caches/batch-state.md
---

# Price calculation pipeline

## When to read this
- Adding a new asset category that needs pricing.
- Changing where / when prices are persisted.
- Investigating "price is being saved for every block even when unchanged" (it shouldn't be).

## Concepts

- During batch processing, `ctx.batchState` contains prices **for every block in the batch** — prices are always calculated regardless.
- At DB save time, prices are **deduped** so only blocks where a price actually changed are persisted.
- The three price processors (`processAssetSpotPrices`, `processXykInvolvedAssetSpotPrices`, `processXykUntradableAssetSpotPrices`) feed this same staging area.

See `domain/spot-prices.md` for processor selection and `caches/batch-state.md` for the staging lifecycle.

## Code map
- Entry point: `handleAssetSpotPricesHistoricalDataAtBlock` in `src/handlers/assets/assetHistoricalData/assetSpotPrices.ts`.
- TODO: dedupe and save-time logic — fill in file:line when filling out this doc.

## Gotchas
- **`correlateAssetSpotPrices` is NOT used here** — only in reaggregation. See `flows/reaggregation.md`.
- TODO: capture any subtle ordering requirements (e.g. underlying priced before aTokens / Debt tokens).