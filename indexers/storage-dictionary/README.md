# 📦 Storage Dictionary Indexer

An indexer for the Hydration blockchain designed to collect and organize **historical storage data** for each block. This solution is optimized for **fast, filtered access** to storage data with minimal latency and serves as a robust middleware between the blockchain and high-level indexers.

---

## 💡 Concept

The **Subsquid (SQD) Framework** provides powerful tools for accessing blockchain storage. However, when an indexer requires extensive storage data for block processing, the **reindexing process** can become a bottleneck due to the high number of storage calls.

To mitigate this, the **batch processing flow** in the SQD framework allows for the following optimizations:

1. Parse all necessary events and calls in a batch of blocks.
2. Collect and group the required keys by block.
3. Prefetch the collected keys using methods like `getMany` to reduce RPC overhead.
4. Use the prefetched storage data in subsequent batch processing.

### 🚀 Benefits of Batch Processing

This approach significantly reduces batch processing time. However, it still has several challenges:

- **Reindexing Time**: Each new indexer version must reprocess data, which is time-intensive.
- **RPC Node Load**: Extensive RPC calls place a heavy load on the node.
- **Redundant Calls**: Running multiple new indexers leads to duplicated RPC calls.

---

## ❓ How Does the Storage Dictionary Address These Problems?

The **Storage Dictionary Indexer** solves these issues by focusing solely on **storage state indexing**:

- It indexes storage states for specific pallets on **every block**.
- The indexed data is stored in its own database, accessible via a **GraphQL API**.
- It minimizes latency and payload to RPC nodes by using **batch calls** to fetch storage data.

Although storing storage state for every block may seem redundant, the immutable nature of blockchain storage allows the same **Storage Dictionary instance** to act as a **centralized, reusable middleware** for multiple high-level indexers with complex event/call processing logic.

> 🧠 **Architecture spec**: the authoritative description of this indexer's internals (per-batch flow, multiprocessor mode, `BlockCompressedData`, two-track DB migrations, reorg safety, etc.) lives in [`CLAUDE.md`](./CLAUDE.md). The README only covers configuration and deployment.

### 📦 Dual persistence: full rows + compressed block blob

For each indexed block, the dictionary writes **both**:

- **Full per-entity rows** (`Xykpool`, `Omnipool`, `Stableswap`, `AssetHistoricalData`, `Aavepool`, `EmaOracle`, `AccountAssetBalanceHistoricalData`, etc.) — queryable via PostGraphile for analytics, debugging, cross-block filters.
- **`BlockCompressedData`** — a single row per block containing a gzip+base64 blob of all dictionary entities for that block. Consumers (the aggregation indexer) fetch one row + client-side decompress instead of running N joined queries. End-to-end ~10× faster than fetching the equivalent denormalized rows.

Both representations are written in the same SQD transaction, so they cannot diverge.

---

## 🔧 Improvements and Usage

The **Storage Dictionary Indexer** is designed for simplicity, focusing on **data parsing and collection** without complex business logic. However, certain scenarios require **reindexing**, such as:

- Resolving **parsing issues**.
- Collecting **additional historical data**.

### 🗂️ Data Categories

Each `PROCESS_*` flag scopes a processor instance to one data category, so a parsing fix or backfill can be re-run for one category without touching the others. Categories:

- **LBP Pools** (`PROCESS_LBP_POOLS`)
- **XYK Pools** (`PROCESS_XYK_POOLS`)
- **Omnipools** (`PROCESS_OMNIPOOLS`)
- **Stableswap pools** (`PROCESS_STABLEPOOLS`)
- **Generic historical data** (`PROCESS_GENERIC_HIST_DATA`) — assets, oracles, Aave pools.
- **Account historical data** (`PROCESS_ACCOUNTS`) — per-block account-asset balances.

### 🛠 Deployment Architecture

The active deployment target is **Docker Swarm self-hosted**. One stack file per category lives under [`self-hosted/storage-dictionary-indexer/`](../../self-hosted/storage-dictionary-indexer):

