---
name: Spot prices
description: Three processors that compute per-block spot prices, when each runs, why XYK-only assets bypass the Router.
audience: ai-agent, human
related:
  - ./money-market-pricing.md
  - ./xyk-pools.md
  - ../flows/price-calculation.md
---

# Spot prices

## When to read this
- Changing anything in `src/handlers/assets/assetHistoricalData/assetSpotPrices.ts` or its callees.
- Adding a new pool type or a new asset category that needs pricing.
- Debugging zero prices, missing prices, or prices that look wrong for XYK-only assets.
- Anything that mentions the **Router**, `XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID`, `ARTIFICIAL_OMNIPOOL_ASSET_IDS_SET`, or `USE_XYKPOOLS_DATA_IN_TRADE_ROUTER`.

## Concepts

Entry point: `handleAssetSpotPricesHistoricalDataAtBlock` in `src/handlers/assets/assetHistoricalData/assetSpotPrices.ts`.

It dispatches each asset to **one of three processors**, based on `getXykOnlyAssets(ctx)`:

### 1. `processAssetSpotPrices`
**For**: assets with non-XYK liquidity. Concretely:
- Omnipool assets.
- Stableswap assets.
- Assets in `ARTIFICIAL_OMNIPOOL_ASSET_IDS_SET`.
- aTokens / Debt tokens whose underlying has non-XYK liquidity.

**How**: priced via the **SDK Router**.

### 2. `processXykInvolvedAssetSpotPrices`
**For**: XYK-only assets that are in a tradable XYK pool.

**How**: priced via the **interim asset** (`XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID`, usually DOT; falls back to HDX if no DOT pool exists).
- Formula: `(pool reserve ratio) × (interim asset's already-computed spot price)`.

### 3. `processXykUntradableAssetSpotPrices`
**For**: XYK-only assets whose only pools are destroyed, and share tokens of destroyed XYK pools.

**How**: writes `price = 0` with an empty route.

### Why XYK-only assets do not use the Router
Two reasons:

1. **Performance**: the Router would compute a deterministic XYK route. Approximating with the reserve ratio × interim price is much cheaper.
2. **Hard requirement**: indexer instances run with `USE_XYKPOOLS_DATA_IN_TRADE_ROUTER = false`. The Router is intentionally **not given XYK pool state**, so it cannot build routes through XYK pools. XYK-only assets **must** be priced via the interim asset path.

## Code map

- `src/handlers/assets/assetHistoricalData/assetSpotPrices.ts` — `handleAssetSpotPricesHistoricalDataAtBlock` and the three processors.
- `getXykOnlyAssets` — classification function; grep to find call sites.
- `XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID`, `ARTIFICIAL_OMNIPOOL_ASSET_IDS_SET`, `USE_XYKPOOLS_DATA_IN_TRADE_ROUTER` — constants worth grepping for.

## Gotchas

- **Prices are always calculated for every block in a batch.** `ctx.batchState` holds them for every block. At DB save time they are **deduped** — only blocks where the price changed are persisted. See `flows/price-calculation.md`.
- **`correlateAssetSpotPrices` is NOT used in the normal flow.** It's only for reaggregation, where prices are fetched from DB rather than recomputed. See `flows/reaggregation.md`.
- **Interim asset fallback**: DOT first, HDX if no DOT pool exists. New XYK pools may shift which interim asset applies.
- **aTokens with non-XYK underlying go through the Router**, not the interim-asset path. See `money-market-pricing.md` for the underlying / aToken / Debt token pricing relationship.

## Examples

- An aToken whose underlying is an omnipool asset → `processAssetSpotPrices`.
- A pure XYK token traded against DOT only → `processXykInvolvedAssetSpotPrices`, priced via DOT.
- A share token of a destroyed XYK pool → `processXykUntradableAssetSpotPrices`, price 0.