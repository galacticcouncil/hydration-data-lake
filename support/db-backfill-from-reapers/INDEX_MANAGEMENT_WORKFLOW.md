# Index Management Workflow

## Overview

For maximum migration performance, drop secondary indexes before migration, then rebuild after completion.

## Three-Step Workflow

### Step 1: Save Indexes (Before Migration)

```bash
export HARVESTER_DB_URL="postgresql://user:password@host:port/your_harvester_db"

./scripts/save-secondary-indexes.sh
```

**What it does:**
- Scans for all `IDX_*` indexes in your harvester database
- Saves CREATE INDEX statements to `indexes-backup.sql`
- Shows summary of what will be saved

**Output:**
```
Found 200 secondary indexes (IDX_*)

✓ Saved 200 index definitions to: indexes-backup.sql
```

**File created:** `indexes-backup.sql`

---

### Step 2: Drop Indexes (Before Migration)

```bash
./scripts/drop-secondary-indexes-simple.sh
```

**What it does:**
- Checks that `indexes-backup.sql` exists (safety check)
- Shows what will be dropped and what will be kept
- Asks for confirmation
- Drops only `IDX_*` indexes
- **Keeps `PK_*` constraints** (required for ON CONFLICT)

**Output:**
```
Indexes to be dropped:
  Secondary indexes (IDX_*): 200

Indexes to be KEPT (required for ON CONFLICT):
  Primary keys (PK_*): 100

Drop 200 secondary indexes? (y/n) y

✓ Successfully dropped 200 secondary indexes
✓ Primary keys preserved for ON CONFLICT
```

---

### Step 3: Run Migration (Fast!)

```bash
export USE_COPY_MODE=true
export BATCH_SIZE=20000
export MAX_PARALLEL_TABLES=10

npm start
```

**Expected performance:**
- Consistent 3-5 seconds per 10K rows
- No more degradation to 170 seconds
- 10-50x faster overall

---

### Step 4: Restore Indexes (After Migration)

```bash
./scripts/restore-secondary-indexes.sh
```

**What it does:**
- Reads `indexes-backup.sql`
- Shows how many indexes will be restored
- Asks for confirmation
- Rebuilds all indexes (30-90 minutes)
- Verifies all indexes were created

**Output:**
```
Found 200 index definitions in backup

⏱️  Estimated rebuild time: 30-90 minutes

Restore 200 indexes? (y/n) y

Rebuilding indexes...
CREATE INDEX
CREATE INDEX
...

✓ Index rebuild completed in 45m 30s
✓ All indexes restored successfully!
```

---

## Complete Example

```bash
# Full migration workflow with index optimization

# 1. Save indexes
export HARVESTER_DB_URL="postgresql://user:pass@harvester.example.com:5432/harvester_db"
./scripts/save-secondary-indexes.sh

# 2. Drop indexes
./scripts/drop-secondary-indexes-simple.sh

# 3. Run migration (will be fast!)
export USE_COPY_MODE=true
export BATCH_SIZE=20000
export MAX_PARALLEL_TABLES=10
npm start

# 4. Restore indexes
./scripts/restore-secondary-indexes.sh

# 5. Validate migration
node validate-migration.js "$REAPER_1_URL" --reaper-index 1
```

---

## Custom Backup Location

You can specify a custom backup file:

```bash
# Save to custom location
./scripts/save-secondary-indexes.sh /path/to/my-indexes.sql

# Drop (references custom file)
./scripts/drop-secondary-indexes-simple.sh /path/to/my-indexes.sql

# Restore from custom location
./scripts/restore-secondary-indexes.sh /path/to/my-indexes.sql
```

---

## Time Estimates

### Without Index Drop (Current Slow Performance)

| Table Size | Time |
|-----------|------|
| 10M rows | 15-20 hours |
| 40M rows | 30-40 hours |
| 100M rows | 80-100 hours |

Performance degrades exponentially as table grows.

### With Index Drop (Optimized)

