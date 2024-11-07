# Hydration Liquidity Pools indexer

An indexer for the Hydration mainnet and Pareo chains, designed to collect and organize data on liquidity pools.

### Currently tracking for following entities is implemented:

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

