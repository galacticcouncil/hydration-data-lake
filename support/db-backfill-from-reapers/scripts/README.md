# Scripts Directory

## 🎯 Recommended Workflow (Use These)

For optimal migration performance, use these three scripts in order:

### 1. Save Indexes
```bash
./save-secondary-indexes.sh
```
Saves all `IDX_*` indexes to `indexes-backup.sql`

### 2. Drop Indexes
```bash
./drop-secondary-indexes-simple.sh
```
Drops `IDX_*` indexes for fast migration (keeps `PK_*` constraints)

### 3. Restore Indexes
```bash
./restore-secondary-indexes.sh
```
Rebuilds all indexes from backup after migration

## 📋 All Available Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| **save-secondary-indexes.sh** | ✅ Save IDX_* indexes | Before dropping indexes |
| **drop-secondary-indexes-simple.sh** | ✅ Drop IDX_* indexes | Before migration |
| **restore-secondary-indexes.sh** | ✅ Restore IDX_* indexes | After migration |
| check-indexes.sh | Check current indexes | Diagnostics |
| drop-indexes-fixed.sh | Drop all non-PK indexes | Alternative to drop-secondary-indexes-simple.sh |
| drop-secondary-indexes.sh | Drop + save in one | Alternative workflow |
| save-and-drop-indexes.sh | Save + drop in one | Alternative workflow (older version) |
| rebuild-indexes.sh | Rebuild from backup | Alternative to restore-secondary-indexes.sh |

## 🚀 Quick Start

```bash
# Complete workflow:
export HARVESTER_DB_URL="postgresql://user:password@host:port/db"

./save-secondary-indexes.sh
./drop-secondary-indexes-simple.sh

# Run your migration
cd ..
npm start

# After migration:
cd scripts
./restore-secondary-indexes.sh
```

## 📖 Documentation

- **[../QUICK_START_INDEX_OPTIMIZATION.md](../QUICK_START_INDEX_OPTIMIZATION.md)** - Quick reference
- **[../INDEX_MANAGEMENT_WORKFLOW.md](../INDEX_MANAGEMENT_WORKFLOW.md)** - Complete guide
- **[../PERFORMANCE_DEGRADATION_FIX.md](../PERFORMANCE_DEGRADATION_FIX.md)** - Technical details

## ⚙️ Environment Variables

All scripts use:
```bash
HARVESTER_DB_URL    # Required - PostgreSQL connection string
                    # Example: postgresql://user:pass@host:port/db
```

Set it before running scripts:
```bash
export HARVESTER_DB_URL="postgresql://your_connection_string"
```

## 📁 Files Created

| File | Created By | Used By |
|------|-----------|----------|
| `indexes-backup.sql` | save-secondary-indexes.sh | restore-secondary-indexes.sh |

## 🔍 Diagnostic Scripts

### Check Current Indexes
```bash
./check-indexes.sh
```
Shows:
- Total index count
- Indexes per table
- Sample indexes
- Table and index sizes

Use this to verify indexes were dropped/restored correctly.

## ⚠️ Important Notes

### What Gets Dropped
- ✅ **`IDX_*`** - Secondary indexes (safe to drop during migration)

### What Gets Kept
- ✅ **`PK_*`** - Primary key constraints (required for ON CONFLICT)
- ✅ **`UQ_*`** - Unique constraints

### Safety
- All drop scripts ask for confirmation
- Backup file is validated before dropping
- Verification after drop/restore
- Case-sensitive index names handled correctly

## 🆘 Troubleshooting

### "Backup file not found"
Run save script first:
```bash
./save-secondary-indexes.sh
```

### "No indexes to drop"
Already optimized or different naming scheme. Check:
```bash
./check-indexes.sh
```

### Drop script fails
Try alternative:
```bash
./drop-indexes-fixed.sh
```

### Restore script fails
Manual restore:
```bash
psql $HARVESTER_DB_URL -f indexes-backup.sql
```

## 📝 Script Comparison

### Simple Workflow (Recommended)
```
save-secondary-indexes.sh
  ↓
drop-secondary-indexes-simple.sh
  ↓
[MIGRATION]
  ↓
restore-secondary-indexes.sh
```

### Combined Workflow (Alternative)
```
drop-secondary-indexes.sh (saves + drops in one step)
  ↓
[MIGRATION]
  ↓
restore-secondary-indexes.sh
```

### Old Workflow (Legacy)
```
save-and-drop-indexes.sh (older version, may have bugs)
  ↓
[MIGRATION]
  ↓
rebuild-indexes.sh
```

**Recommendation:** Use the Simple Workflow with three separate scripts for maximum clarity and safety.

## ✅ Verification

After each step, verify:

```bash
# After save:
ls -lh indexes-backup.sql
grep -c CREATE indexes-backup.sql

# After drop:
./check-indexes.sh
# Should show 0 or few IDX_* indexes

# After restore:
./check-indexes.sh
# Should show original count of IDX_* indexes
```

## 🎯 Performance Impact

**Without index optimization:**
- 3 seconds/batch → 170 seconds/batch after 2.7M rows
- 40M row table: 30-40 hours

**With index optimization:**
- Consistent 3-5 seconds/batch throughout
- 40M row table: 1-2 hours + 30-90 min rebuild = 2-3.5 hours total
- **15-20x faster!**

## 📞 Support

If you encounter issues:
1. Check [QUICK_START_INDEX_OPTIMIZATION.md](../QUICK_START_INDEX_OPTIMIZATION.md)
2. Check [INDEX_MANAGEMENT_WORKFLOW.md](../INDEX_MANAGEMENT_WORKFLOW.md)
3. Run diagnostics: `./check-indexes.sh`
4. Check PostgreSQL logs