| Stage | Time |
|-------|------|
| Save indexes | 10 seconds |
| Drop indexes | 30 seconds |
| **Migration** | **1-2 hours** |
| Restore indexes | 30-90 minutes |
| **Total** | **2-3.5 hours** |

Performance stays consistent throughout migration.

**Speedup: 10-20x faster overall!**

---

## Troubleshooting

### Issue: "Backup file not found"

**Cause:** You ran drop script before save script

**Solution:**
```bash
# Run save first
./scripts/save-secondary-indexes.sh

# Then drop
./scripts/drop-secondary-indexes-simple.sh
```

### Issue: "No indexes to drop"

**Cause:** Indexes already dropped or schema doesn't use IDX_* naming

**Solution:**
```bash
# Check what indexes exist
./scripts/check-indexes.sh

# If you see indexes but not IDX_*, your schema uses different naming
# You may need to manually identify and drop them
```

### Issue: Index restore fails

**Cause:** PostgreSQL error during CREATE INDEX (disk space, memory, permissions)

**Solution:**
```bash
# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log

# Retry restore
./scripts/restore-secondary-indexes.sh

# Or restore manually:
psql $HARVESTER_DB_URL -f indexes-backup.sql
```

---

## Safety Features

### Save Script
- ✅ Only saves `IDX_*` indexes (not constraints)
- ✅ Shows count before saving
- ✅ Creates human-readable SQL file

### Drop Script
- ✅ Checks for backup file before dropping
- ✅ Shows what will be dropped vs kept
- ✅ Asks for confirmation
- ✅ Never touches `PK_*` constraints
- ✅ Verifies after drop

### Restore Script
- ✅ Validates backup file exists
- ✅ Shows estimated time
- ✅ Asks for confirmation
- ✅ Displays progress
- ✅ Verifies all indexes restored

---

## What Gets Dropped vs Kept

### Dropped (Safe to Remove During Migration)
- ✅ `IDX_*` - Secondary indexes on foreign keys, timestamps, etc.
- Example: `IDX_78b8ff15d51bd5900fb7833a3f` on `facilitator_id`

### Kept (Required for Migration)
- ✅ `PK_*` - Primary key constraints (needed for `ON CONFLICT (id)`)
- ✅ `UQ_*` - Unique constraints (if any)
- Example: `PK_8c82d7f526340ab734260ea46be` on `id`

---

## Backup File Format

The `indexes-backup.sql` file contains standard PostgreSQL CREATE INDEX statements:

```sql
-- Secondary indexes backup
-- Generated by save-secondary-indexes.sh
-- Schema: public

CREATE INDEX "IDX_78b8ff15d51bd5900fb7833a3f" ON public.aave_facilitator_historical_data USING btree (facilitator_id);
CREATE INDEX "IDX_80e7fb4e92228ab21fc9737053" ON public.aave_facilitator_historical_data USING btree (para_timestamp);
CREATE INDEX "IDX_e0a03ffb16bfceb23a6bc7dd97" ON public.aave_facilitator_historical_data USING btree (para_block_height);
...
```

This is standard SQL that can be restored anytime:
```bash
# Manual restore
psql $HARVESTER_DB_URL -f indexes-backup.sql
```

---

## Why This Works

**Problem:** Indexes slow down bulk inserts

At 40M rows with 200 indexes:
- Each `INSERT` must update all indexes
- Index B-tree depth increases
- Random I/O increases
- Performance degrades exponentially

**Solution:** Drop indexes during bulk load

- `INSERT` only updates table and primary key
- No secondary index updates
- Consistent performance
- Rebuild indexes once at end (faster than incremental updates)

**This is standard practice** for PostgreSQL bulk loading and recommended in official docs.

---

## Summary

**Three simple scripts for 10-20x faster migration:**

1. `save-secondary-indexes.sh` - Save before you drop
2. `drop-secondary-indexes-simple.sh` - Drop for fast migration
3. `restore-secondary-indexes.sh` - Rebuild after migration

Safe, automated, and production-ready.
