# Docker Swarm Deployment Guide

## Problem: Service Restarts After Completion

By default, Docker Swarm restarts services when they exit, **even on successful completion**. This causes the migration to run again after finishing.

## Solution: Two-Layer Protection

### 1. Set Restart Policy (Stack File)

Configure the stack to only restart on failure:

```yaml
version: '3.3'
services:
  db-backfill:
    image: mckrava/reapers-harvester-migrator:3.2
    command:
     - sh
     - -c
     - node index.js

    # IMPORTANT: Only restart on failure
    deploy:
      restart_policy:
        condition: on-failure    # Don't restart on success (exit 0)
        delay: 10s               # Wait 10s before retry
        max_attempts: 3          # Try up to 3 times on failure

    environment:
      BATCH_SIZE: '15000'
      BULK_INSERT_SIZE: '1000'
      DISABLE_FK_CHECKS: 'true'
      HARVESTER_DB_URL: postgresql://user:pass@host:port/db
      MAX_PARALLEL_TABLES: '10'
      PROGRESS_FILE: /data/migration-progress.json
      REAPERS_LIST_JSON: '[{"index":1,"startBlockHeight":6500001,"endBlockHeight":7000000,"dbConnectionUrl":"postgresql://..."}]'
      RESUME_MIGRATION: 'true'
      USE_COMPLETION_MARKER: 'true'  # Optional: Extra protection against re-runs
      SCHEMA_NAME: public
      USE_COPY_MODE: 'false'

    volumes:
     - migration-data:/data

    networks:
     - default

    logging:
      driver: json-file

networks:
  default:
    driver: overlay

volumes:
  migration-data:
    driver: local
```

### 2. Completion Marker (Application Level - Optional)

The application can optionally create a completion marker file to prevent duplicate runs. **This feature is disabled by default** and must be enabled via environment variable:

```yaml
environment:
  USE_COMPLETION_MARKER: 'true'  # Enable completion marker protection
```

**On first run:**
```
[INFO] === DB Backfill from Reapers - Starting ===
[INFO] Schema: public
[INFO] Migration mode: INSERT (standard)
... migration runs ...
[INFO] === DB Backfill from Reapers - Completed Successfully ===
[INFO] Migration progress cleared
[INFO] ✓ Completion marker created: /data/migration-progress-completed.marker
```

**On subsequent runs (if Docker restarts):**
```
[INFO] === DB Backfill from Reapers - Starting ===
[INFO] ✓ Migration already completed previously (found completion marker)
[INFO] ✓ Skipping migration to prevent duplicate run
[INFO]
[INFO] To re-run migration, delete the completion marker:
[INFO]   rm /data/migration-progress-completed.marker
[INFO]
[INFO] Exiting successfully...
```

## How It Works

### First Migration Run (with USE_COMPLETION_MARKER enabled)

1. App checks for completion marker → **not found**
2. Proceeds with migration
3. On success:
   - Clears progress file
   - Creates completion marker: `/data/migration-progress-completed.marker` (if enabled)
   - Exits with code 0
4. Docker Swarm sees exit 0 + `on-failure` policy → **doesn't restart**

### If Docker Restarts Anyway (with USE_COMPLETION_MARKER enabled)

1. App checks for completion marker → **found!**
2. Exits immediately with code 0
3. No migration runs
4. Docker Swarm sees exit 0 + `on-failure` policy → **doesn't restart again**

**Note**: If `USE_COMPLETION_MARKER` is not enabled (default), only the restart policy protects against duplicate runs.

### If Migration Fails

1. App exits with code 1
2. Docker Swarm sees exit 1 + `on-failure` policy → **restarts**
3. App loads progress file and resumes
4. Retries up to 3 times (configurable via `max_attempts`)

## Completion Marker Format

The marker file contains migration summary:

```json
{
  "completedAt": "2026-02-01T23:45:30.123Z",
  "reapers": [1, 2, 3],
  "summary": {
    "totalRecords": 45234567,
    "totalDuration": "2h 15m 30s",
    "avgSecondsPerRecord": "0.000179"
  }
}
```

## Re-Running Migration

To re-run a completed migration:

### Method 1: Delete Completion Marker (if USE_COMPLETION_MARKER enabled)

If you enabled `USE_COMPLETION_MARKER: 'true'`:

```bash
# Via Docker exec
docker exec <container_id> rm /data/migration-progress-completed.marker

# Or via Swarmpit terminal
rm /data/migration-progress-completed.marker
```

Then restart the service.

If `USE_COMPLETION_MARKER` is not enabled, simply restart the service.

### Method 2: Delete Volume and Redeploy

```bash
# Remove the stack
docker stack rm db-backfill

# Delete the volume
docker volume rm db-backfill_migration-data

# Redeploy
docker stack deploy -c docker-compose.yml db-backfill
```

## Best Practices

### 1. Use Named Volumes

```yaml
volumes:
  migration-data:
    driver: local
```

This persists progress across container restarts.

### 2. Set Resource Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 4G
    reservations:
      cpus: '1'
      memory: 2G
```

### 3. Use Placement Constraints (If Needed)

```yaml
deploy:
  placement:
    constraints:
      - node.role == worker
      - node.labels.migration == true
```

### 4. Monitor Logs

```bash
# Follow logs in real-time
docker service logs -f db-backfill_db-backfill

