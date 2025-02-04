# Liquidity Pools Indexer API

The Liquidity Pools Indexer API leverages the [PostGraphile](https://www.npmjs.com/package/postgraphile) library, adhering to official [SQD recommendations](https://docs.sqd.ai/sdk/resources/serving-graphql/#postgraphile). For implementation details, refer to the [api.ts](../api.ts) file.

## Database Migrations

The API incorporates subscriptions and custom views defined through SQL scripts. Database migrations are executed automatically when the API server launches, utilizing the [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate) library. Executed migrations are tracked in the `squid_processor.node_pg_migrations` table. Migration files are located in the [migrations](./apiMigrations/migrations) directory.

## API Enhancements

### Decorators and Views

To ensure a consistent and coherent field set, the API employs decorators based on [PostGraphile Smart Tags](https://postgraphile.org/postgraphile/next/smart-tags). Smart tags configurations are specified in the [postgraphile.tags.json5](./postgraphile.tags.json5) file. Additionally, the API introduces the following database views:

- `swap_inputs`
- `swap_outputs`
- `routed_trade_inputs`
- `routed_trade_outputs`

### Custom API Queries

The API provides custom queries for aggregated volume data:

- **`xykPoolHistoricalVolumesByPeriod`**: Retrieves aggregated volumes for specified XYK pools within a given block range.

- **`omnipoolAssetHistoricalVolumesByPeriod`**: Retrieves aggregated volumes for specified Omnipool assets within a given block range.

- **`stablepoolHistoricalVolumesByPeriod`**: Retrieves aggregated volumes for specified Stablepool pools within a given block range.

### API Subscriptions

The API supports the following subscriptions:

- **`xykPoolHistoricalVolume(filter: {poolIds: [String]})`**: Subscribes to events for each new record of `xykPoolHistoricalVolume`.

- **`omnipoolAssetHistoricalVolume(filter: {omnipoolAssetIds: [String]})`**: Subscribes to events for each new record of `omnipoolAssetHistoricalVolume`.

- **`stablepoolHistoricalVolume(filter: {poolIds: [String]})`**: Subscribes to events for each new record of `stablepoolHistoricalVolume`.

- **`routedTrade(filter: RoutedTradeSubscriptionFilter)`**: Subscribes to events for each new record of `routedTrade`. The `RoutedTradeSubscriptionFilter` includes the following fields:

  - `assetIds: [String!]`: List of asset IDs; at least one should be present in `routedTrade.allInvolvedAssetIds`.

  - `swapperIds: [String!]`: List of addresses; at least one should be present in `routedTrade.participantSwappers`.

  - `fillerIds: [String!]`: List of addresses; at least one should be present in `routedTrade.participantFillers`.

  - `feeRecipientIds: [String!]`: List of addresses; at least one should be present in `routedTrade.feeRecipients`.

  - `participantIds: [String!]`: List of addresses; at least one should be present in any of the following lists:

    - `routedTrade.participantSwappers`
    - `routedTrade.participantFillers`
    - `routedTrade.feeRecipients`

### Important Notice

The `lbpPoolHistoricalPrice` and `xykPoolHistoricalPrice` are tracked only after the indexer reaches the head of the archive. During the reindexing phase, prices are not processed due to the requirement for extensive storage calls.
