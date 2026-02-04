#!/bin/bash
# Restore secondary indexes from backup file
# Run this AFTER migration completes

HARVESTER_DB_URL="${HARVESTER_DB_URL:-postgresql://localhost/harvester_db}"
BACKUP_FILE="${1:-indexes-backup.sql}"

echo "Restoring secondary indexes from backup..."
echo "==========================================="
echo ""

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ ERROR: Backup file '$BACKUP_FILE' not found!"
  echo ""
  echo "Expected to find indexes saved by save-secondary-indexes.sh"
  echo ""
  echo "If you have a different backup file, specify it:"
  echo "  ./scripts/restore-secondary-indexes.sh /path/to/backup.sql"
  exit 1
fi

# Count indexes in backup
INDEX_COUNT=$(grep -c "CREATE INDEX" "$BACKUP_FILE" || echo "0")

if [ "$INDEX_COUNT" -eq 0 ]; then
  echo "❌ ERROR: No CREATE INDEX statements found in $BACKUP_FILE"
  echo ""
  echo "File may be empty or corrupted. Check the contents:"
  echo "  cat $BACKUP_FILE"
  exit 1
fi

echo "Found $INDEX_COUNT index definitions in backup"
echo ""

# Show sample
echo "Sample indexes to restore (first 5):"
head -5 "$BACKUP_FILE" | grep "CREATE INDEX" || head -10 "$BACKUP_FILE"
echo "..."
echo ""

# Estimate time
echo "⏱️  Estimated rebuild time: 30-90 minutes (depends on table sizes)"
echo ""

# Confirm
read -p "Restore $INDEX_COUNT indexes? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

echo ""
echo "Rebuilding indexes..."
echo "This may take 30-90 minutes depending on table sizes..."
echo ""

# Track start time
START_TIME=$(date +%s)

# Rebuild indexes with progress
psql "$HARVESTER_DB_URL" << EOF
-- Enable timing
\timing on

-- Show progress
\echo ''
\echo 'Restoring indexes from backup...'
\echo ''

-- Execute all CREATE INDEX statements from backup
\i $BACKUP_FILE

\echo ''
\echo 'Index rebuild complete!'
EOF

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
echo "✓ Index rebuild completed in ${MINUTES}m ${SECONDS}s"
echo ""

# Verify
echo "Verifying indexes..."
RESTORED_COUNT=$(psql "$HARVESTER_DB_URL" -t -A -c "
SELECT COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'IDX_%';
")

echo "  Indexes in backup: $INDEX_COUNT"
echo "  Indexes now in DB: $RESTORED_COUNT"
echo ""

if [ "$RESTORED_COUNT" -ge "$INDEX_COUNT" ]; then
  echo "✓ All indexes restored successfully!"
  echo ""
  echo "Database is now fully optimized with all indexes."
  echo ""
  echo "You can now:"
  echo "  - Run validation: ./scripts/../validate-migration.js"
  echo "  - Check index sizes: ./scripts/check-indexes.sh"
else
  echo "⚠️  Warning: Expected $INDEX_COUNT indexes, but found $RESTORED_COUNT"
  echo ""
  echo "Some indexes may have failed to rebuild."
  echo "Check PostgreSQL logs for errors."
  echo ""
  echo "To retry:"
  echo "  ./scripts/restore-secondary-indexes.sh $BACKUP_FILE"
fi

echo ""
echo "Migration complete! 🎉"
