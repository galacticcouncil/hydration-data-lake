---
name: AI Knowledge Base Index
description: Index of project knowledge documents intended for AI agents and human supporters. Start here.
audience: ai-agent, human
---

# AI Knowledge Base — Index

This directory is a knowledge base optimised for AI agents (Claude Code, Cursor, Copilot, etc.) and for human engineers using those agents. Use this file as the entry point.

The root `CLAUDE.md` contains only the must-know constraints that should be in context for *every* conversation. Everything deeper lives here and is loaded on demand when the agent (or human) determines a topic is relevant.

---

## How to read this knowledge base (for agents)

1. Open this `INDEX.md` first.
2. Scan the one-line descriptions below.
3. Read **only** the topic files that are relevant to the current task. Do not bulk-read every file — each file is meant to be useful on its own.
4. Each topic file starts with a **"When to read this"** block. Use it to confirm relevance before reading the body.
5. If a topic file references code (`file.ts:42`), prefer reading that exact location over re-deriving the information.

---

## How to add or update knowledge (for agents)

When you (the agent) are asked to add knowledge to this base, follow these rules so the documentation stays aligned in style and structure. Treat this section as a contract.

### 1. Decide whether a new document is needed

- Prefer **updating an existing topic file** over creating a new one. Check the INDEX first.
- Create a new file only when the topic is **substantively distinct** and would not fit cleanly as a section of an existing file.
- A topic deserves its own file when it satisfies at least one of:
  - It has its own "When to read this" trigger that doesn't overlap with an existing file.
  - It is longer than ~100 lines of content.
  - It is referenced from multiple other places (CLAUDE.md, other topic files, code).

### 2. Choose the correct category folder

| Folder | Use for |
|---|---|
| `architecture/` | Cross-cutting framework / runtime behaviour (SQD, batching, reorgs, data flow, transactions). |
| `domain/` | Hydration / Polkadot business concepts (omnipool, XYK, stableswap, money market, asset IDs, spot prices). |
| `caches/` | Each cache layer the indexer uses (`batchState`, `LatestProcessedDataCacheManager`, `account_owned_asset`, Redis, etc.). |
| `flows/` | Multi-step processing flows that span multiple handlers (balance events, reaggregation, price calculation pipeline). |
| `tools/` | Utility modules and support infrastructure the app uses but is not part of the runtime contract (`HydratedLogger`, measurement wrappers, support-schema tables, ad-hoc probes). Reference material — "what is X and how do I use it" — not procedural. |
| `runbooks/` | Operational, "how do I do X" task guides (debug a reorg, reset local DB, add a new asset type). |

If a topic doesn't fit any of these, ask the user before creating a new top-level folder.

### 3. File naming

- `kebab-case.md`, descriptive, singular noun where possible: `spot-prices.md`, not `SpotPriceStuff.md` or `prices.md`.
- Match the concept name as it appears in code / CLAUDE.md when there is one.

### 4. Required structure of every topic file

Every file MUST follow this template. Do not skip sections — write "N/A" if a section genuinely doesn't apply, but prefer to fill them.

```markdown
---
name: <Short human title>
description: <One sentence. This is what the index lists. Be specific — it drives relevance decisions.>
audience: ai-agent, human
related:
  - <relative path to related doc>
  - <relative path to related doc>
---

# <Title>

## When to read this
Bullet list of triggers. "Read this when working on X, debugging Y, or asked about Z."
Be concrete. Reference symbol names, file names, error messages — things an agent will grep for.

## Concepts
The mental model. Explain the *why* and the invariants, not just the *what*.
Keep it tight — a reader should be able to skim this in under a minute.

## Code map
File:line pointers to the canonical implementation. Format:
- `src/path/to/file.ts:42` — what lives here
- `src/path/to/other.ts` — what lives here (omit line if it's the whole file)

These pointers WILL rot. Prefer pointing at stable function/class names that grep will find even after line shifts.

## Gotchas
Non-obvious things. Past bugs. Constraints that aren't visible from the code.
This is the highest-value section — it captures knowledge that cannot be re-derived by reading the code.

## Examples
Concrete usage / scenarios when helpful. Optional but recommended for flows and runbooks.
```

### 5. After creating or updating a file

