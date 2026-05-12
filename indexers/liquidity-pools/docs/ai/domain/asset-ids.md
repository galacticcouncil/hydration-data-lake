---
name: Asset IDs
description: How registry IDs, ERC20 contract addresses, and AAVE debt tokens all fit into the same `id` / `assetRegistryId` schema.
audience: ai-agent, human
related:
  - ./money-market-pricing.md
  - ./spot-prices.md
---

# Asset IDs

## When to read this
- Adding, querying, or joining anything keyed by asset.
- Introducing a new asset category (e.g. a new token standard).
- Debugging an unexpected `null` `assetRegistryId` or an unexpected H160-shaped `id`.

## Concepts

Assets tracked from the **Asset Registry** use their registry ID as the DB primary key. **ERC20** assets use their H160 contract address instead. The `assetRegistryId` field stores the registry ID **when one exists**.

| Field | Type | Notes |
|---|---|---|
| `id` | required | DB primary key. Numeric (registry ID) **or** H160 hex address (ERC20 / debt tokens). |
| `assetRegistryId` | nullable | Asset Registry ID. Null for unregistered assets (e.g. AAVE debt tokens). |

**AAVE debt tokens** are not in the Asset Registry but still have contract addresses, so they fit the same schema — they simply lack an `assetRegistryId`.

## Code map

Grep `assetRegistryId` to find write sites; grep the asset entity definition under `src/model/` (or generated TypeORM entities) for the schema.

## Gotchas

- **Do not assume `id` is numeric.** ERC20 and debt token ids are H160 hex strings. Code that parses `id` as `Number` / `BigInt` will silently break for these.
- **Joining on registry id requires `assetRegistryId`, not `id`.** When correlating with on-chain registry data, use `assetRegistryId`; using `id` will miss ERC20 assets that happen to look numeric and will fail for those that don't.
- **Debt tokens have no registry id at all** — handle the null path explicitly.