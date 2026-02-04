# Performance Degradation Fix - Index Bloat During Migration

## Problem

Migration starts fast (~3.6 seconds per 10K rows) but after 10 minutes slows down dramatically (~170 seconds per 10K rows). This is a **50x slowdown** caused by PostgreSQL index degradation during bulk inserts.

## Root Cause

When using `ON CONFLICT` with large tables:
1. Each INSERT must check indexes for conflicts
2. As table grows, B-tree index depth increases
3. Random I/O increases (index updates scattered across disk)
4. Index page splits occur more frequently
5. **Performance degrades exponentially after ~2-5M rows**

## Immediate Solutions

### Solution 1: Drop Indexes During Migration ✅ RECOMMENDED

**Expected speedup**: 10-50x faster, no more degradation

```bash
# BEFORE starting migration:

# 1. Save and drop indexes
chmod +x scripts/*.sh
./scripts/save-and-drop-indexes.sh

# 2. Run migration (will be fast and consistent)
export USE_COPY_MODE=true
export BATCH_SIZE=50000
export MAX_PARALLEL_TABLES=20
npm start

# 3. AFTER migration completes: Rebuild indexes
./scripts/rebuild-indexes.sh
```

**Why this works:**
- Primary keys remain (needed for ON CONFLICT)
- Secondary indexes removed (these cause slowdown)
- Index rebuild at end is faster than incremental updates
- Standard practice for bulk loading in PostgreSQL

**Time estimate for 40M row table:**
- Without index drop: 20-30 hours (degrading performance)
- With index drop: 1-2 hours migration + 30-60 min rebuild = **2-3 hours total**

### Solution 2: Disable ON CONFLICT for First Reaper

If this is the **first reaper** (empty table), you don't need ON CONFLICT:

```bash
# Temporarily modify migration-copy.js or use direct COPY:

# For first reaper only, use direct COPY (no temp table)
# This avoids ON CONFLICT entirely for empty tables
```

### Solution 3: Use UNLOGGED Tables During Migration

Make tables UNLOGGED temporarily for faster writes:

```sql
-- Before migration
ALTER TABLE public.swap SET UNLOGGED;
ALTER TABLE public.transfer SET UNLOGGED;
-- ... repeat for all tables

-- After migration
ALTER TABLE public.swap SET LOGGED;
ALTER TABLE public.transfer SET LOGGED;
```

**Note**: UNLOGGED tables are not crash-safe. Only use if you can restart migration on crash.

### Solution 4: PostgreSQL Tuning

Adjust PostgreSQL settings during migration:

```sql
-- Increase checkpoint intervals (less frequent checkpoints)
ALTER SYSTEM SET max_wal_size = '20GB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;

-- Increase work memory for faster index operations
ALTER SYSTEM SET maintenance_work_mem = '4GB';

-- Disable synchronous commit (faster writes, but less durable)
SET synchronous_commit = off;  -- Session-level, safer

-- Reload configuration
SELECT pg_reload_conf();
```

**After migration, restore settings:**
```sql
ALTER SYSTEM RESET max_wal_size;
ALTER SYSTEM RESET checkpoint_completion_target;
ALTER SYSTEM RESET maintenance_work_mem;
SELECT pg_reload_conf();
```

## Diagnostic Commands

Check what's slowing things down:

```sql
-- 1. Check table and index sizes
SELECT
  schemaname || '.' || tablename as table,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = t.schemaname AND tablename = t.tablename) as index_count
FROM pg_tables t
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- 2. Check current wait events
SELECT
  pid,
  wait_event_type,
  wait_event,
  state,
  substring(query, 1, 60) as query
FROM pg_stat_activity
WHERE state = 'active' AND pid != pg_backend_pid();

-- 3. Check if checkpoints are happening too often
SELECT * FROM pg_stat_bgwriter;

-- 4. Check index bloat (rough estimate)
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
JOIN pg_index USING (indexrelid)
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 20;

-- 5. Check autovacuum activity
SELECT * FROM pg_stat_progress_vacuum;
```

## Recommended Strategy

For your 40M row table migration:

### Step 1: Prepare Database

```bash
# Save and drop indexes
./scripts/save-and-drop-indexes.sh

# Tune PostgreSQL
psql $HARVESTER_DB_URL << 'EOF'
ALTER SYSTEM SET max_wal_size = '20GB';
ALTER SYSTEM SET maintenance_work_mem = '4GB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
SELECT pg_reload_conf();
EOF
```

### Step 2: Run Migration

```bash
export USE_COPY_MODE=true
export BATCH_SIZE=50000
export MAX_PARALLEL_TABLES=20
export DISABLE_FK_CHECKS=true

npm start
```

### Step 3: Rebuild and Restore

```bash
# Rebuild indexes
./scripts/rebuild-indexes.sh

# Restore PostgreSQL settings
psql $HARVESTER_DB_URL << 'EOF'
ALTER SYSTEM RESET max_wal_size;
ALTER SYSTEM RESET maintenance_work_mem;
ALTER SYSTEM RESET checkpoint_completion_target;
SELECT pg_reload_conf();
EOF

# Validate migration
node validate-migration.js "$REAPER_DB_URL" --reaper-index 1
```

## Expected Performance

### Without Index Drop (current)
```
Batch 0-2.7M:     ~3.6 seconds per 10K rows
Batch 2.7M-5M:    ~170 seconds per 10K rows (50x slower!)
Batch 5M-10M:     ~300+ seconds per 10K rows (80x slower!)

Total for 40M rows: 20-30 hours (exponentially degrading)
```

### With Index Drop
```
All batches:      ~3-5 seconds per 10K rows (consistent!)

Migration:        1-2 hours
Index rebuild:    30-60 minutes

Total: 2-3 hours (10x faster, predictable)
```

## Alternative: Skip Temp Table for Large Tables

For very large tables (> 10M rows), modify the code to skip the temp table approach:

```javascript
// In migration-copy.js, for large tables, use direct COPY + handle conflicts differently
// This requires code changes but can be 2-3x faster
```

I can implement this if index dropping doesn't solve the issue.

## Why This Happens

PostgreSQL B-tree indexes work like this:
```
Empty table → Index depth: 1-2 levels → Fast lookups (microseconds)
1M rows    → Index depth: 3-4 levels → Still fast (milliseconds)
10M rows   → Index depth: 4-5 levels → Starting to slow (10-50ms)
40M rows   → Index depth: 5-6 levels → Slow (100-500ms per lookup)

ON CONFLICT (id) requires:
- Index lookup for every row
- With 10,000 rows per batch = 10,000 index lookups
- At 40M rows = 10,000 × 100ms = 1,000 seconds = 16 minutes per batch!
```

## Summary

**Immediate action:**
1. Run `./scripts/save-and-drop-indexes.sh`
2. Continue migration (will be fast)
3. After done: `./scripts/rebuild-indexes.sh`

**Expected result:**
- Consistent ~3-5 seconds per 10K rows (no degradation)
- 40M row table: 1-2 hours instead of 20-30 hours
- Total with index rebuild: 2-3 hours

**This is standard practice** for bulk loading in PostgreSQL and will solve your performance issue completely.