1. **Update this `INDEX.md`** — add a one-line entry under the correct category (or update the existing entry's description if it drifted). One line, under ~150 characters, format:
   `- [Title](relative/path.md) — one-line hook describing when to read it.`
2. **Update related files' `related:` frontmatter** if you created a strong cross-reference.
3. **Do not duplicate content** across files. If two files need the same info, put it in one and link from the other.
4. **Do not edit `CLAUDE.md` automatically.** If you believe `CLAUDE.md` should reference the new doc, propose the change to the user — don't apply it.

### 6. Style rules

- Write for an AI agent reading cold. No "as discussed above" without the "above" being in the same file.
- Prefer **bullet points and tables** over prose paragraphs.
- Code references use backticks and full paths from repo root: `src/handlers/assets/assetHistoricalData/assetSpotPrices.ts`.
- Mark uncertainty explicitly: "as of <date>" or "verify before relying on this".
- Don't write marketing language ("powerful", "robust", "seamlessly"). Just describe behaviour.
- Don't use emojis unless the user has asked for them.

### 7. When the code and a doc disagree

The code is the source of truth. If you (the agent) find a doc that contradicts the current code:

1. Verify the code (read the actual file, run grep).
2. Update the doc to match reality.
3. Note the change in your reply to the user so they can confirm the doc was wrong (vs the code having regressed).

---

## Index

### Architecture
<!-- Cross-cutting framework / runtime behaviour. -->
- [Batch processing](architecture/batch-processing.md) — How SQD batches blocks, transaction lifecycle, head vs historical sizing.
- [Reorg handling](architecture/reorg-handling.md) — How SQD reorgs interact with caches, idempotency rules, side-effect safety.
- [Data flow](architecture/data-flow.md) — How data moves from RPC / Archive / Storage Dictionary into the indexer, head vs historical paths.
- [Transactions and out-of-tx writes](architecture/transactions.md) — Isolation level, what runs inside vs outside the SQD transaction, when out-of-tx is safe.

### Domain
<!-- Hydration / Polkadot business concepts. -->
- [Asset IDs](domain/asset-ids.md) — How registry IDs, ERC20 addresses, and debt tokens map onto the `id` / `assetRegistryId` schema.
- [Spot prices](domain/spot-prices.md) — Three processors for spot price calculation, when each runs, interim asset logic, XYK exclusion from Router.
- [Money market pricing](domain/money-market-pricing.md) — How underlying / aToken / Debt token prices relate within a reserve, fallback rules.
- [Omnipool](domain/omnipool.md) — Omnipool concepts as they appear in this indexer. (skeleton)
- [XYK pools](domain/xyk-pools.md) — XYK pool concepts and how XYK-only assets are priced. (skeleton)
- [Stableswap](domain/stableswap.md) — Stableswap concepts as they appear in this indexer. (skeleton)

### Caches
<!-- Each cache layer used by the indexer. -->
- [batchState](caches/batch-state.md) — Per-batch working cache lifecycle: init → collect → reference → save.
- [LatestProcessedDataCacheManager](caches/latest-processed-data-cache.md) — App-lifecycle cache of latest historical rows; population rules.
- [account_owned_asset lookup](caches/account-owned-asset.md) — Thin ownership table; write path, read path, reorg semantics.

### Flows
<!-- Multi-step processing flows. -->
- [Balance events processing](flows/balance-events.md) — `processBalanceEventsSequentially` and the discovery / snapshot path. (skeleton)
- [Price calculation pipeline](flows/price-calculation.md) — How a block's prices are computed, deduped, and persisted. (skeleton)
- [Reaggregation](flows/reaggregation.md) — When reaggregation runs, what's different vs normal processing, `correlateAssetSpotPrices` usage. (skeleton)

### Tools
<!-- Utility modules and support infrastructure. Reference docs — "what is X and how do I use it". -->
- [HydratedLogger](tools/hydrated-logger.md) — Dual-transport logger backing `support.app_logs`; how per-call timing, action_type breakdowns, and per-batch analytics are captured.
- [Prometheus metrics](tools/prometheus-metrics.md) — Custom `sqd_handler_*`, `sqd_batch_*`, `sqd_reorg_*` series on SQD's `/metrics`; `createMetricsTracker` / `createReorgTracker` factories.
- [TypeormDatabaseUtils (`ctx.storeUtils`)](tools/typeorm-database-utils.md) — Per-batch wrapper around `ctx.store` providing measured `findWithLogs` / `findOneWithLogs` / `upsertWithBatches` and Postgres-aware retry; the source of `db_read` / `db_write` rows in `support.app_logs`.

### Runbooks
<!-- "How do I do X" task guides. -->
- [Reset local DB](runbooks/reset-local-db.md) — Steps to reset and restore the local dev container. (skeleton, see also `/reset-and-init-orca-local-alt` skill)
- [Debug a suspected reorg issue](runbooks/debug-reorg.md) — Where to look when post-reorg state looks wrong. (skeleton)
- [Add a new tracked asset type](runbooks/add-asset-type.md) — Checklist for introducing a new asset category. (skeleton)

---

## Suggested references to add to root `CLAUDE.md`

The user will paste these into `CLAUDE.md` at their convenience. Suggested wording, to be placed near the related existing sections or in a new "Further reading" section at the bottom:

```markdown
## Further reading

Deep documentation lives in `docs/ai/`. Start with `docs/ai/INDEX.md`, then load only the topic(s) relevant to the task.

Quick links by topic:
- Batch / reorg / transactions → `docs/ai/architecture/`
- Spot price calculation → `docs/ai/domain/spot-prices.md`
- Money market pricing → `docs/ai/domain/money-market-pricing.md`
- Asset IDs → `docs/ai/domain/asset-ids.md`
- `batchState`, `LatestProcessedDataCacheManager`, `account_owned_asset` → `docs/ai/caches/`
- Balance events, reaggregation, price pipeline → `docs/ai/flows/`
- Utility modules (HydratedLogger / `support.app_logs`, Prometheus metrics / reorg detection, `ctx.storeUtils`) → `docs/ai/tools/`
- Operational tasks → `docs/ai/runbooks/`
```