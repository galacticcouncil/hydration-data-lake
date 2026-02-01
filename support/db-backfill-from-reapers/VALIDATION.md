# Migration Validation

## Overview

The validation script (`validate-migration.js`) compares data between a reaper database and the harvester database to ensure migration was performed correctly.

## Validation Strategies

The script performs multiple validation checks to ensure data integrity:

### 1. **Row Count Validation** ✓
- Compares total number of rows in each table
- Fast and reliable check
- Automatically filters by `reaper_index` in harvester if column exists

### 2. **ID Range Validation** ✓
- Compares MIN and MAX ID values
- Ensures no IDs are missing at boundaries
- Only for tables with `id` column

### 3. **Random Sample Validation** ✓
- Picks random records and compares them field-by-field
- Configurable sample size (default: 10 records per table)
- Deep comparison including JSON/JSONB fields
- Can be skipped with `--skip-sampling`

### 4. **Checksum Validation** ✓
- Computes MD5 hash of all rows ordered by ID
- Fast comparison of entire dataset
- Can be skipped with `--skip-checksums` for very large tables
- Automatically handles complex data types

## Usage

### Basic Usage

```bash
node validate-migration.js "postgresql://user:pass@host:5432/reaper_db" --reaper-index 1
```

### With Options

```bash
# Validate with larger sample size
node validate-migration.js "postgresql://user:pass@host:5432/reaper_db" \
  --reaper-index 1 \
  --sample-size 50

# Validate specific tables only
node validate-migration.js "postgresql://user:pass@host:5432/reaper_db" \
  --reaper-index 1 \
  --tables "swap,transfer,pool"

# Skip checksums for large tables (faster)
node validate-migration.js "postgresql://user:pass@host:5432/reaper_db" \
  --reaper-index 1 \
  --skip-checksums

# Quick validation (counts only)
node validate-migration.js "postgresql://user:pass@host:5432/reaper_db" \
  --reaper-index 1 \
  --skip-sampling \
  --skip-checksums
```

## Command-Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `<reaper-db-url>` | PostgreSQL connection URL for reaper database | **Required** |
| `--reaper-index <number>` | Reaper index to filter harvester data | `null` |
| `--sample-size <number>` | Number of random records to validate per table | `10` |
| `--tables <list>` | Comma-separated list of tables to validate | All tables |
| `--skip-sampling` | Skip random record sampling | `false` |
| `--skip-checksums` | Skip checksum validation | `false` |

## Example Output

```
════════════════════════════════════════════════════════════════════════════════
MIGRATION VALIDATION
════════════════════════════════════════════════════════════════════════════════

Reaper DB:       postgresql://user:***@localhost:5432/reaper_1
Harvester DB:    postgresql://user:***@localhost:5432/harvester
Reaper Index:    1
Sample Size:     10
Skip Sampling:   false
Skip Checksums:  false

Validating all 45 tables

Validating table: swap
  ✓ Row count matches: 125432
  ✓ ID range matches: 1-125432
  ✓ Random samples match: 10/10
  ✓ Checksum matches: a1b2c3d4e5f6...

Validating table: transfer
  ✓ Row count matches: 98765
  ✓ ID range matches: 1-98765
  ✓ Random samples match: 10/10
  ✓ Checksum matches: f6e5d4c3b2a1...

...

════════════════════════════════════════════════════════════════════════════════
MIGRATION VALIDATION REPORT
════════════════════════════════════════════════════════════════════════════════

SUMMARY
────────────────────────────────────────────────────────────────────────────────
Overall Status:      ✓ PASSED
Total Tables:        45
Passed Tables:       45 ✓
Failed Tables:       0
Total Errors:        0
Total Warnings:      0

TABLE VALIDATION RESULTS
────────────────────────────────────────────────────────────────────────────────
✓ swap
  Row Count: ✓ (Reaper: 125432, Harvester: 125432)
  ID Range:  ✓ (Reaper: 1-125432, Harvester: 1-125432)
  Samples:   ✓ (10/10 matched)
  Checksum:  ✓

✓ transfer
  Row Count: ✓ (Reaper: 98765, Harvester: 98765)
  ID Range:  ✓ (Reaper: 1-98765, Harvester: 1-98765)
  Samples:   ✓ (10/10 matched)
  Checksum:  ✓

...

════════════════════════════════════════════════════════════════════════════════
Validation PASSED ✓
════════════════════════════════════════════════════════════════════════════════
```

