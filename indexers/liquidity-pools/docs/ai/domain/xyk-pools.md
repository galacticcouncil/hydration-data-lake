---
name: XYK pools
description: XYK pool concepts in this indexer and how XYK-only assets are priced. Skeleton — fill in as work touches this area.
audience: ai-agent, human
related:
  - ./spot-prices.md
  - ./omnipool.md
---

# XYK pools

## When to read this
- Touching XYK pool TVL or volume aggregation (see recent commit `6432117f`).
- Working on anything that depends on `USE_XYKPOOLS_DATA_IN_TRADE_ROUTER` being `false`.
- Pricing XYK-only assets — see also `domain/spot-prices.md`.

## Concepts
TODO. Notes to capture:
- Why XYK pool state is **not** provided to the Router (`USE_XYKPOOLS_DATA_IN_TRADE_ROUTER = false`) and the consequences (XYK-only assets must be priced via the interim asset path).
- Interim asset selection: `XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID` (DOT, falling back to HDX).
- Destroyed pools and their share tokens (priced 0 via `processXykUntradableAssetSpotPrices`).
- XYK pool TVL and volume aggregation APIs.

## Code map
TODO.

## Gotchas
TODO.