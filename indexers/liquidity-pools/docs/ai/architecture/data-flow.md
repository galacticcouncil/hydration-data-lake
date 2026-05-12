---
name: Data flow
description: How on-chain events and storage data move from RPC / SQD Archive / Storage Dictionary into the indexer, head vs historical paths.
audience: ai-agent, human
related:
  - ../architecture/batch-processing.md
---

# Data flow

## When to read this
- Adding a new event or storage read.
- Debugging why a value is stale or differs between historical re-run and head processing.
- Understanding whether a given piece of data comes from the Archive, the Storage Dictionary, or a direct RPC call.

## Concepts

There are three external data sources, and which one is used depends on **whether the block is historical or at head**, and on **what kind of data** is being requested.

### Sources

- **Blockchain RPC** — direct RPC to a Hydration node. Authoritative, slowest, used as a last resort or at head.
- **SQD Archive** — SQD-maintained API serving parsed/indexed on-chain events. Sits between indexer and RPC. **Not queryable with custom filters** — you consume what the Archive emits.
- **Storage Dictionary** — Hydration-maintained custom SQD indexer that provides parsed storage snapshots, avoiding direct RPC calls. Used by this indexer **when the dictionary has already processed the current block**.

### Routes

**Historical blocks:**
- On-chain events: `RPC → SQD Archive → Indexer`
- Storage data: `RPC → Indexer` directly, **or** `Storage Dictionary → Indexer` if the dictionary has the current block.

**Head (latest block):**
- `RPC → Indexer` directly, **or** `Storage Dictionary → Indexer` if the dictionary has the current block.

The Archive is **not** used at head — head data comes straight from RPC (or the Storage Dictionary if available).

## Code map

- `src/main.ts` — processor configuration; this is where Archive / RPC / dictionary endpoints are wired.
- The Storage Dictionary repo is a sibling project; relevant config is in `.env.hydration.local` (`../storage-dictionary/.env.hydration.local`).

## Gotchas

- **Events come only via the Archive for historical blocks.** You cannot ask the Archive for arbitrary historical data; you process what it emits in the configured filter.
- **Storage Dictionary may lag.** When it lags, the indexer falls back to direct RPC for storage reads.
- **Head behaviour can differ from re-run behaviour.** When debugging a discrepancy, check whether the difference is caused by the data source changing (dictionary present at head, absent during historical re-run, or vice versa).