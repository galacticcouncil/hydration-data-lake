---
name: Indexer topology
description: The two indexers and how they relate at runtime — storage-dictionary produces per-block storage snapshots, liquidity-pools consumes them via GraphQL and falls back to RPC. Shared GHCR registry.
audience: ai-agent, human
related:
  - ./monorepo-layout.md
  - ../deployment/storage-dictionary-stacks.md
  - ../deployment/aggregation-indexer-stacks.md
---

# Indexer topology

## When to read this
- Understanding how the two indexers interact (who produces what, who reads what).
- Deciding whether a change in one indexer affects the other.
- Wiring `USE_STORAGE_DICTIONARY` / `STORAGE_DICTIONARY_*_URL` in a deployment.
- Questions about the published Docker images and which folder each comes from.

## Concepts

Two SQD (Subsquid) indexers for **Hydration** (Polkadot parachain, 6s blocks), designed to run together as a **producer → consumer pair**.

### storage-dictionary — the producer
- A "thin" indexer: no business logic. It captures **parsed per-block storage snapshots** for selected pallets and serves them over GraphQL (PostGraphile).
- Chain storage at block N is immutable, so its output is reusable middleware: any number of higher-level indexers can read the same snapshots instead of each hammering an RPC node.
- Split by `PROCESS_*` category (LBP / XYK / omnipool / stableswap / generic / accounts) so categories index in parallel. Deep spec: `indexers/storage-dictionary/CLAUDE.md`.

### liquidity-pools — the consumer (aggregation indexer)
- The active core deliverable: business logic, spot prices, account balances, liquidity positions.
- For storage reads it prefers the storage dictionary **when the dictionary has already processed the current block**, and falls back to direct RPC otherwise.
- Deep spec: `indexers/liquidity-pools/CLAUDE.md` + `indexers/liquidity-pools/docs/ai/`.

### The runtime link
- `liquidity-pools` is pointed at the dictionary via env vars set in its deployment stack:
  - `USE_STORAGE_DICTIONARY: 'true'` master switch.
  - Six per-category URLs: `STORAGE_DICTIONARY_LBPPOOL_URL`, `STORAGE_DICTIONARY_XYKPOOL_URL`, `STORAGE_DICTIONARY_OMNIPOOL_URL`, `STORAGE_DICTIONARY_STABLEPOOL_URL`, `STORAGE_DICTIONARY_GEN_HIST_DATA_URL`, `STORAGE_DICTIONARY_ACCOUNT_HIST_DATA_URL`.
- In production these point at the per-category dictionary APIs (e.g. `https://storage-dict-xyk-hist-data-v2.orca.hydration.cloud/graphql`). In a single-instance/all-in-one setup, all six point at the same URL.

### Ordering dependency
- `liquidity-pools` depends on the dictionary being indexed for the blocks it processes. If the dictionary lags behind, the consumer falls back to RPC for those blocks (correctness preserved, speed lost).
- Per `self-hosted/README.md`, do **not** run a fresh consumer faster than a co-located dictionary can index — run one shared, already-indexed dictionary behind multiple consumers.

## Code map
- `indexers/storage-dictionary/CLAUDE.md` — producer spec (multiprocessor mode, compression, category split).
- `indexers/liquidity-pools/CLAUDE.md` — consumer spec; `Concepts` section describes the dictionary dependency.
- `indexers/liquidity-pools/docs/ai/architecture/data-flow.md` — head vs historical data routing (RPC / Archive / dictionary).
- `self-hosted/aggregation-indexer/orca-full-orca.yml` — real `USE_STORAGE_DICTIONARY` + `STORAGE_DICTIONARY_*_URL` wiring.

### Published images (shared GHCR registry)
Both images are built by CI from their indexer subfolder and pushed to `ghcr.io/galacticcouncil`:
- `ghcr.io/galacticcouncil/data-lake-aggregation-indexer` ← `indexers/liquidity-pools/`
- `ghcr.io/galacticcouncil/data-lake-storage-dictionary-indexer` ← `indexers/storage-dictionary/`

Tagging: `main` → `latest`; other branches → `wip-<sanitized-branch>`; every build also tagged with the commit SHA. See `../ci-cd/image-build-publish.md`.

## Gotchas
- **The two indexers share the GHCR namespace but have separate images and separate DBs.** They never write to the same database; the link is GraphQL reads only.
- **Both are SQD framework indexers** but with different goals — don't assume a pattern from one applies to the other. The storage dictionary runs multiprocessor-by-block-range; liquidity-pools runs a single-flow all-in-one processor by default.
- **A storage-dictionary parsing fix does not force a global consumer rewind.** Because the dictionary is split by category and is immutable per block, only the affected category's snapshots need re-indexing; consumers re-read the corrected blocks.
- **Health-checker stacks point at SQD-cloud-hosted consumer APIs** (`*.squids.live`), not at the self-hosted swarm APIs — see `../deployment/shared-infra-stacks.md`. Don't assume the health checker is observing the self-hosted deployment.
