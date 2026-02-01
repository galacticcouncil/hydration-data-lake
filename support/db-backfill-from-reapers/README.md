# DB Backfill from Reapers

Node.js application to backfill harvester database from multiple reaper databases.

## Overview

This application connects to multiple reaper databases (blockchain indexers with historical data from specific time periods) and migrates all data to a single harvester database (full blockchain history indexer). The migration is performed sequentially in historical order to ensure data consistency.

## Features

- **Large Table Support**: Optimized for tables with millions of rows
  - Cursor-based streaming to process data without loading entire tables into memory
  - Configurable batch processing (default: 10,000 rows per batch)
  - Bulk INSERT statements (default: 2,000 rows per query)
  - Parallel table migration within dependency waves (default: 5 tables concurrently)
- **Resumability**: Automatic progress tracking with ability to resume from crashes
- **Sequential processing**: Reapers processed in ascending order by index
- **Automatic table discovery** from the `public` schema
- **Foreign key handling**: Tables sorted by dependencies to prevent constraint violations
- **Conflict resolution**: Newer reaper data overwrites older data for the same ID
- **Global Progress Tracking**: Overall migration progress displayed every 5 minutes
  - Shows completed/total reapers and tables
  - Overall percentage completion
  - Elapsed time and estimated time remaining
  - Current reaper and table being processed
- **JSON/JSONB Support**: Automatic detection and parsing of JSON/JSONB columns
- **Migration Reports**: Automatic performance reports with detailed metrics
  - Total duration, records, data size
  - Throughput metrics (records/sec, MB/sec)
  - Per-reaper and per-table statistics
  - Both JSON and human-readable formats
- **Migration Validation**: Comprehensive validation script to verify data integrity
  - Row count comparison
  - ID range validation
  - Random record sampling
  - Checksum verification
- **Comprehensive logging**: Detailed progress with timestamps and percentages
- **Error handling**: Strict validation with migration failure on critical errors
- **Docker support** for easy deployment

## Prerequisites

- Node.js 20+ (for local development)
- Docker (for containerized deployment)
- Access to harvester database
- Access to all reaper databases
- `reapers-list.json` file with reaper configurations OR `REAPERS_LIST_JSON` environment variable

## Configuration

### reapers-list.json

Update the `reapers-list.json` file with your reaper database connections:

```json
[
  {
    "index": 1,
    "startBlockHeight": 0,
    "endBlockHeight": 100000,
    "dbConnectionUrl": "postgresql://user:password@host:port/database"
  },
  {
    "index": 2,
    "startBlockHeight": 100001,
    "endBlockHeight": 200000,
    "dbConnectionUrl": "postgresql://user:password@host:port/database"
  }
]
```

**Important**: Reapers will be processed in ascending order by `index` field.

### Environment Variables

**Required:**
- `HARVESTER_DB_URL`: PostgreSQL connection URL for the harvester database

**Optional:**
- `REAPERS_LIST_JSON`: Stringified JSON array of reapers (takes priority over file)
- `REAPERS_LIST_FILE`: Path to reapers list JSON file (default: `./reapers-list.json`)
- `SCHEMA_NAME`: Database schema to migrate (default: `public`)
- `DISABLE_FK_CHECKS`: Set to `true` to disable foreign key checks during migration (default: `false`)
- `BATCH_SIZE`: Number of rows to fetch per batch from reaper DB (default: `10000`)
- `BULK_INSERT_SIZE`: Number of rows per bulk INSERT statement (default: `2000`)
- `MAX_PARALLEL_TABLES`: Number of tables to migrate concurrently within each dependency wave (default: `5`)
- `PROGRESS_FILE`: Path to save migration progress (default: `./migration-progress.json`)
- `RESUME_MIGRATION`: Set to `true` to resume from last checkpoint (default: `false`)

