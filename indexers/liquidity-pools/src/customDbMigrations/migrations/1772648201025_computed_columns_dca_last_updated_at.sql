-- Create composite index for optimal query performance on large tables
-- This index enables efficient filtering by schedule_execution_id and sorting by para_block_height
CREATE INDEX IF NOT EXISTS "IDX_dca_exec_event_schedule_exec_id_block"
ON public.dca_schedule_execution_event
USING btree (schedule_execution_id, para_block_height DESC);

DROP FUNCTION IF EXISTS dca_schedule_involved_at_para_block CASCADE;

CREATE FUNCTION dca_schedule_involved_at_para_block(dcas public.dca_schedule) RETURNS int4 AS $$
    SELECT dsee.para_block_height
    FROM dca_schedule_execution_event dsee
    JOIN dca_schedule_execution dse ON dsee.schedule_execution_id = dse.id
    WHERE dse.schedule_id = dcas.id
    ORDER BY dsee.para_block_height DESC
    LIMIT 1
$$ LANGUAGE sql STABLE;
