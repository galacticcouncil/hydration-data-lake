export default `
  BEGIN;
  CREATE SCHEMA IF NOT EXISTS support;
  CREATE TABLE IF NOT EXISTS support.app_logs (
    id                  BIGSERIAL PRIMARY KEY,
    ts                  timestamptz NOT NULL DEFAULT now(),
    level               text        NOT NULL,
    name                text,
    action_type         text,
    para_block_height   int4,
    op_id               text,
    para_blocks_range   text,
    duration_ms         double precision,
    success             boolean,
    meta                jsonb
  );
  CREATE INDEX IF NOT EXISTS app_logs_ts_idx          ON support.app_logs (ts);
  CREATE INDEX IF NOT EXISTS app_logs_name_action_idx ON support.app_logs (name, action_type);
  CREATE INDEX IF NOT EXISTS app_logs_op_id_idx       ON support.app_logs (op_id);
  CREATE INDEX IF NOT EXISTS app_logs_action_idx      ON support.app_logs (action_type);
  CREATE INDEX IF NOT EXISTS app_logs_success_idx     ON support.app_logs (success);
  CREATE INDEX IF NOT EXISTS app_logs_meta_gin_idx    ON support.app_logs USING GIN (meta);
  COMMIT;
`;
