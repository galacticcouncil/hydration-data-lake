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

---

## 🔧 Improvements and Usage

The **Storage Dictionary Indexer** is designed for simplicity, focusing on **data parsing and collection** without complex business logic. However, certain scenarios require **reindexing**, such as:

- Resolving **parsing issues**.
- Collecting **additional historical data**.

### 🗂️ Data Categories

To optimize reindexing and isolate different data categories, the dictionary indexer can be deployed separately for:

- **LBP Pools**
- **XYK Pools**
- **Omnipools**
- **Stablepools**

### 🛠 Deployment Architecture

The current implementation is designed to leverage **SQD hosting**, which supports **multiprocessor indexers**. For each data category:

- Four separate indexers are deployed with distinct APIs.
- Each indexer runs **five processors**, where each processor handles its own block range and writes to the same database.

#### SQD cloud Deployment Manifests

- [LBP Pools Deployment](deployment-lbp-pool.yaml)
- [XYK Pools Deployment](deployment-xyk-pool.yaml)
- [Omnipools Deployment](deployment-omnipool.yaml)
- [Stablepools Deployment](deployment-stablepool.yaml)

---

## Environment variables

All environment variables with default values can be found here - [.env.example](.env.example)

---

## Docker Image

A Docker image has been built and published based on the [Dockerfile](Dockerfile): [ghcr.io/mckrava/storage-dictionary-indexer](https://ghcr.io/mckrava/storage-dictionary-indexer).

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

- **`PROCESS_<LBP_POOLS | XYK_POOLS | OMNIPOOLS | STABLEPOOLS>: boolean`**  
  Determines which type(s) of pool will be processed by the processor. In a mono-indexer configuration, set all to `true` to handle data for all pools. In a multiprocessor configuration, assign each processor to specific pool types.

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

**Examples of environment variable usage can be found in the [SQD cloud deployment manifest files](deployment-lbp-pool.yaml) and [Docker Swarm stack files](../../self-hosted/storage-dictionary-multiprocessor.stack.yml).**

---

## 🏠 Self-Hosted Mode

Multiprocessor architecture can be implemented in self-hosted mode:

1. Run multiple **Processor applications** connected to the same database and API.
2. After completing the indexing of all blocks, terminate all but one processor.
   - The remaining processor can follow the latest blocks and continue indexing new data.

---

## 📈 Advantages of Storage Dictionary Indexer

- **Reusable Data**: Acts as a single source of truth for high-level indexers, reducing redundant RPC calls.
- **Optimized Performance**: Batch calls minimize latency and RPC payload.
- **Scalability**: Supports parallel processing via multiprocessor deployments.
- **Modular Design**: Isolate data categories for efficient reindexing and independent scalability.

---