**Notes**:
- If `REAPERS_LIST_JSON` is provided, it will be used instead of reading from a file
- The same schema name is used for both harvester and reaper databases (they must have identical schemas)
- To migrate a different schema, set `SCHEMA_NAME` (e.g., `SCHEMA_NAME=my_schema`)
- Tables are migrated in dependency order (parent tables before child tables) to respect foreign key constraints
- If you encounter foreign key errors, set `DISABLE_FK_CHECKS=true` to temporarily disable constraints. Use with caution!
- For very large tables (50M+ rows), consider adjusting `BATCH_SIZE` and `BULK_INSERT_SIZE` based on available memory
- Progress is automatically saved after each batch. Set `RESUME_MIGRATION=true` to continue after a crash

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Application

```bash
export HARVESTER_DB_URL="postgresql://user:password@host:port/harvester_db"
npm start
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t db-backfill-from-reapers:latest .
```

### Run with Docker

Using file-based configuration:
```bash
docker run -e HARVESTER_DB_URL="postgresql://user:password@host:port/harvester_db" db-backfill-from-reapers:latest
```

Using environment variable configuration:
```bash
docker run \
  -e HARVESTER_DB_URL="postgresql://user:password@host:port/harvester_db" \
  -e REAPERS_LIST_JSON='[{"index":1,"startBlockHeight":0,"endBlockHeight":100000,"dbConnectionUrl":"postgresql://user:pass@host:port/db1"},{"index":2,"startBlockHeight":100001,"endBlockHeight":200000,"dbConnectionUrl":"postgresql://user:pass@host:port/db2"}]' \
  db-backfill-from-reapers:latest
```

## Docker Swarm / Swarmpit Deployment

### Deploy Stack

1. Build and push your Docker image to a registry:

```bash
docker build -t your-registry/db-backfill-from-reapers:latest .
docker push your-registry/db-backfill-from-reapers:latest
```

2. Update `docker-compose.yml` with your image name:

```yaml
services:
  db-backfill:
    image: your-registry/db-backfill-from-reapers:latest
```

3. Deploy to Docker Swarm:

```bash
docker stack deploy -c docker-compose.yml db-backfill
```

4. Or deploy via Swarmpit UI:
   - Upload `docker-compose.yml`
   - Set environment variable `HARVESTER_DB_URL`
   - Optionally set `REAPERS_LIST_JSON` with stringified JSON array of reapers
   - Deploy the stack

### Monitor Logs

```bash
docker service logs -f db-backfill_db-backfill
```

## Progress Monitoring

The application provides two levels of progress tracking:

### Per-Table Progress
Displayed after each batch during table migration:
```
  Processing batch: 0 - 5000 of 1000000
  Progress: 5000/1000000 (0.50%)
```

### Global Progress Summary
Displayed automatically every 5 minutes and at completion:
```
========================================
📊 GLOBAL MIGRATION PROGRESS
========================================
Reapers: 2/5 completed
  → Currently processing: Reaper #3
Tables: 45/120 completed (37.50%)
  → Currently processing: omnipool_asset_state_hist
Elapsed time: 2h 15m 30s
Estimated time remaining: ~3h 45m
========================================
```

This helps you track overall progress when migrating multiple reapers with many tables.

## How It Works

1. **Load Configuration**: Loads reapers list from `REAPERS_LIST_JSON` environment variable (if set) or from `reapers-list.json` file, then sorts reapers by index in ascending order
2. **Load Progress** (if `RESUME_MIGRATION=true`): Checks for existing progress file and resumes from last checkpoint
3. **Connect to Harvester**: Establishes connection to the harvester database
4. **Process Reapers Sequentially**: For each reaper (in order):
   - Skips if already completed (when resuming)
   - Connects to reaper database
   - Discovers all tables in the `public` schema
   - Analyzes foreign key dependencies between tables
   - Sorts tables topologically (parent tables before child tables)
   - Optionally disables foreign key checks if `DISABLE_FK_CHECKS=true`
   - For each table (in dependency order):
     - Checks resume point for this table
     - Opens PostgreSQL cursor for streaming data
     - Fetches data in batches (configurable via `BATCH_SIZE`)
     - For each batch:
       - Splits into chunks for bulk INSERT (configurable via `BULK_INSERT_SIZE`)
       - Executes multi-row INSERT statements with `ON CONFLICT` handling
       - Saves progress after each batch
       - Logs progress percentage
     - Falls back to row-by-row insertion if batch fails
   - Re-enables foreign key checks if they were disabled
   - Marks reaper as completed