## Exit Codes

- `0` - Validation passed (all tables match)
- `1` - Validation failed (one or more tables have mismatches)

This makes the script CI/CD friendly:

```bash
# In CI/CD pipeline
if node validate-migration.js "$REAPER_DB_URL" --reaper-index 1; then
  echo "Migration validated successfully"
else
  echo "Migration validation failed!"
  exit 1
fi
```

## Example Validation Scenarios

### Scenario 1: Validate After Full Migration

After migrating all reapers, validate each one:

```bash
# Validate reaper 1
node validate-migration.js "$REAPER_1_DB_URL" --reaper-index 1

# Validate reaper 2
node validate-migration.js "$REAPER_2_DB_URL" --reaper-index 2

# Validate reaper 3
node validate-migration.js "$REAPER_3_DB_URL" --reaper-index 3
```

### Scenario 2: Quick Sanity Check

Just verify row counts (fastest):

```bash
node validate-migration.js "$REAPER_DB_URL" \
  --reaper-index 1 \
  --skip-sampling \
  --skip-checksums
```

### Scenario 3: Deep Validation of Specific Tables

Thoroughly validate critical tables:

```bash
node validate-migration.js "$REAPER_DB_URL" \
  --reaper-index 1 \
  --tables "swap,transfer,pool,account" \
  --sample-size 100
```

### Scenario 4: Validate Large Tables

For very large tables, skip checksums to avoid timeouts:

```bash
node validate-migration.js "$REAPER_DB_URL" \
  --reaper-index 1 \
  --skip-checksums \
  --sample-size 50
```

## Validation Report Details

### Passed Table Example

```
✓ swap
  Row Count: ✓ (Reaper: 125432, Harvester: 125432)
  ID Range:  ✓ (Reaper: 1-125432, Harvester: 1-125432)
  Samples:   ✓ (10/10 matched)
  Checksum:  ✓
```

All checks passed - data is identical.

### Failed Table Example

```
✗ transfer
  Row Count: ✗ (Reaper: 98765, Harvester: 98700)
  ID Range:  ✗ (Reaper: 1-98765, Harvester: 1-98700)
  Samples:   ✗ (7/10 matched)
  Checksum:  ✗
  ✗  Row count mismatch: Reaper=98765, Harvester=98700
  ✗  ID range mismatch: Reaper=1-98765, Harvester=1-98700
  ✗  Sample validation failed: 7/10 matched
    - ID 12345, column "amount": Reaper=1000, Harvester=1500
    - ID 23456, column "fee": Reaper=10, Harvester=15
  ✗  Checksum mismatch
```

Multiple issues detected - needs investigation.

### Warning Example

```
✓ event
  Row Count: ✓ (Reaper: 50000, Harvester: 50000)
  ID Range:  ✓ (Reaper: 1-50000, Harvester: 1-50000)
  Samples:   ✓ (10/10 matched)
  Checksum:  ✗
  ⚠  Checksum validation failed: out of memory
```

Counts and samples match, but checksum failed due to table size. This is acceptable.

## Troubleshooting

### Issue: "Reaper index required"

**Problem**: Harvester table has `reaper_index` column but you didn't specify `--reaper-index`.

**Solution**: Add `--reaper-index <number>` to your command.

### Issue: Checksum validation timeout

**Problem**: Table is too large for MD5 checksum calculation.

