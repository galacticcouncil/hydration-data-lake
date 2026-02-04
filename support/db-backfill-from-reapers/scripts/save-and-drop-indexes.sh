#!/bin/bash
# Save index definitions and drop them for faster bulk loading
# Run this BEFORE migration

HARVESTER_DB_URL="${HARVESTER_DB_URL:-postgresql://localhost/harvester_db}"
SCHEMA="${SCHEMA_NAME:-public}"

echo "Saving index definitions to indexes-backup.sql..."

psql "$HARVESTER_DB_URL" << 'EOF' > indexes-backup.sql
-- Save all index creation statements (exclude PRIMARY KEY and UNIQUE constraints)
SELECT
  indexdef || ';' as create_statement
FROM pg_indexes i
WHERE schemaname = 'public'
  AND indexname NOT LIKE 'pg_toast%'
  -- Exclude indexes that are backing constraints (PK, UNIQUE)
  AND NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    WHERE c.conindid = (quote_ident(i.schemaname) || '.' || quote_ident(i.indexname))::regclass
  )
ORDER BY tablename, indexname;
EOF

echo "Saved $(wc -l < indexes-backup.sql) indexes to indexes-backup.sql"

echo ""
echo "Dropping non-PK indexes for faster migration..."

psql "$HARVESTER_DB_URL" << 'EOF'
DO $$
DECLARE
  idx RECORD;
  drop_count INT := 0;
BEGIN
  FOR idx IN
    SELECT i.schemaname, i.indexname
    FROM pg_indexes i
    WHERE i.schemaname = 'public'
      AND i.indexname NOT LIKE 'pg_toast%'
      -- Exclude indexes that back constraints (PRIMARY KEY, UNIQUE)
      AND NOT EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class cl ON c.conindid = cl.oid
        WHERE cl.relname = i.indexname
      )
  LOOP
    -- Use quote_ident() to properly handle case-sensitive index names
    EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(idx.schemaname) || '.' || quote_ident(idx.indexname);
    drop_count := drop_count + 1;

    IF drop_count % 10 = 0 THEN
      RAISE NOTICE 'Dropped % indexes...', drop_count;
    END IF;
  END LOOP;

  RAISE NOTICE 'Total indexes dropped: %', drop_count;
END $$;
EOF

echo ""
echo "✓ Indexes dropped successfully!"
echo "✓ Backup saved to: indexes-backup.sql"
echo ""
echo "After migration completes, rebuild indexes with:"
echo "  ./scripts/rebuild-indexes.sh"
