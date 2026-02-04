#!/bin/bash
# Drop only secondary indexes (IDX_*), keeping PRIMARY KEY constraints (PK_*)
# This is safer and targets the real performance bottleneck

HARVESTER_DB_URL="${HARVESTER_DB_URL:-postgresql://localhost/harvester_db}"

echo "Analyzing indexes on harvester database..."
echo "============================================"
echo ""

# Show what will be dropped
echo "Indexes that will be dropped (IDX_* only):"
psql "$HARVESTER_DB_URL" -c "
SELECT COUNT(*) as secondary_index_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'IDX_%'
  AND indexname NOT LIKE 'pg_toast%';
"

echo ""
echo "Indexes that will be KEPT (PK_* and unique constraints):"
psql "$HARVESTER_DB_URL" -c "
SELECT COUNT(*) as pk_and_unique_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND (indexname LIKE 'PK_%' OR indexname LIKE 'UQ_%')
  AND indexname NOT LIKE 'pg_toast%';
"

echo ""
read -p "Continue with dropping IDX_* indexes? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Saving index definitions to indexes-backup.sql..."

# Save only droppable indexes
psql "$HARVESTER_DB_URL" << 'EOF' > indexes-backup.sql
SELECT
  indexdef || ';' as create_statement
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'IDX_%'
  AND indexname NOT LIKE 'pg_toast%'
ORDER BY tablename, indexname;
EOF

echo "Saved $(grep -c CREATE indexes-backup.sql || echo 0) indexes to indexes-backup.sql"

echo ""
echo "Dropping secondary indexes (IDX_* only)..."

# Drop only IDX_ indexes
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
  RAISE NOTICE '✓ PRIMARY KEY constraints (PK_*) kept intact';
END $$;
EOF

echo ""
echo "Verifying..."
psql "$HARVESTER_DB_URL" << 'EOF'
SELECT
  COUNT(*) FILTER (WHERE indexname LIKE 'IDX_%') as idx_remaining,
  COUNT(*) FILTER (WHERE indexname LIKE 'PK_%') as pk_remaining
FROM pg_indexes
WHERE schemaname = 'public';
EOF

echo ""
echo "✓ Secondary indexes dropped successfully!"
echo "✓ PRIMARY KEY constraints preserved for ON CONFLICT"
echo "✓ Backup saved to: indexes-backup.sql"
echo ""
echo "Now restart your migration - it should be much faster!"
echo ""
echo "After migration completes, rebuild indexes with:"
echo "  ./scripts/rebuild-indexes.sh"
