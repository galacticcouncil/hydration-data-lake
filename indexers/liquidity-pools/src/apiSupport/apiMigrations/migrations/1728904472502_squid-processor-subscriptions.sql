DROP FUNCTION IF EXISTS squid_processor.notify_status CASCADE;


CREATE FUNCTION squid_processor.notify_status ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      squid_processor.notify ('state_changed', 'created', 'squid_processor_status', NEW.id); RETURN NEW;
  WHEN 'UPDATE' THEN
    PERFORM
      squid_processor.notify ('state_changed', 'updated', 'squid_processor_status', NEW.id); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      squid_processor.notify ('state_changed', 'deleted', 'squid_processor_status', OLD.id); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;


CREATE TRIGGER _500_gql_update_squid_processor_status
  AFTER INSERT OR UPDATE OR DELETE ON squid_processor.status
  FOR EACH ROW
  EXECUTE PROCEDURE squid_processor.notify_status ();