**Solution**: Skip checksums for large tables:
```bash
node validate-migration.js "$REAPER_DB_URL" --reaper-index 1 --skip-checksums
```

### Issue: Sample mismatches but row counts match

**Problem**: Some records differ but overall counts are the same.

**Solution**:
1. Check if there are duplicate IDs
2. Verify ON CONFLICT behavior in migration
3. Check if data was modified during migration
4. Increase sample size to find more mismatches

### Issue: Row count mismatch

**Problem**: Different number of rows in reaper vs harvester.

**Solution**:
1. Check migration logs for errors
2. Verify table was fully migrated
3. Check if migration was interrupted
4. Re-run migration for this reaper

## Performance

Validation speed depends on table sizes and options:

| Tables | Row Count Only | With Sampling | With Checksums | Estimated Time |
|--------|---------------|---------------|----------------|----------------|
| 10 small (<1K rows) | ✓ | ✓ | ✓ | ~5 seconds |
| 45 medium (<100K rows) | ✓ | ✓ | ✓ | ~30 seconds |
| 45 large (>1M rows) | ✓ | ✓ | ⊘ | ~2 minutes |
| 45 very large (>10M rows) | ✓ | ✓ | ⊘ | ~5 minutes |

**Tip**: For very large datasets, use `--skip-checksums` and increase `--sample-size` instead.

## Best Practices

1. **Always validate after migration**
   - Run validation immediately after migrating each reaper
   - Don't delete reaper databases until validation passes

2. **Start with quick checks**
   - Run row count validation first (fastest)
   - If counts match, proceed with deeper validation

3. **Validate critical tables thoroughly**
   - Use higher `--sample-size` for important tables
   - Keep checksums enabled for critical data

4. **Use in CI/CD pipelines**
   - Script exits with proper codes (0 = success, 1 = failure)
   - Easy to integrate with automated deployments

5. **Save validation reports**
   - Redirect output to file for audit trail:
     ```bash
     node validate-migration.js "$REAPER_DB_URL" --reaper-index 1 | tee validation-reaper-1.log
     ```

## Advanced Usage

### Validate All Reapers in Loop

```bash
#!/bin/bash

# Array of reaper connection strings
REAPERS=(
  "postgresql://user:pass@host1:5432/reaper_1"
  "postgresql://user:pass@host2:5432/reaper_2"
  "postgresql://user:pass@host3:5432/reaper_3"
)

# Validate each reaper
for i in "${!REAPERS[@]}"; do
  REAPER_INDEX=$((i + 1))
  REAPER_URL="${REAPERS[$i]}"

  echo "Validating Reaper #$REAPER_INDEX..."

  if node validate-migration.js "$REAPER_URL" --reaper-index $REAPER_INDEX; then
    echo "✓ Reaper #$REAPER_INDEX validated successfully"
  else
    echo "✗ Reaper #$REAPER_INDEX validation failed!"
    exit 1
  fi
done

echo "All reapers validated successfully!"
```

### Parallel Validation

```bash
#!/bin/bash

# Validate multiple reapers in parallel
node validate-migration.js "$REAPER_1_URL" --reaper-index 1 &
node validate-migration.js "$REAPER_2_URL" --reaper-index 2 &
node validate-migration.js "$REAPER_3_URL" --reaper-index 3 &

# Wait for all to complete
wait

echo "All validations complete!"
```

## What the Validation Checks

### ✓ Data Integrity
- All rows from reaper exist in harvester
- Row counts match exactly
- ID ranges match (no gaps)

### ✓ Data Accuracy
- Random samples have identical values
- Checksums match (entire dataset is identical)
- JSON/JSONB fields are correctly serialized

### ✓ Migration Completeness
- No missing records
- No missing tables
- All data migrated successfully

### ⊘ Not Checked
- Indexes (migration only copies data, not indexes)
- Foreign key constraints
- Triggers and stored procedures
- Sequences (auto-increment state)

These are handled separately by the schema and should be verified manually if needed.
