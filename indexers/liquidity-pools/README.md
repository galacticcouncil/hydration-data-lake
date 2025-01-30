
# 🌊 Liquidity Pools Indexer

An indexer for the **Hydration mainnet** and **Pareo testnet**, designed to collect and organize data on liquidity pools across chains.

---

## 📊 Blockchain Storage Datasource

The Liquidity Pools Indexer is implemented with the flexibility to use multiple sources of blockchain data. These data sources are prioritized in a fallback sequence to ensure robust data retrieval:

1. **Storage Dictionary** (primary source for prefetched data)
2. **Runtime API Calls** (specific data on-demand)
3. **RPC Calls to Storage** (fallback for all other methods)

The **StorageResolver** orchestrates this process by attempting to fetch the required data in the order listed above. If a primary source is unavailable or incomplete, the resolver falls back to the next source.

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

A Docker image has been built and published based on the [Dockerfile](Dockerfile): [ghcr.io/mckrava/liquidity-pools-indexer](https://ghcr.io/mckrava/liquidity-pools-indexer).

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




**Examples of environment variable usage can be found in the [SQD cloud deployment manifest files](./deployment-hydration-indexer.yaml) and [Docker Swarm stack files](../../self-hosted/liquidity-pools.stack.yml).**

---

### Currently tracking for following entities are implemented:

- assets *(all assets based on AssetsRegistry pallet and Registered/Updated events)*

- lbp pool entities *(with actual assets balances)*
- lbp pool historical volumes *(per block where buy/sell activity is existing)*
- lbp pool historical prices *(asset balances per each block)*
- lbp pool operations *(swaps)*


- xyk pool entities *(with actual assets balances)*
- xyk pool historical volumes *(per block where buy/sell activity is existing)*
- xyk pool historical prices *(asset balances per each block)*
- xyk pool operations *(swaps)*


- omnipool entity
- omnipool assets *(each asset separately)*
- omnipool asset historical volumes *(per block where buy/sell activity is existing)*
- omnipool operations *(swaps)*


- stablepool entities
- stablepool assets *(each asset separately)*
- stablepool asset historical volumes *(per block where buy/sell/liquidity_added/liquidity_removed activity is existing)*
- stablepool operations *(swaps)*
- stablepool liquidity actions *(required for correct volume aggregation in case omnipool triggers remove_liquidity from stablepool as part of it's sell/buy order fullfilment)*
- stablepool asset liquidity historical amount

### API augments:

- query `xykPoolHistoricalVolumesByPeriod`get aggregated volumes for requested list of xyk pools by requested block range
- query `omnipoolAssetHistoricalVolumesByPeriod`get aggregated volumes for requested list of omnipool assets by requested block range
- query `stablepoolHistoricalVolumesByPeriod`get aggregated volumes for requested list of xyk pools by requested block range


- subscription `xykPoolHistoricalVolume(filter: {poolIds: [String]})` - events on each new record of `xykPoolHistoricalVolume`
- subscription `omnipoolAssetHistoricalVolume(filter: {omnipoolAssetIds: [String]})` - events on each new record of `omnipoolAssetHistoricalVolume`
- subscription `stablepoolHistoricalVolume(filter: {poolIds: [String]})` - events on each new record of `stablepoolHistoricalVolume`

### Important notices:

- `lbpPoolHistoricalPrice` and `xykPoolHistoricalPrice` are tracking only after indexer reached head of archive == on reindexing phase prices are not processing because it requires heavy storage calls
- `stablepoolAssetHistoricalVolume` contains `routedLiqRemovedAmount` value - it's amount of removed liquidity from stablepool, which is matched with omnipool sell/buy event within the same block. So this amount can be added to Sell/Buy volume of stablepool. **Match rules:**
  - `Omnipool.Buy/SellExecuted.asset_out == Stableswap.LiquidityRemoved.pool_id`
  - `Omnipool.Buy/SellExecuted.amount_out == Stableswap.LiquidityRemoved.shares`
- all API subscriptions have filter so UI can subscribe to updates of specific list of entities by ID
