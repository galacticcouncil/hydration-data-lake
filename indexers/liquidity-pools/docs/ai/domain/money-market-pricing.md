---
name: Money market pricing
description: How underlying asset, aToken, and Debt token prices relate within a money market reserve, with fallback rules.
audience: ai-agent, human
related:
  - ./asset-ids.md
  - ./spot-prices.md
---

# Money market pricing

## When to read this
- Working on anything that prices aTokens or AAVE Debt tokens.
- Adding a new money market reserve or a new asset whose underlying lives in a reserve.
- Investigating a missing price for a Debt token or an unexpected aToken price.

## Concepts

Within the same money market reserve, the **underlying asset, the aToken, and the Debt token all share the same spot price**.

The pricing rules differ by `resourceType`:

| `resourceType` | Priceable by Router? | Fallback |
|---|---|---|
| Underlying | Yes (via the normal spot-price flow) | n/a |
| `aToken` | Yes | If Router doesn't return a price, use the **underlying's** price. |
| `Debt` | **No** — never priced by Router | Always use the **underlying's** price. |

## Code map

- See spot-price entry point in `domain/spot-prices.md` for the dispatch logic.
- Grep `resourceType` for the asset-type discriminator and its consumers.
- Grep `Debt` and `aToken` for the branches that apply these rules.

## Gotchas

- **Debt tokens must never go through the Router.** Any new code path that prices a Debt token by Router is a bug, even if the Router happens to return something.
- **aToken Router result of 0 / null should fall back, not persist as zero**. Verify the fallback path runs before writing.
- **The underlying must be priced first**, otherwise the fallback has nothing to fall back to. Handler ordering and `batchState` population must respect this.
- See `asset-ids.md` for why Debt tokens have an H160 `id` and a `null` `assetRegistryId`.