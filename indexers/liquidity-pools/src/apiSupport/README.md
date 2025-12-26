# Aggregation Indexer API

Aggregation Indexer API leverages the [PostGraphile](https://www.npmjs.com/package/postgraphile) library, adhering to official [SQD recommendations](https://docs.sqd.ai/sdk/resources/serving-graphql/#postgraphile). For implementation details, refer to the [api.ts](../api.ts) file.

## Database Migrations

The API incorporates subscriptions and custom views defined through SQL scripts. Database migrations are executed automatically when the API server launches, utilizing the [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate) library. Executed migrations are tracked in the `squid_processor.node_pg_migrations` table. Migration files are located in the [migrations](./apiMigrations/migrations) directory.

## API Enhancements

### Decorators and Views

To ensure a consistent and coherent field set, the API employs decorators based on [PostGraphile Smart Tags](https://postgraphile.org/postgraphile/next/smart-tags). Smart tags configurations are specified in the [postgraphile.tags.json5](smartTags/configs/misc.postgraphile.tags.json5) file. Additionally, the API introduces the following database views:

- `swap_inputs`
- `swap_outputs`
- `routed_trade_inputs`
- `routed_trade_outputs`

### Common API definitions

More common types can be found [here](api/graphql/plugins/query/commonApiTypesDefinition.plugin.ts)

```graphql
enum AggregationTimeRange {
  _1H_
  _24H_
  _1W_
  _1M_
  _1Y_
  _ALL_
}
```

### Custom API Queries

The API provides custom queries for aggregated volume data:

- **`xykPoolHistoricalVolumesByPeriod`**: Retrieves aggregated volumes for specified XYK pools within a given block range.

- **`omnipoolAssetVolumeHistoricalDataByPeriod`**: Retrieves aggregated volumes for specified Omnipool assets within a given block range.

- **`stablepoolHistoricalVolumesByPeriod`**: Retrieves aggregated volumes for specified Stablepool pools within a given block range.

### API Subscriptions

The API supports the following subscriptions:

- **`xykPoolHistoricalVolume(filter: {poolIds: [String]})`**: _Subscribes to events for each new record of `xykPoolHistoricalVolume`._

- **`xykPoolHistoricalVolumeByPeriod(filter: {poolIds: [String], period: AggregationTimeRange})`**: _Subscribes to events for `batchXykpoolHistVolsList`
  when a specified pool ID is included in volume aggregation for the latest processed block (or batch of blocks).
  The event provides total volume data for each matching pool ID within the specified AggregationTimeRange. The aggregation period
  spans from the start of the given AggregationTimeRange up to the latest processed block in the indexer._

- **`omnipoolAssetHistoricalVolume(filter: {omnipoolAssetIds: [String]})`**: _Subscribes to events for each new record of `omnipoolAssetHistoricalVolume`._

- **`omnipoolAssetHistoricalVolumeByPeriod(filter: {assetIds: [String], period: AggregationTimeRange})`**: _Subscribes to events for `batchOmnipoolAssetHistVolsList`
  when a specified asset ID is included in volume aggregation for the latest processed block (or batch of blocks).
  The event provides total volume data for each matching asset ID within the specified AggregationTimeRange. The aggregation period
  spans from the start of the given AggregationTimeRange up to the latest processed block in the indexer._

- **`stablepoolHistoricalVolume(filter: {poolIds: [String]})`**: _Subscribes to events for each new record of `stablepoolHistoricalVolume`._

- **`stablepoolHistoricalVolumeByPeriod(filter: {poolIds: [String], period: AggregationTimeRange})`**: _Subscribes to events for `batchStableswapHistVolsList`
  when a specified pool ID is included in volume aggregation for the latest processed block (or batch of blocks).
  The event provides total volume data for each matching pool ID within the specified AggregationTimeRange. The aggregation period
  spans from the start of the given AggregationTimeRange up to the latest processed block in the indexer._

- **`routedTrade(filter: RoutedTradeSubscriptionFilter)`**: _Subscribes to events for each new record of `routedTrade`. The `RoutedTradeSubscriptionFilter` includes the following fields:_

  - `assetIds: [String!]`: List of asset IDs; at least one should be present in `routedTrade.allInvolvedAssetIds`.

  - `swapperIds: [String!]`: List of addresses; at least one should be present in `routedTrade.participantSwappers`.

  - `fillerIds: [String!]`: List of addresses; at least one should be present in `routedTrade.participantFillers`.

  - `feeRecipientIds: [String!]`: List of addresses; at least one should be present in `routedTrade.feeRecipients`.

  - `participantIds: [String!]`: List of addresses; at least one should be present in any of the following lists:

    - `routedTrade.participantSwappers`
    - `routedTrade.participantFillers`
    - `routedTrade.feeRecipients`

### Important Notice

---

The `lbpPoolHistoricalPrice` and `xykPoolHistoricalPrice` are tracked only after the indexer reaches the head of the
archive. During the reindexing phase, prices are not processed due to the requirement for extensive storage calls.

---

#### Subscription for Pools and Assets volume by period

Following subscriptions are based on appropriate entities:

- `xykPoolHistoricalVolumeByPeriod -> BatchXykpoolHistVolsList`
- `omnipoolAssetHistoricalVolumeByPeriod -> BatchOmnipoolAssetHistVolsList`
- `stablepoolHistoricalVolumeByPeriod -> BatchStableswapHistVolsList`
- These support entities contain all pool or asset IDs involved in volume aggregations within a single indexer blocks batch,
  which may consist of one or more blocks.

Since the processor saves all processed data from a batch of blocks in a single database transaction, this entity may
include IDs from multiple blocks. This approach ensures that the subscription event is triggered only after all volume
entities in the batch are saved, rather than after each individual volume aggregation, optimizing event handling and consistency.
