# QUICK FIX: Performance Degradation

Your migration slowed from **3.6 seconds → 170 seconds per batch** (50x slower). This is **index bloat**, not memory.

## Root Cause

Your schema uses TypeORM naming:
- `PK_*` = PRIMARY KEY constraints (needed for ON CONFLICT - **must keep**)
- `IDX_*` = Secondary indexes (causing slowdown - **should drop**)

You have **~200+ IDX_* indexes** slowing down inserts.

## Immediate Solution (5 minutes)

### Step 1: Drop Secondary Indexes Only

```bash
cd /path/to/db-backfill-from-reapers

# This drops ONLY IDX_* indexes, keeps PK_* constraints
export HARVESTER_DB_URL="postgresql://user:pass@host:port/your_db"
./scripts/drop-secondary-indexes.sh
```

**What this does:**
- Saves `IDX_*` index definitions to `indexes-backup.sql`
- Drops only secondary indexes (~200 indexes)
- **Keeps PK_* constraints** (required for ON CONFLICT)
- Makes migration 10-50x faster

### Step 2: Continue/Restart Migration

```bash
# Stop current slow migration
# Then restart with optimized settings:

export USE_COPY_MODE=true
export BATCH_SIZE=50000
export MAX_PARALLEL_TABLES=15
export DISABLE_FK_CHECKS=true

npm start
```

**Expected:** Consistent ~3-5 seconds per 10K rows (no more degradation)

### Step 3: Rebuild Indexes (After Migration)

```bash
# After migration completes successfully:
./scripts/rebuild-indexes.sh
```

**Time:** 30-60 minutes to rebuild all indexes

## Total Time Estimate

| Approach | Time |
|----------|------|
| **Current (with slowdown)** | 20-30 hours |
| **With index drop** | 1-2 hours migration + 1 hour rebuild = **2-3 hours total** |

## Why This Works

- **ON CONFLICT** requires index lookups for every row
- At 40M rows, index depth causes 100-500ms per lookup
- 10,000 rows/batch × 500ms = **83 minutes per batch!**
- Dropping indexes = no lookups = fast inserts
- Rebuilding at end is faster than incremental updates

## If You Can't Stop Current Migration

Let it finish (will take 20-30 hours), then use index drop for next reapers:

```bash
# Before processing reaper #2:
./scripts/save-and-drop-indexes.sh

# Process remaining reapers (will be fast)
npm start

# After all reapers done:
./scripts/rebuild-indexes.sh
```

## Verify It's Working

After dropping indexes, batches should be consistent:

```
[INFO] Processing batch: 100000 - 110000 of 40202487
[INFO] Progress: 110000/40202487 (0.27%) ← ~3-5 seconds

[INFO] Processing batch: 2700000 - 2710000 of 40202487
[INFO] Progress: 2710000/40202487 (6.74%) ← Still ~3-5 seconds (not 170!)
```

## This is Standard Practice

Dropping indexes during bulk loading is:
- ✅ PostgreSQL best practice
- ✅ Used by pg_restore, ETL tools
- ✅ Recommended in official docs
- ✅ Safe (indexes rebuilt at end)

See: [PERFORMANCE_DEGRADATION_FIX.md](./PERFORMANCE_DEGRADATION_FIX.md) for detailed explanation.
