# 🌊 Aggregation Indexer

An indexer for the **Hydration mainnet** and **Pareo testnet**, designed to collect and organize data on liquidity pools across chains.

---

## 📊 GraphQL API

For more details on the indexer's GraphQL API queries and subscriptions, refer to the [following resources](./src/apiSupport/README.md).

---

## 📊 Blockchain Storage Datasource

Aggregation Indexer is implemented with the flexibility to use multiple sources of blockchain data. These data sources are prioritized in a fallback sequence to ensure robust data retrieval:

1. **Storage Dictionary** (primary source for prefetched data — see [`indexers/storage-dictionary`](../storage-dictionary))
2. **Runtime API Calls** (specific data on-demand)
3. **RPC Calls to Storage** (fallback for all other methods)

The **StorageResolver** orchestrates this process by attempting to fetch the required data in the order listed above. If a primary source is unavailable or incomplete, the resolver falls back to the next source.

> 🧠 **Architecture spec**: the authoritative description of this indexer's internals (single-flow processor, batch lifecycle, reorg safety, spot-price calculation, account-balance aggregation, two-track DB migrations, etc.) lives in [`CLAUDE.md`](./CLAUDE.md). The README only covers the user-facing configuration surface.

---

### 🔧 Optimizing with Storage Dictionary

To maximize efficiency when using the **Storage Dictionary**, the indexer performs the following steps during the batch processing flow:

1. **Parse Events and Calls**: Identifies all required data at the start of the batch.
2. **Collect Keys**: Gathers the necessary keys for subsequent processing.
3. **Fetch Data**: Queries the Storage Dictionary for:

- Specific keys at specific blocks.
- All keys within a block range, avoiding heavy filtering in API queries (fetching redundant data is acceptable to improve reliability).

4. **Process Batch**: Utilizes the prefetched data during the batch processing logic.

This design minimizes latency, improves reliability, and reduces RPC payload.

---

## 🌐 Hydration and Paseo Chains

The Liquidity Pools Indexer supports both the **Hydration mainnet** and the **Hydration Paseo testnet** with the same codebase.

### 🔄 Switching Between Chains

Use the `CHAIN` runtime environment variable to specify the target chain:

```bash
CHAIN: "hydration" | "hydration_paseo"
```

### 🛠 Chain-Specific Details

- **Hydration Mainnet**:  
  Utilizes the Storage Dictionary to optimize data retrieval for events, calls, and storage.

- **Hydration Paseo Testnet**:  
  Does not support the Storage Dictionary. All storage data is fetched directly from the RPC node, relying on Runtime API and RPC calls for data retrieval.

### ⚠️ Note

While the same event handlers are used across both chains, chain-specific events, calls, and storage parsers are generated separately to ensure compatibility.

---

## Environment variables

All environment variables with default values can be found here - [.env.example](.env.example)

---

## Docker Image

A Docker image is built and published from this folder's [Dockerfile](Dockerfile) by the monorepo CI workflow ([.github/workflows/docker-images-build-publish.yml](../../.github/workflows/docker-images-build-publish.yml)) and pushed to GitHub Container Registry:

- **Image**: `ghcr.io/galacticcouncil/data-lake-aggregation-indexer`
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

- **`PROCESS_<LBP_POOLS | XYK_POOLS | OMNIPOOLS | STABLEPOOLS>: boolean`**  
  Determines which type(s) of pool will be processed by the processor. In a mono-indexer configuration, set all to `true` to handle data for all pools. In a multiprocessor configuration, assign each processor to specific pool types.

---

- **`USE_STORAGE_DICTIONARY: boolean`**  
  Determines whether the processor app should use the Storage Dictionary Indexer as the initial storage data source. If not, the processor app will attempt to obtain storage data via RPC calls.

---

- **`STORAGE_DICTIONARY_<LBPPOOL | XYKPOOL | OMNIPOOL | STABLEPOOL>_URL: string`**  
  API URL for the Storage Dictionary Indexer containing the appropriate data. If the dictionary is a single instance indexer that processes all types of pools, all four variables will share the same value.

**Examples of environment variable usage**: the active production deployment is Docker Swarm. See the stack files under [`self-hosted/aggregation-indexer/`](../../self-hosted/aggregation-indexer) (`orca-full-orca.yml`, `orca-full-catfish.yml`) and the catch-all [`self-hosted/all-in-one/hydration-datalake-full-stack-selfhosted.stack.yml`](../../self-hosted/all-in-one/hydration-datalake-full-stack-selfhosted.stack.yml). The SQD cloud deployment manifests in this folder (`deployment-*.yaml`) are kept as **legacy reference** — SQD cloud is no longer the active hosting target.