- [`st-dict-lbp-hist-data.stack.yml`](../../self-hosted/storage-dictionary-indexer/st-dict-lbp-hist-data.stack.yml)
- [`st-dict-xyk-hist-data.stack.yml`](../../self-hosted/storage-dictionary-indexer/st-dict-xyk-hist-data.stack.yml)
- [`st-dict-omnipool-hist-data.stack.yml`](../../self-hosted/storage-dictionary-indexer/st-dict-omnipool-hist-data.stack.yml)
- [`st-dict-stableswap-hist-data.stack.yml`](../../self-hosted/storage-dictionary-indexer/st-dict-stableswap-hist-data.stack.yml)
- [`st-dict-generic-hist-data.stack.yml`](../../self-hosted/storage-dictionary-indexer/st-dict-generic-hist-data.stack.yml)
- [`st-dict-account-hist-data.stack.yml`](../../self-hosted/storage-dictionary-indexer/st-dict-account-hist-data.stack.yml)
- [`st-dict-all-in-one.stack.yml`](../../self-hosted/storage-dictionary-indexer/st-dict-all-in-one.stack.yml) — single-processor catch-all (all `PROCESS_*` flags on).

The split enables two layered parallelisms: across stacks (each category indexes in parallel) and within a stack (multiple sub-processors, each pinned to its own `STATE_SCHEMA_NAME` and a disjoint block range via `SUB_PROCESSORS_RANGES`). See `CLAUDE.md` "Deployment" section for the full playbook.

#### SQD cloud manifests (legacy reference)

The `sqd-hosting-manifests/` folder (`deployment-lbp-pool.yaml`, `deployment-xyk-pool.yaml`, `deployment-omnipool.yaml`, `deployment-stablepool.yaml`, `deployment-generic-hist-data.yaml`, `deployment-account-hist-data.yaml`, `deployment-all-in-one.yaml`) is kept as a reference for env-var combinations per category. SQD cloud is **no longer the active hosting target**.

---

## Environment variables

All environment variables with default values can be found here - [.env.example](.env.example)

---

## Docker Image

A Docker image is built and published from this folder's [Dockerfile](Dockerfile) by the monorepo CI workflow ([.github/workflows/docker-images-build-publish.yml](../../.github/workflows/docker-images-build-publish.yml)) and pushed to GitHub Container Registry:

- **Image**: `ghcr.io/galacticcouncil/data-lake-storage-dictionary-indexer`
- **Tags**: `latest` for `main`; `wip-<sanitized-branch>` for feature branches; every build is also tagged with the commit SHA.

### Environment Variables Explanation

- **`IGNORE_ARCHIVE_DATA_SOURCE: boolean`**  
  This variable helps avoid using the SQD archive by working alongside the `GATEWAY_HYDRATION_HTTPS` variable, which has a fallback value.

---

- **`GATEWAY_HYDRATION_HTTPS: string`**  
  URL for the SQD archive, with naming history: `archive -> gateway -> portal`. Default: `https://v2.archive.subsquid.io/network/hydradx`.

---

- **`PROCESS_FROM_BLOCK: number`**  
  Specifies the block height from which the processor application starts processing. Default: `0`.

---

- **`PROCESS_TO_BLOCK: number`**  
  Specifies the block height to which the processor application processing blockchain. Default: `-1` - following latest blocks.

---

