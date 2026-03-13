-- Update dca_schedule status based on dca_schedule_event records
-- This script finds all dca_schedule_event records where:
-- - para_block_height >= 11600000
-- - event_name is either 'Completed' or 'Terminated'
-- Then updates the corresponding dca_schedule records where:
-- - The schedule_id matches
-- - The current status is 'Created'
-- Sets the dca_schedule.status to match the event_name from dca_schedule_event

UPDATE dca_schedule
SET status = subquery.event_name
FROM (
    SELECT DISTINCT ON (schedule_id)
        schedule_id,
        event_name,
        para_block_height
    FROM dca_schedule_event
    WHERE para_block_height >= 11600000
        AND event_name IN ('Completed', 'Terminated')
    ORDER BY schedule_id, para_block_height DESC
) AS subquery
WHERE dca_schedule.id = subquery.schedule_id
    AND dca_schedule.status = 'Created';

-- Optional: View the records that will be updated before running the UPDATE
-- Uncomment the SELECT below to preview the changes:

/*
SELECT
    ds.id,
    ds.status AS current_status,
    subquery.event_name AS new_status,
    ds.owner_id,
    ds.asset_in_id,
    ds.asset_out_id,
    subquery.para_block_height AS event_block_height
FROM dca_schedule ds
INNER JOIN (
    SELECT DISTINCT ON (schedule_id)
        schedule_id,
        event_name,
        para_block_height
    FROM dca_schedule_event
    WHERE para_block_height >= 11600000
        AND event_name IN ('Completed', 'Terminated')
    ORDER BY schedule_id, para_block_height DESC
) AS subquery ON ds.id = subquery.schedule_id
WHERE ds.status = 'Created';
*/

-- Get list of all dca_schedule.id that will be affected
SELECT ds.id
FROM dca_schedule ds
INNER JOIN (
    SELECT DISTINCT ON (schedule_id)
        schedule_id,
        event_name
    FROM dca_schedule_event
    WHERE para_block_height >= 11600000
        AND event_name IN ('Completed', 'Terminated')
    ORDER BY schedule_id, para_block_height DESC
) AS subquery ON ds.id = subquery.schedule_id
WHERE ds.status = 'Created'
ORDER BY ds.id;

-- Get count of affected records
SELECT COUNT(*) AS records_to_update
FROM dca_schedule ds
INNER JOIN (
    SELECT DISTINCT ON (schedule_id)
        schedule_id,
        event_name
    FROM dca_schedule_event
    WHERE para_block_height >= 11600000
        AND event_name IN ('Completed', 'Terminated')
    ORDER BY schedule_id, para_block_height DESC
) AS subquery ON ds.id = subquery.schedule_id
WHERE ds.status = 'Created';