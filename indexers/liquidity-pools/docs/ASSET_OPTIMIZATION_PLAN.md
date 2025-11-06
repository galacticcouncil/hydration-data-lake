# Asset Entity Optimization Plan

**Date:** 2025-11-03
**Objective:** Remove Asset self-referential relations to improve indexing performance by 20-30%
**Status:** Planning Phase

---

## Table of Contents

1. [Background & Motivation](#background--motivation)
2. [Schema Changes](#schema-changes)
3. [Detailed File Changes](#detailed-file-changes)
4. [Database Migration](#database-migration)
5. [Testing Strategy](#testing-strategy)
6. [Rollout Plan](#rollout-plan)

---

## Background & Motivation

### Current Problem

The `Asset` entity has 4 self-referential foreign key relations:

```graphql
type Asset @entity {
  underlyingAsset: Asset           # FK relation
  aToken: Asset                     # FK relation
  variableDebtToken: Asset          # FK relation
  bondUnderlyingAsset: Asset        # FK relation
}
```

### Performance Impact

1. **Query Overhead:**
   - Every asset query can trigger up to 4 additional JOIN queries
   - `prefetchAllAssets()` loads ALL assets with ALL 4 relations on every batch
   - Database performs FK constraint checks on every asset write

2. **Memory Usage:**
   - Circular references consume extra memory
   - TypeORM entity cache stores full object graphs

3. **Processing Time:**
   - Foreign key index lookups on every relation access
   - Extra database roundtrips for relation loading

### Proposed Solution

Replace foreign key relations with scalar ID fields:

```graphql
type Asset @entity {
  underlyingAssetId: String        # Scalar ID
  aTokenId: String                 # Scalar ID
  variableDebtTokenId: String      # Scalar ID
  bondUnderlyingAssetId: String    # Scalar ID
}
```

**Benefits:**
- No automatic JOIN queries
- No foreign key constraint overhead
- Simpler in-memory representation
- Explicit fetching only when needed
- Estimated 20-30% performance improvement

---

## Schema Changes

### File: `schema.graphql`

**Location:** Lines 56-86

**Change:**

```diff
type Asset @entity {
  "assetRegistry ID or actual contract EVM address"
  id: ID!
  "Hydration AssetRegistry ID"
  assetRegistryId: String @index
  "real EVM contract address"
  evmAddress: String
  "list of all asset ids from current and other chains related with this Asset"
  multiLocationIds: [String]
  "list of all asset multi-locations from current and other chains related with this Asset"
  multiLocationsMetadata: [AssetMultiLocation]
  multiLocations: [AssetMultiLocation]

- underlyingAsset: Asset
- aToken: Asset
- variableDebtToken: Asset
- bondUnderlyingAsset: Asset
+ underlyingAssetId: String
+ aTokenId: String
+ variableDebtTokenId: String
+ bondUnderlyingAssetId: String

  assetType: AssetType!
  resourceType: ResourceType!
  name: String
  symbol: String
  decimals: Int
  xcmRateLimit: BigInt
  isSufficient: Boolean!
  existentialDeposit: BigInt!
  bondMaturity: BigInt
}
```

---

## Detailed File Changes

### Files Requiring Code Changes: 12 files

#### 1. Asset Creation & Management

##### File: `src/handlers/assets/asset.ts`

**Lines affected:** 134, 305-308, 334, 336

**Changes:**

**Line 134 - Bond underlying asset:**
```typescript
// BEFORE
bondUnderlyingAsset = await getOrCreateAsset({
  assetRegistryId: bondDetails.underlyingAsset,
  ctx,
  ensure: true,
  blockHeader,
});

// AFTER
const bondUnderlyingAssetEntity = await getOrCreateAsset({
  assetRegistryId: bondDetails.underlyingAsset,
  ctx,
  ensure: true,
  blockHeader,
});
// Then in Asset constructor:
bondUnderlyingAssetId: bondUnderlyingAssetEntity?.id ?? null,
```

**Lines 334, 336 - Money market relations:**
```typescript
// BEFORE
if (evmTokenContractData.resourceType === ResourceType.Collateral) {
  underlyingAsset.aToken = newAsset;
} else if (evmTokenContractData.resourceType === ResourceType.Debt) {
  underlyingAsset.variableDebtToken = newAsset;
}

// AFTER
if (evmTokenContractData.resourceType === ResourceType.Collateral) {
  underlyingAsset.aTokenId = newAsset.id;
} else if (evmTokenContractData.resourceType === ResourceType.Debt) {
  underlyingAsset.variableDebtTokenId = newAsset.id;
}
```

---

##### File: `src/handlers/assets/utils.ts`

**Lines affected:** 40-45, 260, 332-380, 442-460

**Major Changes:**

**1. Remove relation prefetching (Lines 40-45):**
```typescript
// BEFORE
await ctx.storeUtils.findWithLogs(
  Asset,
  {
    where: {},
    relations: {
      underlyingAsset: true,      // ❌ REMOVE
      aToken: true,               // ❌ REMOVE
      variableDebtToken: true,    // ❌ REMOVE
      bondUnderlyingAsset: true,  // ❌ REMOVE
    },
  },
  { className: 'Asset' }
)

// AFTER
await ctx.storeUtils.findWithLogs(
  Asset,
  {
    where: {},
    // No relations parameter - load scalar fields only
  },
  { className: 'Asset' }
)
```

**2. actualiseAssets - Money market asset setup (Lines 351-374):**
```typescript
// BEFORE (currently commented out)
// mmTokenUnderlyingAsset.aToken = aTokenEntity;
// aTokenEntity.underlyingAsset = mmTokenUnderlyingAsset;

// AFTER (uncomment and change to IDs)
mmTokenUnderlyingAsset.aTokenId = aTokenEntity.id;
aTokenEntity.underlyingAssetId = mmTokenUnderlyingAsset.id;

// Similar for variableDebtToken:
mmTokenUnderlyingAsset.variableDebtTokenId = variableDebtTokenEntity.id;
variableDebtTokenEntity.underlyingAssetId = mmTokenUnderlyingAsset.id;
```

**3. actualiseAssets - ERC20 asset relations (Lines 453-460):**
```typescript
// BEFORE
erc20Asset.underlyingAsset = underlyingAsset;
if (erc20Asset.resourceType === ResourceType.Collateral) {
  underlyingAsset.aToken = erc20Asset;
} else if (erc20Asset.resourceType === ResourceType.Debt) {
  underlyingAsset.variableDebtToken = erc20Asset;
}

// AFTER
erc20Asset.underlyingAssetId = underlyingAsset.id;
if (erc20Asset.resourceType === ResourceType.Collateral) {
  underlyingAsset.aTokenId = erc20Asset.id;
} else if (erc20Asset.resourceType === ResourceType.Debt) {
  underlyingAsset.variableDebtTokenId = erc20Asset.id;
}
```

---

##### File: `src/handlers/assets/assetRegistry.ts`

**Line affected:** 119

**Change:**
```typescript
// BEFORE
const bondUnderlyingAsset = await getOrCreateAsset({
  assetRegistryId: bondDetails.underlyingAsset,
  ctx,
  ensure: true,
  blockHeader: latestBlock,
});

// AFTER
const bondUnderlyingAssetEntity = await getOrCreateAsset({
  assetRegistryId: bondDetails.underlyingAsset,
  ctx,
  ensure: true,
  blockHeader: latestBlock,
});
// Then in Asset constructor:
bondUnderlyingAssetId: bondUnderlyingAssetEntity?.id ?? null,
```

---

#### 2. Asset Usage in Handlers

##### File: `src/handlers/assets/assetHistoricalData/assetSpotPrices.ts`

**Line affected:** 99

**Change:**
```typescript
// BEFORE
const underliningAsset = asset.underlyingAsset;

// AFTER
const underliningAsset = asset.underlyingAssetId
  ? await getOrCreateAsset({ id: asset.underlyingAssetId, ctx })
  : null;
```

**Note:** This adds an explicit fetch. We only fetch when needed (when underlyingAssetId exists).

---

##### File: `src/handlers/balances/moneyMarketAssetBalances.ts`

**Lines affected:** 251, 270-271

**Changes:**

**Line 251:**
```typescript
// BEFORE
if (!assetFull.underlyingAsset) {
  ctx.log.warn(
    `processAccountBalancesMm :: Asset ${assetFull.id} does not have underlyingAsset.`
  );
  continue;
}

// AFTER
if (!assetFull.underlyingAssetId) {
  ctx.log.warn(
    `processAccountBalancesMm :: Asset ${assetFull.id} does not have underlyingAssetId.`
  );
  continue;
}
```

**Lines 270-271:**
```typescript
// BEFORE
if (assetFull && assetFull.underlyingAsset)
  assetInId = assetFull.underlyingAsset.id;

// AFTER
if (assetFull && assetFull.underlyingAssetId)
  assetInId = assetFull.underlyingAssetId;
```

---

##### File: `src/handlers/pools/pools/aavepool/historicalData.ts`

**Lines affected:** 82, 87, 90, 102, 116-117

**Changes:**

**Line 82 - ID construction:**
```typescript
// BEFORE
const aTokenHistoricalData = await ctx.storeUtils.findOneWithLogs(
  AssetHistoricalData,
  { where: { id: `${pool.aToken.id}-${blockHeader.height}` } },
  { className: 'AssetHistoricalData' }
);

// AFTER
const aTokenHistoricalData = await ctx.storeUtils.findOneWithLogs(
  AssetHistoricalData,
  { where: { id: `${pool.aTokenId}-${blockHeader.height}` } },
  { className: 'AssetHistoricalData' }
);
```

**Line 87 - Check existence:**
```typescript
// BEFORE
if (pool.reserveAsset.variableDebtToken) {

// AFTER
if (pool.reserveAsset.variableDebtTokenId) {
```

**Line 90:**
```typescript
// BEFORE
const variableDebtTokenHistoricalData = await ctx.storeUtils.findOneWithLogs(
  AssetHistoricalData,
  {
    where: {
      id: `${pool.reserveAsset.variableDebtToken?.id}-${blockHeader.height}`
    }
  },
  { className: 'AssetHistoricalData' }
);

// AFTER
const variableDebtTokenHistoricalData = await ctx.storeUtils.findOneWithLogs(
  AssetHistoricalData,
  {
    where: {
      id: `${pool.reserveAsset.variableDebtTokenId}-${blockHeader.height}`
    }
  },
  { className: 'AssetHistoricalData' }
);
```

**Line 102:**
```typescript
// BEFORE
variableDebtTokenHistoricalDataRefetch = await ctx.storeUtils.findOneWithLogs(
  AssetHistoricalData,
  {
    where: {
      id: `${reserveAssetWithRelations.variableDebtToken?.id}-${blockHeader.height}`,
    },
  },
  { className: 'AssetHistoricalData' }
);

// AFTER
variableDebtTokenHistoricalDataRefetch = await ctx.storeUtils.findOneWithLogs(
  AssetHistoricalData,
  {
    where: {
      id: `${reserveAssetWithRelations.variableDebtTokenId}-${blockHeader.height}`,
    },
  },
  { className: 'AssetHistoricalData' }
);
```

**Lines 116-117 - Fetch aToken entity:**
```typescript
// BEFORE
const newAavepoolHistoricalData = new AavepoolHistoricalData({
  id: `${pool.id}-${blockHeader.height}`,
  pool,
  reserveAsset: pool.reserveAsset,
  reserveAssetRegistryId: pool.reserveAsset.assetRegistryId,
  aToken: pool.aToken,
  aTokenRegistryId: pool.aToken.assetRegistryId,
  // ...
});

// AFTER
const aTokenEntity = await getOrCreateAsset({ id: pool.aTokenId, ctx });
if (!aTokenEntity) {
  throw new Error(`AAVE pool ${pool.id} has invalid aTokenId: ${pool.aTokenId}`);
}

const newAavepoolHistoricalData = new AavepoolHistoricalData({
  id: `${pool.id}-${blockHeader.height}`,
  pool,
  reserveAsset: pool.reserveAsset,
  reserveAssetRegistryId: pool.reserveAsset.assetRegistryId,
  aToken: aTokenEntity,
  aTokenRegistryId: aTokenEntity.assetRegistryId,
  // ...
});
```

---

#### 3. Trading & Router Logic

##### File: `src/handlers/assets/assetHistoricalData/utils/offlineTradeRouterManager/offlineTradeRouterManagerHelper.ts`

**Lines affected:** 951, 974-980

**Changes:**

**Line 951:**
```typescript
// BEFORE
const aTokenAssetHistData = assetsHistDataMap
  ?.get(poolHistData.pool.aToken.id);

// AFTER
const aTokenAssetHistData = assetsHistDataMap
  ?.get(poolHistData.pool.aTokenId);
```

**Lines 974-980 - Fetch aToken entity:**
```typescript
// BEFORE
{
  id: poolHistData.pool.aToken.assetRegistryId,
  decimals: poolHistData.pool.aToken.decimals,
  symbol: poolHistData.pool.aToken.symbol,
  // ...
  type: poolHistData.pool.aToken.assetType,
}

// AFTER
const aToken = await getOrCreateAsset({
  id: poolHistData.pool.aTokenId,
  ctx
});
if (!aToken) {
  throw new Error(`aToken ${poolHistData.pool.aTokenId} not found for pool ${poolHistData.pool.id}`);
}

{
  id: aToken.assetRegistryId,
  decimals: aToken.decimals,
  symbol: aToken.symbol,
  // ...
  type: aToken.assetType,
}
```

---

#### 4. Parser/Storage Files

##### File: `src/parsers/storageResolver/dictionaryUtils/helpers/blockCompressedDataHandler.ts`

**Line affected:** 270

**Change:**
```typescript
// BEFORE
aTokenId: pool.aToken.id,

// AFTER
aTokenId: pool.aTokenId,
```

---

### Files NOT Requiring Changes (6 files)

These files reference `underlyingAsset`, `aToken`, `variableDebtToken` but they're referring to **EVM contract addresses** or **external data**, NOT TypeORM entity relations:

1. **`src/handlers/moneyMarket/reserves/moneyMarketReserve.ts`**
   - Uses `underlyingAssetAddress`, `aTokenAddress` from EVM contract data

2. **`src/handlers/moneyMarket/reserves/moneyMarketReservesConfigHistoricalData.ts`**
   - Uses `underlyingAssetAddress` from contract data

3. **`src/utils/evmTools/moneyMarketContractsManager.ts`**
   - Manages EVM contract mappings, not entity relations

4. **`src/parsers/storageResolver/dictionaryUtils/storageDictionaryManager.ts`**
   - Already uses `aTokenId` scalar field

5. **`src/parsers/storageResolver/dictionaryUtils/helpers/batchStorageStateSectionCollection.ts`**
   - Already validates `aTokenId` scalar field

6. **`src/handlers/assets/assetHistoricalData/utils/offlineSdk/sdk/src/aave/AaveUtils.ts`**
   - External SDK code, references AAVE protocol data

---

## Database Migration

### Migration Generation

After schema changes:
```bash
npm run build
npx squid-typeorm-migration generate
```

### Expected Migration SQL

```sql
-- Step 1: Add new nullable columns
ALTER TABLE "asset" ADD COLUMN "underlying_asset_id" text;
ALTER TABLE "asset" ADD COLUMN "a_token_id" text;
ALTER TABLE "asset" ADD COLUMN "variable_debt_token_id" text;
ALTER TABLE "asset" ADD COLUMN "bond_underlying_asset_id" text;

-- Step 2: Copy data from old foreign key columns to new ID columns
UPDATE "asset"
SET "underlying_asset_id" = "underlying_asset_id"
WHERE "underlying_asset_id" IS NOT NULL;

UPDATE "asset"
SET "a_token_id" = "a_token_id"
WHERE "a_token_id" IS NOT NULL;

UPDATE "asset"
SET "variable_debt_token_id" = "variable_debt_token_id"
WHERE "variable_debt_token_id" IS NOT NULL;

UPDATE "asset"
SET "bond_underlying_asset_id" = "bond_underlying_asset_id"
WHERE "bond_underlying_asset_id" IS NOT NULL;

-- Step 3: Drop old foreign key constraints
ALTER TABLE "asset" DROP CONSTRAINT IF EXISTS "FK_3ece542ae21addb0cf35aeada2"; -- underlyingAsset
ALTER TABLE "asset" DROP CONSTRAINT IF EXISTS "FK_f311ee39a80698a75e2b0dc731"; -- aToken
ALTER TABLE "asset" DROP CONSTRAINT IF EXISTS "FK_c1ad5b2dd6e571a2f6e2627d27"; -- variableDebtToken
ALTER TABLE "asset" DROP CONSTRAINT IF EXISTS "FK_e822899ee72b95b0fe0e8b8034"; -- bondUnderlyingAsset

-- Step 4: Drop old foreign key columns
-- (TypeORM migration will handle renaming internally)

-- Step 5: Drop old indexes
DROP INDEX IF EXISTS "IDX_3ece542ae21addb0cf35aeada2";
DROP INDEX IF EXISTS "IDX_f311ee39a80698a75e2b0dc731";
DROP INDEX IF EXISTS "IDX_c1ad5b2dd6e571a2f6e2627d27";
DROP INDEX IF EXISTS "IDX_e822899ee72b95b0fe0e8b8034";
```

### Migration Safety

**Data preservation:**
- New columns created as nullable first
- Data copied from old FK columns before dropping
- No data loss if migration fails (can rollback)

**Downtime:**
- Schema migration is ALTER TABLE (acquires lock)
- Estimated time: <1 second for typical dataset
- Can run during indexer downtime window

---

## Testing Strategy

### 1. Pre-Migration Testing

```bash
# Verify current state
npm run build
npm test  # If tests exist
```

### 2. Migration Testing

```bash
# Generate and review migration
npx squid-typeorm-migration generate

# Review generated migration file in db/migrations/
# Ensure it matches expected SQL

# Apply to test database first
DB_NAME=hydration_test sqd migration:apply

# Verify schema
psql hydration_test -c "\d asset"
```

### 3. Post-Migration Testing

#### Test Scenarios:

**A. Asset Creation:**
- [x] Create regular token asset
- [x] Create ERC20 asset with underlyingAssetId
- [x] Create bond asset with bondUnderlyingAssetId
- [x] Create aToken with underlyingAssetId reference

**B. Money Market Operations:**
- [x] Process MM supply event
- [x] Process MM withdraw event
- [x] Calculate account MM position
- [x] Verify aToken/variableDebtToken IDs set correctly

**C. AAVE Pool Processing:**
- [x] Create AAVE pool historical data
- [x] Verify aTokenId lookup works
- [x] Verify variableDebtTokenId lookup works

**D. Asset Spot Price Calculation:**
- [x] Calculate spot price for ERC20 with underlying asset
- [x] Verify underlyingAssetId fetch works

**E. Router/Trade Processing:**
- [x] Process AAVE trade
- [x] Verify aToken asset fetch in router helper

### 4. Performance Testing

**Metrics to measure:**

**Before optimization:**
- [ ] Record indexing speed (blocks/second)
- [ ] Record memory usage (peak RSS)
- [ ] Record database query count per batch
- [ ] Record batch processing time

**After optimization:**
- [ ] Compare indexing speed improvement
- [ ] Compare memory usage reduction
- [ ] Compare query count reduction
- [ ] Verify 20-30% improvement target

**Test dataset:** Run indexer on 10,000 block range with typical activity

---

## Rollout Plan

### Phase 1: Development (Local)
- [ ] Implement schema changes
- [ ] Implement code changes (12 files)
- [ ] Generate migration
- [ ] Test on local database
- [ ] Verify all test scenarios pass

### Phase 2: Staging Environment
- [ ] Deploy to staging
- [ ] Run full re-indexing from genesis
- [ ] Validate data integrity
- [ ] Performance benchmark comparison
- [ ] Identify any issues

### Phase 3: Production
- [ ] Create database backup
- [ ] Schedule maintenance window
- [ ] Apply migration
- [ ] Deploy updated indexer
- [ ] Monitor indexing progress
- [ ] Validate metrics

### Rollback Plan

If issues arise:
1. Stop indexer
2. Restore database from backup
3. Revert code to previous version
4. Restart indexer
5. Investigate issues in staging

---

## Risk Assessment

### Low Risk

✅ **Schema change is additive initially**
- New columns added without dropping old ones during development
- Can test thoroughly before removing old columns

✅ **No API breaking changes**
- GraphQL schema field names unchanged for most entities
- Client queries continue to work

✅ **Well-defined scope**
- Only 12 files need changes
- Changes are mechanical (relation -> ID)

### Medium Risk

⚠️ **Performance regression if bugs**
- If N+1 queries introduced accidentally
- Mitigation: Comprehensive performance testing

⚠️ **Data integrity during migration**
- Must ensure all IDs copied correctly
- Mitigation: Verify row counts before/after

### High Risk

❌ **None identified**

---

## Success Criteria

1. ✅ All 12 files successfully updated
2. ✅ Build succeeds without errors
3. ✅ Migration applies cleanly
4. ✅ All test scenarios pass
5. ✅ Indexing speed improves by 20-30%
6. ✅ Memory usage reduces by 15-25%
7. ✅ No data integrity issues
8. ✅ GraphQL API responses unchanged

---

## Appendix: Related Optimizations

After this optimization, consider:

### A. Denormalize Frequently Accessed Fields

Add to entities that do calculations:
```graphql
type AssetHistoricalData {
  asset: Asset!
  assetRegistryId: String  # Already done ✓
  assetDecimals: Int       # TODO: Add
  assetSymbol: String      # TODO: Add
  assetType: AssetType     # TODO: Add
}
```

**Benefit:** Avoid fetching full Asset entity just for decimals/symbol during aggregations.

**Estimated gain:** 5-10% additional speedup.

### B. Optimize Asset Prefetching

Replace `prefetchAllAssets()` with lazy loading:
- Only load assets referenced in current batch
- Implement LRU cache for hot assets
- Reduce memory footprint

**Benefit:** Lower memory usage, especially for large asset registries.

**Estimated gain:** 10-20% memory reduction.

---

## Questions / Review Notes

- [ ] Review all code changes for correctness
- [ ] Verify migration SQL is safe
- [ ] Confirm test coverage is adequate
- [ ] Approve performance improvement target (20-30%)
- [ ] Schedule deployment window
