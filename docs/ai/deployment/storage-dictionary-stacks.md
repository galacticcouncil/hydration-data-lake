---
name: Storage-dictionary deployment stacks
description: The self-hosted/storage-dictionary-indexer/ stacks — one stack per PROCESS_* category, the within-stack multiprocessor block-range split, and how the two layers of parallelism cut reindex time.
audience: ai-agent, human
related:
  - ./docker-swarm-overview.md
  - ./aggregation-indexer-stacks.md
  - ./postgres-secret-management.md
  - ../architecture/indexer-topology.md
---

# Storage-dictionary deployment stacks

## When to read this
- Deploying, scaling, or backfilling the storage-dictionary indexer.
- Editing any `self-hosted/storage-dictionary-indexer/st-dict-*.stack.yml`.
- Understanding the category split and the `STATE_SCHEMA_NAME` / block-range layout.
- Diagnosing assets-actualisation or migration-runner coordination across processors.

> Authoritative behaviour spec is `indexers/storage-dictionary/CLAUDE.md` ("Multiprocessor mode" + "Deployment"). This file documents the **deployment topology** as expressed in the swarm stacks.

## Concepts

One stack file per `PROCESS_*` category in `self-hosted/storage-dictionary-indexer/`:

| Stack file | Category |
|---|---|
| `st-dict-lbp-hist-data.stack.yml` | `PROCESS_LBP_POOLS` |
| `st-dict-xyk-hist-data.stack.yml` | `PROCESS_XYK_POOLS` |
| `st-dict-omnipool-hist-data.stack.yml` | `PROCESS_OMNIPOOLS` |
| `st-dict-stableswap-hist-data.stack.yml` | `PROCESS_STABLEPOOLS` |
| `st-dict-generic-hist-data.stack.yml` | `PROCESS_GENERIC_HIST_DATA` |
| `st-dict-account-hist-data.stack.yml` | `PROCESS_ACCOUNTS` |
| `st-dict-all-in-one.stack.yml` | every `PROCESS_*` flag on (single processor, slow path) |

### Two layers of parallelism (this is the whole point of the split)
1. **Category-level (across stacks).** Each category stack runs its own processor cluster scoped to one `PROCESS_*` flag, writing to disjoint tables in a shared DB design. Total reindex wall-clock ≈ `max(category_times)` instead of `sum(...)`.
2. **Sub-processor-level (within a stack).** A category stack spins up **N processor services** (`dict-processor-<cat>-1 … -N`), each pinned to:
   - its own `STATE_SCHEMA_NAME` (e.g. `xyk_hist_data__batch_proc_1 … _8`), and
   - a disjoint block range via `PROCESS_FROM_BLOCK` / `PROCESS_TO_BLOCK`.
   They never touch overlapping `(entity, paraBlockHeight)` rows because the ranges don't overlap. The last processor in the chain runs `PROCESS_TO_BLOCK: -1` (follow head).

### Cluster coordination vars (set per processor service)
- **`STATE_SCHEMA_NAME`** — unique per processor; its private SQD state schema.
- **`ASSETS_TRACKER_PROCESSOR`** — exactly **one** processor per category cluster is `'true'`; all others `'false'`. The tracker runs `actualiseAssets()`; the rest block in `waitForAssetsActualisation`.
- **`ASSETS_ACTUALISATION_PROC_STATE_SCHEMA_NAME`** — every non-tracker processor points this at the tracker's `STATE_SCHEMA_NAME` so they know whom to wait on (e.g. all `xyk_hist_data__batch_proc_*` set this to `xyk_hist_data__batch_proc_8`, which is the one with `ASSETS_TRACKER_PROCESSOR: 'true'`).
- **`SUB_PROCESSORS_RANGES`** — `schema:from:to;schema:from:to;…` map, set on the **API** service so the unified `squidStatus` GraphQL query can aggregate per-processor progress.
- **`PROCESS_ONLY_MISSED_BLOCKS`** — backfill mode (fill gaps only). `'false'` for normal indexing.

### Per-stack shape
Each category stack contains: one `db-dict-indexer-<cat>` Postgres, one `dict-db-pgbouncer-<cat>` bouncer, one `dict-api-<cat>` (PostGraphile, Traefik-exposed at `storage-dict-<cat>-hist-data-v2.orca.hydration.cloud`), and N `dict-processor-<cat>-*` services. See `./docker-swarm-overview.md` for the shared patterns.

## Code map
- `self-hosted/storage-dictionary-indexer/st-dict-xyk-hist-data.stack.yml` — clearest multiprocessor example: 8 processors carving ~1M-block ranges, proc-8 as the assets tracker / head follower.
- `self-hosted/storage-dictionary-indexer/st-dict-all-in-one.stack.yml` — single-processor reference (all categories on).
- `indexers/storage-dictionary/CLAUDE.md` — "Multiprocessor mode", "Per-batch flow", "Deployment".
- Legacy SQD-cloud per-category manifests: `indexers/storage-dictionary/sqd-hosting-manifests/` (reference only).

## Gotchas
- **Exactly one `ASSETS_TRACKER_PROCESSOR: 'true'` per category cluster.** Two trackers → concurrent inserts into the shared `asset` table can deadlock. Zero trackers → every processor blocks forever in `waitForAssetsActualisation`. When adding a processor service, it must be `'false'` and point its actualisation schema at the existing tracker.
- **Ranges must be contiguous and non-overlapping.** Overlap risks duplicate-row contention; gaps leave un-indexed blocks. The chain is typically `from1..to1`, `to1+1..to2`, … with the final service at `-1` (head).
- **`SUB_PROCESSORS_RANGES` lives on the API service, and it can drift from the actual processor ranges.** It only drives the reported `squidStatus`; the real work is governed by each processor's `PROCESS_FROM_BLOCK/TO_BLOCK`. If the status query looks wrong but indexing is fine, suspect a stale `SUB_PROCESSORS_RANGES` string (some files carry an `acc_hist_data__*` example string even in non-account stacks).
- **`PERSIST_HIST_DATA_ONLY_ON_CHANGE: 'true'`** is the production default in these stacks (dedupe path). This changes when block compression runs — see the storage-dictionary `CLAUDE.md` key-constraint #8.
- **One migrations runner.** `IS_CUSTOM_DB_MIGRATIONS_RUNNER` should be true on exactly one processor; the runner has retry logic so concurrent runs are safe but slower. Verify which service owns it before assuming migrations ran.
- **All-in-one is the slow path.** Convenient for dev / small setups, but for a real reindex deploy the category stacks and carve ranges. Once caught up, scale each category down to a single head-following processor.