5. **Completion**: Clears progress file on successful completion

## Data Migration Strategy

- **Memory Efficiency**:
  - Uses PostgreSQL cursors to stream data instead of loading entire tables into memory
  - Processes data in configurable batches (default: 10,000 rows)
  - Suitable for tables with 50M+ rows without OOM errors

- **Performance Optimization**:
  - Bulk INSERT statements with multiple VALUES (default: 1,000 rows per query)
  - Reduces network round trips by 1000x compared to single-row inserts
  - Configurable batch and bulk insert sizes for tuning

- **Foreign Key Handling**:
  - Tables are automatically sorted by foreign key dependencies (parent tables migrated before child tables)
  - Prevents foreign key constraint violations during migration
  - If circular dependencies exist, warnings are logged
  - Optional `DISABLE_FK_CHECKS` mode for complex scenarios

- **Conflict Resolution**:
  - **Tables with `id` column**: Uses `INSERT ... ON CONFLICT (id) DO UPDATE` to handle duplicates
    - If a record with the same `id` exists, it will be updated with data from the newer reaper
  - **Tables without `id` column**: Uses `INSERT ... ON CONFLICT DO NOTHING` to skip duplicates

- **Error Handling**:
  - If a bulk INSERT fails, automatically retries the batch row-by-row
  - Individual row errors are logged but don't stop the migration
  - Progress is saved after each batch to enable resumption

- **Sequential Processing**: Ensures data integrity by processing one reaper at a time

## Resuming Migrations

If the migration crashes or is interrupted, you can resume from the last checkpoint:

```bash
export RESUME_MIGRATION=true
npm start
```

Or with Docker:
```bash
docker run -e RESUME_MIGRATION=true -e HARVESTER_DB_URL="..." db-backfill-from-reapers:latest
```

**How Resume Works:**
- Progress is automatically saved to `migration-progress.json` after each batch
- Tracks completed reapers and row offsets for each table
- On resume, skips completed reapers and tables
- Continues processing from the last saved offset
- Progress file is automatically deleted on successful completion

**To Start Fresh:**
```bash
# Delete the progress file or set RESUME_MIGRATION=false (default)
rm migration-progress.json
npm start
```

## Validating Migrations

After migration completes, you should validate that data was migrated correctly using the validation script:

```bash
node validate-migration.js "postgresql://user:pass@host:port/reaper_db" --reaper-index 1
```

The validation script performs multiple checks:
- **Row count validation**: Compares total rows in each table
- **ID range validation**: Ensures MIN/MAX IDs match
- **Random sampling**: Compares random records field-by-field
- **Checksum validation**: Verifies entire dataset integrity

**Quick validation** (counts only, fastest):
```bash
node validate-migration.js "$REAPER_DB_URL" --reaper-index 1 --skip-sampling --skip-checksums
```

**Thorough validation** (with larger sample):
```bash
node validate-migration.js "$REAPER_DB_URL" --reaper-index 1 --sample-size 50
```

**Validate specific tables**:
```bash
node validate-migration.js "$REAPER_DB_URL" --reaper-index 1 --tables "swap,transfer,pool"
```

The script exits with:
- `0` if validation passes (all data matches)
- `1` if validation fails (mismatches detected)

See [VALIDATION.md](./VALIDATION.md) for detailed documentation.

## Migration Reports

After migration completes, a comprehensive performance report is automatically generated:

**Files created:**
- `migration-report.json` - Machine-readable JSON report
- `migration-report.txt` - Human-readable text report

**Report includes:**
- Migration duration (start/end times)
- Total records and data size migrated
- Average throughput (records/second, MB/second)
- Per-reaper statistics
- Per-table statistics with top 10 tables
- Error tracking

**View report:**
```bash
# Human-readable text
cat migration-report.txt

# Extract specific metrics
cat migration-report.json | jq '.performance.avgSecondsPerRecord'
```

The report is also displayed in the application logs when migration completes.

See [MIGRATION_REPORTS.md](./MIGRATION_REPORTS.md) for full documentation.

## Resource Requirements

**Recommended Docker resource limits:**
- CPU: 1-2 cores
- Memory: 1-2 GB (sufficient for tables with 50M+ rows)

**Performance Tuning:**

For optimal performance, adjust these environment variables based on your setup:

| Table Size | BATCH_SIZE | BULK_INSERT_SIZE | MAX_PARALLEL_TABLES | Memory Usage |
|------------|------------|------------------|---------------------|--------------|
| < 1M rows  | 10000      | 2000            | 5                   | ~1 GB        |
| 1-10M rows | 10000      | 2000            | 5                   | ~1.5 GB      |
| 10-50M rows| 10000      | 1000            | 3                   | ~1.5 GB      |
| 50M+ rows  | 5000       | 1000            | 3                   | ~2 GB        |

**Factors to consider:**
- **Network speed**: Faster network allows larger `BULK_INSERT_SIZE`
- **Available memory**: Larger batches and more parallel tables use more memory
- **Row width**: Wide rows (many columns) need smaller batch sizes
- **Database load**: If harvester DB is under load, use smaller batches
- **Parallel processing**: `MAX_PARALLEL_TABLES` controls concurrent table migrations (default: 5)
  - Higher values = faster migration but more connections and memory
  - Safe to use with dependency wave system (respects foreign keys)

## Troubleshooting

### Application exits immediately
- Verify `HARVESTER_DB_URL` environment variable is set
- Check database connection credentials
- Ensure either `REAPERS_LIST_JSON` environment variable is set OR `reapers-list.json` file exists and is valid JSON

### Connection timeout
- Verify network connectivity to databases
- Check firewall rules
- Increase timeout if needed (modify `pg` Pool configuration in `index.js`)

### Out of memory
- Increase Docker memory limits in `docker-compose.yml`
- Consider processing in batches if tables are very large (requires code modification)

### Foreign key constraint errors
- Tables are sorted by dependencies automatically, but if you still see errors like "violates foreign key constraint":
  - Check if there are circular dependencies in your schema (warnings will be logged)
  - Try setting `DISABLE_FK_CHECKS=true` environment variable to temporarily disable constraints
  - Ensure the harvester database schema matches the reaper schema
  - Verify that referenced records exist in parent tables

### Migration is slow
- **Check batch sizes**: Default settings are conservative. Increase `BATCH_SIZE` and `BULK_INSERT_SIZE` if you have sufficient memory and network bandwidth
- **Monitor progress**: Watch the percentage logs to estimate completion time
- **Database performance**: Check if harvester DB is I/O bound (high disk usage)
- **Network latency**: High latency between reaper and harvester can slow migration

### Migration crashed - how to resume?
```bash
# Simply set RESUME_MIGRATION=true and restart
export RESUME_MIGRATION=true
npm start
```
The migration will skip completed reapers and continue from the last saved offset.

### Want to restart from scratch?
```bash
# Delete progress file and run normally
rm migration-progress.json
npm start
```

### Progress file keeps growing
This is normal. The progress file tracks:
- Completed reaper indices
- Row offsets for each table being migrated
- Typically < 1 MB even for hundreds of tables

# Build image

```shell
docker buildx create --use --name multi || docker buildx use multi

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t mckrava/reapers-harvester-migrator:1.2 \
  --push .
```

## License

MIT