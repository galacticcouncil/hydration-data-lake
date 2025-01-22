DROP FUNCTION IF EXISTS public.notify CASCADE;
DROP FUNCTION IF EXISTS squid_processor.notify CASCADE;

CREATE FUNCTION public.notify (action_name text, event_name text, node_name text, node_id varchar)
  RETURNS void
  AS $$
BEGIN
  PERFORM
    pg_notify(concat('postgraphile:', action_name, ':', node_name), json_build_object('__node__', json_build_array(event_name, node_name, node_id))::text);
END;
$$ STRICT VOLATILE
LANGUAGE plpgsql;

CREATE FUNCTION squid_processor.notify (action_name text, event_name text, node_name text, node_id integer)
  RETURNS void
  AS $$
BEGIN
  PERFORM
    pg_notify(concat('postgraphile:', action_name, ':', node_name), json_build_object('__node__', json_build_array(event_name, node_name, node_id))::text);
END;
$$ STRICT VOLATILE
LANGUAGE plpgsql;