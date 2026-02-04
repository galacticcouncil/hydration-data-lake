#!/bin/bash
# Drop secondary indexes (IDX_*) for faster bulk loading
# Run save-secondary-indexes.sh BEFORE running this!

HARVESTER_DB_URL="${HARVESTER_DB_URL:-postgresql://localhost/harvester_db}"
BACKUP_FILE="${1:-indexes-backup.sql}"

echo "Dropping secondary indexes from harvester database..."
echo "====================================================="
echo ""

# Check if backup exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "⚠️  WARNING: Backup file '$BACKUP_FILE' not found!"
  echo ""
  echo "Run this first to create backup:"
  echo "  ./scripts/save-secondary-indexes.sh"
  echo ""
  read -p "Continue without backup? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted. Run save-secondary-indexes.sh first."
    exit 1
  fi
fi


# Show what will be dropped
echo "Indexes to be dropped:"
INDEX_COUNT=$(psql "$HARVESTER_DB_URL" -t -A -c "
SELECT COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'IDX_%'
  AND indexname NOT LIKE 'pg_toast%';
")

echo "  Secondary indexes (IDX_*): $INDEX_COUNT"
echo ""

# Show what will be kept
PK_COUNT=$(psql "$HARVESTER_DB_URL" -t -A -c "
SELECT COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'PK_%';
")

echo "Indexes to be KEPT (required for ON CONFLICT):"
echo "  Primary keys (PK_*): $PK_COUNT"
echo ""

if [ "$INDEX_COUNT" -eq 0 ]; then
  echo "No secondary indexes to drop. Already optimized!"
  exit 0
fi

# Confirm
read -p "Drop $INDEX_COUNT secondary indexes? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

echo ""
echo "Dropping indexes..."

# Drop IDX_* indexes
psql "$HARVESTER_DB_URL" << 'EOF'
DO $$
DECLARE
  idx RECORD;
  drop_count INT := 0;
BEGIN
  FOR idx IN
    SELECT schemaname, tablename, indexname
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname LIKE 'IDX_%'
      AND indexname NOT LIKE 'pg_toast%'
    ORDER BY tablename, indexname
  LOOP
    EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(idx.schemaname) || '.' || quote_ident(idx.indexname);
    drop_count := drop_count + 1;

    IF drop_count % 50 = 0 THEN
      RAISE NOTICE 'Dropped % indexes...', drop_count;
    END IF;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '✓ Successfully dropped % secondary indexes', drop_count;
END $$;
EOF

# Verify
echo ""
echo "Verifying..."
REMAINING=$(psql "$HARVESTER_DB_URL" -t -A -c "
SELECT COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'IDX_%';
")

PK_REMAINING=$(psql "$HARVESTER_DB_URL" -t -A -c "
SELECT COUNT(*)
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'PK_%';
")

echo "  Secondary indexes remaining: $REMAINING"
echo "  Primary keys remaining: $PK_REMAINING"
echo ""

if [ "$REMAINING" -eq 0 ]; then
  echo "✓ All secondary indexes dropped successfully!"
  echo "✓ Primary keys preserved for ON CONFLICT"
  echo ""
  echo "Migration will now be 10-50x faster!"
  echo ""
  echo "After migration completes, restore indexes with:"
  echo "  ./scripts/restore-secondary-indexes.sh"
else
  echo "⚠️  Warning: $REMAINING indexes could not be dropped"
  echo "Check PostgreSQL logs for details"
fi
