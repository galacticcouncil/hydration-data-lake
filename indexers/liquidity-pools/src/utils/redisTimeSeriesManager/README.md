# RedisTimeSeriesManager

Redis TimeSeries management with database migrations for the Hydration indexer.

## Overview

`RedisTimeSeriesManager` is a singleton class that manages Redis TimeSeries operations for the Hydration indexer. It provides:

- **Time Series Data Management**: Store and retrieve time-series data for prices, volumes, and account balances
- **Database Migrations**: Programmatic cleanup and management of Redis data through a migration system
- **Efficient Querying**: Support for aggregations, bucketing, and filtering
- **Automatic Deduplication**: Handles duplicate data points intelligently

The class extends `RedisTimeSeriesMigrationsManager` to inherit migration management capabilities.

## Architecture

```
RedisTimeSeriesManager (index.ts)
    ↓ extends
RedisTimeSeriesMigrationsManager (migrationsManager.ts)
    ↓ uses
Migration Definitions (migrations.ts)
```

**Components:**
- `RedisTimeSeriesManager`: Main manager with all time series operations (singleton pattern)
- `RedisTimeSeriesMigrationsManager`: Base class providing migration management
- `migrations.ts`: Array of migration definitions with unique timestamp IDs

## Quick Start

```typescript
// On application bootstrap
const redisManager = RedisTimeSeriesManager.getInstance();
await redisManager.initClientAndRunMigrations();
```

## Usage

### Initialization

```typescript
import { RedisTimeSeriesManager } from './utils/redisTimeSeriesManager';

const redisManager = RedisTimeSeriesManager.getInstance();

// Option 1: Initialize client only
await redisManager.initClient();

// Option 2: Initialize and run migrations (recommended on app bootstrap)
await redisManager.initClientAndRunMigrations();
```

### Adding Time Series Data

#### Single Entry

```typescript
await redisManager.addToTimeSeries({
  name: RedisTimeSeriesName.price,
  assetAId: '5',
  assetBId: '10',
  value: 1.23,
  timestamp: Date.now(),
  keyPrefix: 'indexer-v1'  // Optional: defaults to 'none'
});
```

#### Batch Operations (Recommended for Performance)

```typescript
// Prices and volumes
await redisManager.addMultiplePrices([
  {
    name: RedisTimeSeriesName.price,
    assetAId: '5',
    assetBId: '10',
    value: 1.23,
    timestamp: Date.now(),
    keyPrefix: 'indexer-v1'
  },
  {
    name: RedisTimeSeriesName.volume,
    assetAId: '5',
    assetBId: '10',
    value: 100000,
    timestamp: Date.now(),
    keyPrefix: 'indexer-v1'
  }
]);

// Account balances
await redisManager.addMultipleAccountTotalBalances([
  {
    name: RedisTimeSeriesName.acc_bal_tot_tns,  // Transferable
    accountId: '7K5RuD...',
    value: 1000000,
    timestamp: Date.now(),
    keyPrefix: 'indexer-v1'
  },
  {
    name: RedisTimeSeriesName.acc_bal_tot_loc,  // Locked
    accountId: '7K5RuD...',
    value: 500000,
    timestamp: Date.now(),
    keyPrefix: 'indexer-v1'
  }
]);
```

### Querying Time Series Data

#### Get Prices and Volumes

```typescript
const data = await redisManager.getPricesAndVolumesFromTimeSeries({
  assetInId: '5',
  assetOutId: '10',
  startTimestamp: Date.now() - 86400000,  // 24 hours ago
  endTimestamp: Date.now(),
  indexerId: 'indexer-v1',
  bucketSizeMs: 3600000  // 1 hour buckets, 0 for raw data
});

// Returns:
// {
//   priceData: Map<string, Map<number, { timestamp: number; value: number }>>,
//   volumeData: Map<number, { timestamp: number; value: number }>
// }
```

#### Get Account Balances

```typescript
const balances = await redisManager.getAccTotalBalancesFromTimeSeries({
  accountId: '0x98d...',
  startTimestamp: Date.now() - 86400000,
  endTimestamp: Date.now(),
  indexerId: 'indexer-v1',
  bucketSizeMs: 3600000
});

// Returns:
// {
//   transferable: Map<number, { timestamp: number; value: number }>,
//   locked: Map<number, { timestamp: number; value: number }>
// }
```

### Clearing Time Series Data

Remove all time series data for a specific indexer/prefix:

```typescript
const result = await redisManager.clearTimeSeriesByKeyPrefix('indexer-v1');
console.log(`Deleted ${result.deletedCount} keys`);
```

## Redis DB Migrations

The migration system allows you to programmatically manage Redis data cleanup and maintenance on application bootstrap.

### How It Works

1. Migrations are defined in `migrations.ts` as an array of objects
2. Each migration has a unique timestamp-based ID
3. Executed migrations are tracked in Redis (`ts_db_migrations:all` set)
4. Migrations run only once; already-executed migrations are skipped
5. Migrations run automatically on app start when using `initClientAndRunMigrations()`

### Creating Migrations

Edit `migrations.ts` to add new migrations:

```typescript
import { TimeSeriesMigration } from './migrationsManager';

const timeSeriesMigrations: TimeSeriesMigration[] = [
  {
    id: '1733143200000',              // Unique timestamp: Date.now()
    action: 'CLEAR_BY_INDEXER_ID',
    keyPrefix: 'old-indexer-v1:price',
    description: 'Clear old indexer data'  // Optional but recommended
  },
  {
    id: '1733229600000',
    action: 'CLEAR_BY_INDEXER_ID',
    keyPrefix: 'test-indexer', // remove all data for particular indexer instance
    description: 'Remove test data'
  }
];

export default timeSeriesMigrations;
```

