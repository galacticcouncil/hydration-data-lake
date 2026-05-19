---
name: Reaggregation
description: When reaggregation flows run, what differs vs normal processing, where `correlateAssetSpotPrices` fits in. Skeleton — fill in as work touches this area.
audience: ai-agent, human
related:
  - ../flows/price-calculation.md
  - ../domain/spot-prices.md
  - ../architecture/reorg-handling.md
---

# Reaggregation

## When to read this
- Touching anything in `src/processorHelpers/recalculationProcessing/`.
- Working with `omnipoolPositionPriceReaggregation.ts`.
- Adding a new reaggregation pass.
- Anywhere `correlateAssetSpotPrices` is called.

## Concepts

Reaggregation flows recompute aggregate state from already-stored historical data, rather than from live block processing.

- **Prices come from the DB**, not from per-block calculation.
- `correlateAssetSpotPrices` is the helper that fetches and aligns those prices — it is **only used here**, not in the normal block-processing flow.

## Code map
- `src/processorHelpers/recalculationProcessing/` — reaggregation code paths.
- `src/processorHelpers/recalculationProcessing/omnipoolPositionPriceReaggregation.ts` — currently modified per `git status`.
- `correlateAssetSpotPrices` — grep for usage.

## Gotchas
TODO. Notes to capture:
- How reaggregation interacts with `account_owned_asset` lookup (read path is correct in both head and reaggregation modes — see `caches/account-owned-asset.md`).
- Reorg implications (or lack thereof) for reaggregation passes.
- Cost and when to run vs not run.