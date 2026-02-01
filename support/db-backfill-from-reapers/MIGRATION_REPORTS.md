# Migration Reports

## Overview

The migration tool now automatically generates comprehensive performance reports at the end of each migration run.

## Report Files

After migration completes, you'll find two report files:

### 1. `migration-report.json`
Complete migration statistics in JSON format (machine-readable).

### 2. `migration-report.txt`
Human-readable text report with formatted tables and summaries.

### 3. `migration-report-failed.json/txt` (if migration fails)
Partial report showing progress before failure.

## Report Contents

### Migration Summary
- **Start datetime**: When migration started
- **End datetime**: When migration completed
- **Total duration**: Total time taken (formatted and in seconds)

### Records Statistics
- **Total records**: Total number of rows migrated
- **Avg records/second**: Migration throughput
- **Avg seconds/record**: Time per record (useful for estimating future migrations)

### Data Size Statistics
- **Total bytes/MB/GB**: Total data migrated
- **Avg MB/second**: Data throughput
- **Avg seconds/MB**: Time per megabyte
- **Avg bytes/record**: Average row size

### Per-Reaper Statistics
For each reaper:
- Duration
- Records migrated
- Data size
- Number of tables

### Per-Table Statistics
For each table (sorted by record count):
- Table name
- Reaper index
- Duration
- Records migrated
- Data size
- Records per second

### Errors (if any)
- Total error count
- Error details with timestamps and context

## Example Text Report

```
═══════════════════════════════════════════════════════════════════════════════
MIGRATION REPORT
═══════════════════════════════════════════════════════════════════════════════

MIGRATION SUMMARY
────────────────────────────────────────────────────────────────────────────────
Start Time:       2026-01-31T21:30:00.000Z
End Time:         2026-01-31T22:15:30.000Z
Total Duration:   45m 30s

RECORDS
────────────────────────────────────────────────────────────────────────────────
Total Records:           15,234,567
Avg Records/Second:      5,584.58
Avg Seconds/Record:      0.000179

DATA SIZE
────────────────────────────────────────────────────────────────────────────────
Total Size:              285.43 GB
Total MB:                285434.32 MB
Total GB:                278.65 GB
Avg MB/Second:           104.57 MB/s
Avg Seconds/MB:          0.01 s/MB
Avg Bytes/Record:        19650

REAPERS
────────────────────────────────────────────────────────────────────────────────
Total Reapers:           3

  Reaper #1:
    Duration:     15m 20s
    Records:      5,123,456
    Data Size:    95.23 GB
    Tables:       45

  Reaper #2:
    Duration:     15m 5s
    Records:      5,056,789
    Data Size:    94.12 GB
    Tables:       45

  Reaper #3:
    Duration:     15m 5s
    Records:      5,054,322
    Data Size:    96.08 GB
    Tables:       45

TOP 10 TABLES BY RECORDS
────────────────────────────────────────────────────────────────────────────────
Table Name                              Records        Duration       Rec/s
────────────────────────────────────────────────────────────────────────────────
swap                                    2,345,678      3m 45s         10423.51
transfer                                1,987,654      2m 30s         13251.03
event                                   1,456,789      2m 15s         10790.58
call                                      987,654      1m 45s          9382.42
block                                     234,567      45s             5212.60
asset                                     123,456      30s             4115.20
account                                    98,765      25s             3950.60
omnipool_asset_historical_data            87,654      22s             3984.27
swap_fee                                  76,543      18s             4252.39
xykpool_volume_historical_data            65,432      15s             4362.13

═══════════════════════════════════════════════════════════════════════════════
Report generated at: 2026-01-31T22:15:30.000Z
═══════════════════════════════════════════════════════════════════════════════
```

## Example JSON Report Structure

```json
{
  "migration": {
    "startTime": "2026-01-31T21:30:00.000Z",
    "endTime": "2026-01-31T22:15:30.000Z",
    "totalDuration": "45m 30s",
    "totalDurationSeconds": 2730
  },
  "records": {
    "total": 15234567,
    "avgPerSecond": "5584.58"
  },
  "data": {
    "totalBytes": 299421835264,
    "totalMB": "285434.32",
    "totalGB": "278.65",
    "formatted": "278.65 GB",
    "avgMBPerSecond": "104.57",
    "avgSecondsPerMB": "0.01"
  },
  "performance": {
    "avgSecondsPerRecord": "0.000179",
    "avgRecordsPerSecond": "5584.58",
    "avgBytesPerRecord": 19650
  },
  "reapers": {
    "total": 3,
    "details": [...]
  },
  "tables": {
    "total": 135,
    "details": [...]
  },
  "errors": {
    "total": 0,
    "details": []
  }
}
```

## Using the Report

### Performance Analysis

**Check throughput:**
```bash
cat migration-report.txt | grep "Avg Records/Second"
cat migration-report.txt | grep "Avg MB/Second"
```

**Find slow tables:**
```bash
cat migration-report.json | jq '.tables.details | sort_by(.durationSeconds) | reverse | .[0:5]'
```

**Estimate future migrations:**
```bash
# If you have 20M records to migrate:
# Total time ≈ 20,000,000 * avgSecondsPerRecord

# If you have 500GB to migrate:
# Total time ≈ 500,000 MB * avgSecondsPerMB
```

### Identify Bottlenecks

**Slowest tables:**
```json
{
  "table": "omnipool_asset_historical_data",
  "records": 87654,
  "duration": "5m 30s",
  "recordsPerSecond": "265.92"  // ← Very slow!
}
```

This might indicate:
- Large row sizes (JSONB columns)
- Many indexes
- FK constraint checks

### Compare Optimizations

Run migration twice with different configs:

**Baseline (sequential):**
```
Total Duration: 2h 30m
Avg Records/Second: 1,234
```

**After Phase 1 optimizations:**
```
Total Duration: 18m
Avg Records/Second: 10,500
Speedup: 8.3x ✓
```

## Notes

### Data Size Estimation

The report estimates data size as:
```
estimatedBytes = records * columns * 200 bytes
```

This is a rough estimate. Actual size depends on:
- Column types (TEXT vs INT)
- Data content (long strings vs short)
- JSONB data
- NULL values

For more accurate measurement, use PostgreSQL's `pg_total_relation_size()`.

### Records Count

Reports the number of rows **attempted** to migrate, not necessarily successfully inserted (due to ON CONFLICT).

### Duration Accuracy

- Includes data fetch time
- Includes transformation time
- Includes insert time
- Does **not** include schema discovery or dependency analysis

## Troubleshooting

**Report not generated:**
- Check file permissions in working directory
- Check for errors in console output
- Report is still generated even if migration fails (as `-failed.json/txt`)

**Inaccurate estimates:**
- Data size is estimated, not measured
- Use JSON report for programmatic analysis
- Cross-reference with `pg_stat_user_tables` for accuracy

**Missing tables in report:**
- Only completed tables appear
- Check errors section for failed tables
- Use progress file for incomplete migrations
