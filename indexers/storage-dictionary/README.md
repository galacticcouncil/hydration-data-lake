
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

#### Deployment Manifests
- [LBP Pools Deployment](deployment-lbp-pool.yaml)
- [XYK Pools Deployment](deployment-xyk-pool.yaml)
- [Omnipools Deployment](deployment-omnipool.yaml)
- [Stablepools Deployment](deployment-stablepool.yaml)

---

## 🏠 Self-Hosted Mode

The same architecture can be implemented in self-hosted mode:
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