- **`PROCESS_<LBP_POOLS | XYK_POOLS | OMNIPOOLS | STABLEPOOLS | GENERIC_HIST_DATA | ACCOUNTS>: boolean`**  
  Determines which data category(s) will be processed by the processor. In a mono-indexer configuration, set all to `true` to handle every category. In a multi-stack production deployment, exactly one category per stack — see [Data Categories](#-data-categories).

---

- **`STATE_SCHEMA_NAME: string`**  
  Designates the PostgreSQL DB schema for collecting the processor state. This is particularly useful for multiprocessor indexers where several processors collect data in the same DB. Each processor's state (e.g., current processing block height) must be separately saved.

---

- **`ASSETS_TRACKER_PROCESSOR: boolean`**  
  Assigns a processor to track all asset states (`AssetRegistry.assets`) in each block. The storage dictionary needs to track all assets to use different RPC calls based on asset type (e.g., balance of `Token` assets fetched from `Tokens.accounts` storage, whereas `Erc20` assets use the Runtime API).

---

- **`ASSETS_ACTUALISATION_PROC_STATE_SCHEMA_NAME: string`**  
  To prevent DB transaction conflicts, specify the state schema name for the processor assigned as `ASSETS_TRACKER_PROCESSOR`. For a mono-processor configuration, this value matches `ASSETS_TRACKER_PROCESSOR`.

---

- **`SUB_BATCH_SIZE: number`**  
  Defines a sub-batch as a subset of blocks from the processor batch handler. Batches process blocks as a whole, potentially containing up to 100k blocks on reindexing, which may cause RPC rate limit errors. The processor splits the main batch into smaller chunks, processing sequentially. `INDEXER_MAX_SUB_BATCH_SIZE` can be divided among multiple processors if an indexer runs multiple processors (`INDEXER_MAX_SUB_BATCH_SIZE / INDEXER_SUB_PROCESSORS_NUMBER`).

---

- **`INDEXER_MAX_SUB_BATCH_SIZE: number`**  
  The maximum timeout allowed between processing individual sub-batches.

---

- **`SUB_BATCH_MAX_TIMEOUT_MS: number`**  
  Specifies the number of deployed sub-processors in the indexer, defined manually to ensure accuracy because automatic detection may be incorrect.

---

- **`SUB_PROCESSORS_RANGES: string`**  
  Encodes configurations of all running processors within a particular indexer, necessary for the API application to handle `squidStatus` API queries with data for each processor's processing block ranges. The pattern is: `processor_1_state_schema_name:process_from_block:process_to_block;processor_2_state_schema_name:process_from_block:process_to_block; ...`

---

- **`PROCESS_ONLY_MISSED_BLOCKS: boolean`**  
  Backfill mode. When `true`, the processor loads rows already in the DB into batch state and marks their block heights as processed, so per-block handlers become no-ops for blocks already indexed. Use it together with a custom `PROCESS_FROM_BLOCK`/`PROCESS_TO_BLOCK` to fill in gaps without redoing existing snapshots.

---

- **`PERSIST_HIST_DATA_ONLY_ON_CHANGE: boolean`**  
  - `false` (default): every per-block handler saves its row inline — DB always has one row per `(entity, block)`. Higher storage cost.  
  - `true`: per-block handlers only stage into batch state. At batch end, candidates are diffed against the in-memory "last persisted" cache and written only when something actually changed. Deduplicated mode used by long-running historical-data sub-indexers.

---

- **`IS_CUSTOM_DB_MIGRATIONS_RUNNER: boolean`**  
  Exactly one processor in a multiprocessor cluster should run hand-written SQL migrations (`src/customDbMigrations/`). All others set this to `false` to avoid racing each other through `node_pg_migrations`.

**Examples of environment variable usage**: the active production deployment is Docker Swarm — see the per-category stack files under [`self-hosted/storage-dictionary-indexer/`](../../self-hosted/storage-dictionary-indexer) listed in [Deployment Architecture](#-deployment-architecture). The SQD cloud manifests in `sqd-hosting-manifests/` are kept as legacy reference only.

---

## 🏠 Self-Hosted Mode

The production deployment topology runs the dictionary as multiple parallel processors sharing the same DB:

1. Bring up the per-category stacks under [`self-hosted/storage-dictionary-indexer/`](../../self-hosted/storage-dictionary-indexer) — each stack is scoped to one `PROCESS_*` category and writes to disjoint tables, so categories run fully in parallel.
2. Within a stack, scale to N sub-processors by giving each a unique `STATE_SCHEMA_NAME` and a disjoint block range via `SUB_PROCESSORS_RANGES`. `INDEXER_MAX_SUB_BATCH_SIZE / INDEXER_SUB_PROCESSORS_NUMBER` keeps the aggregate RPC load constant.
3. Exactly one processor in the cluster runs as `ASSETS_TRACKER_PROCESSOR=true` (and `IS_CUSTOM_DB_MIGRATIONS_RUNNER=true`); all others block in `waitForAssetsActualisation` until the tracker has published its first batch.
4. After historical sync, scale each category back to a single head-following processor.

---

## 📈 Advantages of Storage Dictionary Indexer

- **Reusable Data**: Acts as a single source of truth for high-level indexers, reducing redundant RPC calls.
- **Optimized Performance**: Batch calls minimize latency and RPC payload.
- **Scalability**: Supports parallel processing via multiprocessor deployments.
- **Modular Design**: Isolate data categories for efficient reindexing and independent scalability.

---
