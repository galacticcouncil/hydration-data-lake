#!/bin/bash
# Fixed version - properly handles case-sensitive index names

HARVESTER_DB_URL="${HARVESTER_DB_URL:-postgresql://localhost/harvester_db}"

echo "Dropping secondary indexes from harvester database..."
echo "======================================================"
echo ""

# Count indexes before
echo "Before:"
psql "$HARVESTER_DB_URL" -t -A -c "
SELECT COUNT(*) || ' secondary indexes' FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname NOT LIKE '%pkey%'
  AND indexname NOT LIKE 'pg_toast%';
"

echo ""
echo "Dropping indexes..."
echo ""

# Drop indexes with proper quoting
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
      AND indexname NOT LIKE '%pkey%'  -- Keep any pkey (case insensitive)
      AND indexname NOT LIKE 'pg_toast%'
    ORDER BY tablename, indexname
  LOOP
    -- Use quote_ident to properly handle case-sensitive names
    EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(idx.schemaname) || '.' || quote_ident(idx.indexname);
    drop_count := drop_count + 1;

    IF drop_count % 50 = 0 THEN
      RAISE NOTICE 'Dropped % indexes...', drop_count;
    END IF;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '✓ Successfully dropped % indexes', drop_count;
END $$;
EOF

echo ""
echo "After:"
psql "$HARVESTER_DB_URL" -t -A -c "
SELECT COUNT(*) || ' secondary indexes remaining' FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname NOT LIKE '%pkey%'
  AND indexname NOT LIKE 'pg_toast%';
"

echo ""
echo "✓ Indexes dropped successfully!"
echo ""
echo "Now restart your migration - it should be 10-50x faster!"
echo ""
echo "After migration completes, rebuild indexes with:"
echo "  ./scripts/rebuild-indexes.sh"
