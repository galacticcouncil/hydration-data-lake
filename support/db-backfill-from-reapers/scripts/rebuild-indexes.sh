#!/bin/bash
# Rebuild indexes after migration completes
# Run this AFTER migration

HARVESTER_DB_URL="${HARVESTER_DB_URL:-postgresql://localhost/harvester_db}"

if [ ! -f "indexes-backup.sql" ]; then
  echo "ERROR: indexes-backup.sql not found!"
  echo "Did you run ./scripts/save-and-drop-indexes.sh before migration?"
  exit 1
fi

echo "Rebuilding indexes from indexes-backup.sql..."
echo "This may take 30-60 minutes depending on table sizes..."
echo ""

# Count indexes to rebuild
INDEX_COUNT=$(grep -c "CREATE INDEX" indexes-backup.sql || echo "0")
echo "Found $INDEX_COUNT indexes to rebuild"
echo ""

# Rebuild indexes
psql "$HARVESTER_DB_URL" -f indexes-backup.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✓ All indexes rebuilt successfully!"
  echo ""
  echo "Verifying indexes..."

  psql "$HARVESTER_DB_URL" << 'EOF'
SELECT
  schemaname,
  tablename,
  COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;
EOF

  echo ""
  echo "Migration and index rebuild complete!"
else
  echo ""
  echo "✗ Index rebuild failed!"
  echo "Check errors above and retry with:"
  echo "  psql $HARVESTER_DB_URL -f indexes-backup.sql"
  exit 1
fi
