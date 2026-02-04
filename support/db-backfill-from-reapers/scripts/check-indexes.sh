#!/bin/bash
# Check what indexes actually exist on harvester database

HARVESTER_DB_URL="${HARVESTER_DB_URL:-postgresql://localhost/harvester_db}"

echo "Checking indexes on harvester database..."
echo "==========================================="
echo ""

# 1. Count total indexes
echo "1. TOTAL INDEX COUNT:"
psql "$HARVESTER_DB_URL" -t -A -c "
SELECT
  'Total indexes: ' || COUNT(*) as total,
  'Primary keys: ' || COUNT(*) FILTER (WHERE indexname LIKE '%_pkey') as pkeys,
  'Secondary indexes: ' || COUNT(*) FILTER (WHERE indexname NOT LIKE '%_pkey' AND indexname NOT LIKE 'pg_toast%') as secondary
FROM pg_indexes
WHERE schemaname = 'public';
"

echo ""
echo "2. INDEXES BY TABLE (top 20 tables with most indexes):"
psql "$HARVESTER_DB_URL" << 'EOF'
SELECT
  tablename,
  COUNT(*) as index_count,
  COUNT(*) FILTER (WHERE indexname LIKE '%_pkey') as pk_count,
  COUNT(*) FILTER (WHERE indexname NOT LIKE '%_pkey') as secondary_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
HAVING COUNT(*) FILTER (WHERE indexname NOT LIKE '%_pkey') > 0
ORDER BY index_count DESC
LIMIT 20;
EOF

echo ""
echo "3. SAMPLE SECONDARY INDEXES:"
psql "$HARVESTER_DB_URL" << 'EOF'
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname NOT LIKE '%_pkey'
  AND indexname NOT LIKE 'pg_toast%'
ORDER BY tablename, indexname
LIMIT 10;
EOF

echo ""
echo "4. TABLE AND INDEX SIZES (top 10):"
psql "$HARVESTER_DB_URL" << 'EOF'
SELECT
  schemaname || '.' || tablename as table,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = t.schemaname AND tablename = t.tablename AND indexname NOT LIKE '%_pkey') as secondary_index_count
FROM pg_tables t
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
EOF