# Via Swarmpit UI
# Navigate to service → Logs tab
```

### 5. Set Proper Logging Limits

```yaml
logging:
  driver: json-file
  options:
    max-size: "100m"
    max-file: "3"
```

## Deployment Workflow

### Initial Deployment

```bash
# 1. Save your stack file
cat > migration-stack.yml << 'EOF'
version: '3.3'
services:
  db-backfill:
    image: mckrava/reapers-harvester-migrator:3.2
    deploy:
      restart_policy:
        condition: on-failure
        max_attempts: 3
    # ... rest of config ...
EOF

# 2. Deploy to Swarm
docker stack deploy -c migration-stack.yml db-backfill

# 3. Monitor logs
docker service logs -f db-backfill_db-backfill
```

### Via Swarmpit UI

1. **Create Stack**:
   - Name: `db-backfill`
   - Paste your stack YAML
   - Click "Deploy"

2. **Monitor**:
   - Navigate to service
   - Check "Logs" tab for progress
   - Check "Info" tab for status

3. **Verify Completion**:
   - Logs should show: "Completed Successfully"
   - Service should be in "Shutdown" or "Complete" state
   - No automatic restarts

### Updating Configuration

```bash
# 1. Update stack file with new reapers or settings

# 2. Delete completion marker first (if re-running)
docker exec <container_id> rm /data/migration-progress-completed.marker

# 3. Update stack
docker stack deploy -c migration-stack.yml db-backfill
```

## Troubleshooting

### Issue: Service Keeps Restarting

**Cause**: Missing `restart_policy` or set to `any`

**Solution**: Add restart policy to stack file:
```yaml
deploy:
  restart_policy:
    condition: on-failure
```

### Issue: Migration Runs Twice

**Cause 1**: Restart policy not set correctly

**Solution**: Ensure `restart_policy: condition: on-failure` is set in stack file

**Cause 2** (if USE_COMPLETION_MARKER enabled): Completion marker not created

**Solution**: Check logs for "✓ Completion marker created"

**Cause 3** (if USE_COMPLETION_MARKER enabled): Volume not persisted

**Solution**: Ensure volume is defined:
```yaml
volumes:
  migration-data:
    driver: local
```

### Issue: Can't Re-Run Migration

**Cause**: Completion marker exists (if `USE_COMPLETION_MARKER` enabled)

**Solution**: Delete marker file:
```bash
docker exec <container_id> rm /data/migration-progress-completed.marker
```

Or disable the completion marker feature by removing `USE_COMPLETION_MARKER` from environment variables.

### Issue: Service Won't Stop After Completion

**Cause**: Exit code not 0 (migration failed)

**Solution**: Check logs for errors, fix issues, redeploy

## Exit Codes

| Exit Code | Meaning | Swarm Action (with on-failure) |
|-----------|---------|-------------------------------|
| 0 | Success | No restart |
| 1 | Failure | Restart (up to max_attempts) |

## File Locations in Container

| File | Location | Purpose |
|------|----------|---------|
| Progress file | `/data/migration-progress.json` | Resume on crash |
| Completion marker | `/data/migration-progress-completed.marker` | Prevent re-runs |
| Migration report | `./migration-report.json` | Performance metrics |
| Indexes backup | `./indexes-backup.sql` | Index definitions |

## Example: Complete Production Stack

```yaml
version: '3.3'

services:
  db-backfill:
    image: mckrava/reapers-harvester-migrator:3.2

    command:
     - sh
     - -c
     - node index.js

    deploy:
      # Only restart on failure
      restart_policy:
        condition: on-failure
        delay: 10s
        max_attempts: 3

      # Resource limits
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G

      # Run on specific node (optional)
      placement:
        constraints:
          - node.role == worker

    environment:
      # Migration settings
      USE_COPY_MODE: 'false'
      BATCH_SIZE: '15000'
      BULK_INSERT_SIZE: '1000'
      MAX_PARALLEL_TABLES: '10'
      DISABLE_FK_CHECKS: 'true'

      # Database connections
      HARVESTER_DB_URL: postgresql://user:pass@harvester.example.com:5432/db
      REAPERS_LIST_JSON: |
        [
          {"index":1,"startBlockHeight":0,"endBlockHeight":1000000,"dbConnectionUrl":"postgresql://..."},
          {"index":2,"startBlockHeight":1000001,"endBlockHeight":2000000,"dbConnectionUrl":"postgresql://..."}
        ]

      # Progress tracking
      PROGRESS_FILE: /data/migration-progress.json
      RESUME_MIGRATION: 'true'
      USE_COMPLETION_MARKER: 'true'  # Optional: Prevents duplicate runs on Docker restart
      SCHEMA_NAME: public

    volumes:
     - migration-data:/data

    networks:
     - backend

    logging:
      driver: json-file
      options:
        max-size: "100m"
        max-file: "3"
        labels: "migration,reapers-to-harvester"

networks:
  backend:
    driver: overlay

volumes:
  migration-data:
    driver: local
```

## Summary

**Protection against duplicate runs:**

1. ✅ **Stack-level** (Required): `restart_policy: on-failure` (no restart on success)
2. ✅ **App-level** (Optional): Completion marker file with `USE_COMPLETION_MARKER: 'true'` (skip if already done)

**Result**: Migration runs once, completes, stops cleanly. The restart policy is usually sufficient; enable the completion marker for additional protection if needed.
