export default `

BEGIN;

CREATE OR REPLACE VIEW support.v_app_logs_action_stats AS
SELECT
  name,
  action_type,
  COUNT(*)                                        AS calls,
  SUM(duration_ms)                                AS duration_ms_sum,
  AVG(duration_ms)                                AS duration_ms_avg,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY duration_ms) FILTER (WHERE duration_ms IS NOT NULL) AS p50_ms,
  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY duration_ms) FILTER (WHERE duration_ms IS NOT NULL) AS p90_ms,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY duration_ms) FILTER (WHERE duration_ms IS NOT NULL) AS p99_ms,
  MIN(duration_ms)                                AS min_ms,
  MAX(duration_ms)                                AS max_ms,
  SUM((NOT COALESCE(success, FALSE))::int)        AS errors,
  SUM((COALESCE(success, FALSE))::int)            AS successes,
  100.0 * SUM((COALESCE(success, FALSE))::int) / NULLIF(COUNT(*),0) AS success_rate_pct,
  MIN(ts)                                         AS first_ts,
  MAX(ts)                                         AS last_ts
FROM support.app_logs
GROUP BY name, action_type;


COMMIT;

`