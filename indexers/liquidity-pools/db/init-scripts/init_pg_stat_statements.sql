-- init_pg_stat_statements.sql

-- 1) Enable extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 2) Create monitoring role if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'pgwatch') THEN
CREATE ROLE pgwatch LOGIN PASSWORD 'pgwatchpass';
END IF;
END $$;

-- 3) Safe catalog access
GRANT pg_monitor TO pgwatch;

-- 4) Grant CONNECT on *this* DB (no env-var expansion needed)
DO $$
DECLARE
dbname text := current_database();
BEGIN
EXECUTE format('GRANT CONNECT ON DATABASE %I TO pgwatch', dbname);
END $$;

-- 5) Grant schema/table access (adjust schemas if you have more than public)
GRANT USAGE ON SCHEMA public TO pgwatch;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pgwatch;

-- 6) Future tables readable by pgwatch (note: applies to tables created by the role running this)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO pgwatch;