**Generate Migration ID:**
```bash
# JavaScript/Node
Date.now()  // e.g., 1733143200000

# Unix command
date +%s000
```

### Migration Actions

#### CLEAR_BY_INDEXER_ID

Clears all time series records with a specific indexer ID and name prefix.

**Pattern**: `ts:{keyPrefix}:*`

**Effect**:
- Deletes all keys matching the pattern
- Resets API state `accTotalBalanceLatestProcBlock` to 0 (triggers re-aggregation)

**Example**:
```typescript
{
  id: '1733143200000',
  action: 'CLEAR_BY_INDEXER_ID',
  keyPrefix: 'old-indexer-v1:acc_bal_tot_tns',
  description: 'Clear time series from old indexer version'
}
```

### Migration Execution Flow

```
1. Load migrations from migrations.ts
2. Check Redis for executed migrations (ts_db_migrations:all)
3. Filter out already-executed migrations
4. Execute pending migrations sequentially:
   - Run migration action (e.g., clear keys)
   - Reset API state if applicable
   - Mark migration as executed in Redis
5. Log detailed results
```

### Check Executed Migrations

```bash
# Redis CLI
redis-cli
> SELECT <TS_REDIS_KEY_SPACE_ID>
> SMEMBERS ts_db_migrations:all
1) "1733143200000"
2) "1733229600000"
```

### Manual Migration Execution

```typescript
import timeSeriesMigrations from './migrations';

const redisManager = RedisTimeSeriesManager.getInstance();
await redisManager.initClient();
await redisManager.runTimeSeriesMigrations(timeSeriesMigrations);
await redisManager.closeMigrationsClient();
```

## Configuration

The manager uses configuration from `AppConfig`:

**Redis Connection:**
- `TS_REDIS_PORT`: Redis server port
- `TS_REDIS_HOST`: Redis server host
- `TS_REDIS_PASS`: Redis password
- `TS_REDIS_KEY_SPACE_ID`: Redis database number

**Indexer Settings:**
- `INDEXER_ID`: Current indexer identifier
- `ASSET_PRICE_BASE_ASSET_ID`: Base asset for price calculations (e.g., '10' for USDT)

**Feature Flags:**
- `COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES`: Enable/disable writes
- `USE_HIST_DATA_FROM_REDIS_TIME_SERIES`: Enable/disable reads

## Key Structure

**Pattern**: `ts:{keyPrefix}:{name}:{id}`

**Examples:**
- Price: `ts:indexer-v1:price:5:10`
- Volume: `ts:indexer-v1:volume:5:10`
- Account Balance (Transferable): `ts:indexer-v1:acc_bal_tot_tns:7K5RuD...`
- Account Balance (Locked): `ts:indexer-v1:acc_bal_tot_loc:7K5RuD...`

## Time Series Labels

Each time series is created with labels for efficient filtering:

- `indVer`: Indexer version/ID (from `INDEXER_ID` config)
- `astAId`: Asset A ID (for prices/volumes)
- `astBId`: Asset B ID (for prices/volumes)
- `name`: Time series name (price, volume, acc_bal_tot_tns, acc_bal_tot_loc)
- `volPair`: Volume pair in sorted format (for volumes)
- `accountId`: Account ID (for balances)

## Examples

### Complete Application Bootstrap

```typescript
import { RedisTimeSeriesManager } from './utils/redisTimeSeriesManager';

async function bootstrap() {
  const redisManager = RedisTimeSeriesManager.getInstance();
  await redisManager.initClientAndRunMigrations();
  console.log('Redis TimeSeries ready');
}

bootstrap();
```

### Add Price During Indexing

```typescript
const redisManager = RedisTimeSeriesManager.getInstance();

// After processing a swap event
await redisManager.addToTimeSeries({
  name: RedisTimeSeriesName.price,
  assetAId: pool.assetA,
  assetBId: pool.assetB,
  value: calculatedPrice,
  timestamp: blockTimestamp,
  keyPrefix: appConfig.INDEXER_ID
});
```

### Query Historical Prices

```typescript
async function getPriceHistory(assetId: string, hours: number = 24) {
  const redisManager = RedisTimeSeriesManager.getInstance();
  const now = Date.now();

  const data = await redisManager.getPricesAndVolumesFromTimeSeries({
    assetInId: assetId,
    assetOutId: '10',  // USDT
    startTimestamp: now - (hours * 3600000),
    endTimestamp: now,
    indexerId: appConfig.INDEXER_ID,
    bucketSizeMs: 3600000  // 1-hour aggregation
  });

  return data.priceData;
}
```

## Best Practices

1. **Always use `initClientAndRunMigrations()` on app bootstrap** to ensure migrations run
2. **Use timestamp-based IDs** (`Date.now()`) for migrations to ensure uniqueness
3. **Add descriptive migration descriptions** for maintainability
4. **Test migrations in development** before deploying to production
5. **Use batch operations** (`addMultiplePrices`, `addMultipleAccountTotalBalances`) for better performance
6. **Don't delete executed migrations** from `migrations.ts` - they're tracked as executed in Redis
7. **Use consistent keyPrefix/indexerId** to organize data by indexer version
8. **Monitor migration logs** during deployment to catch issues early

## Troubleshooting

### Migration not running
- Check if migration ID already exists: `SMEMBERS ts_db_migrations:all`
- Ensure migration ID is unique (use timestamp)
- Check logs for error messages

### Data not appearing in queries
- Verify `USE_HIST_DATA_FROM_REDIS_TIME_SERIES` is enabled
- Confirm data was written with correct keyPrefix
- Check timestamp ranges are correct

### Performance issues
- Use batch operations for multiple writes
- Increase bucket size for queries to reduce data points
- Monitor Redis memory usage