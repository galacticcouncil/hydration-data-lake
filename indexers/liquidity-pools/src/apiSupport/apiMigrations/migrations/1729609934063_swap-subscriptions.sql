DROP FUNCTION IF EXISTS public.notify_route_trade CASCADE;

CREATE FUNCTION public.notify_route_trade ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
      WHEN 'INSERT' THEN
        PERFORM
            public.notify (
                'state_changed',
                'created',
                'route_trade',
                NEW.id,
                jsonb_build_object(
                  'all_involved_asset_ids', NEW.all_involved_asset_ids,
                  'participant_swappers', NEW.participant_swappers,
                  'participant_fillers', NEW.participant_fillers,
                  'fee_recipients', NEW.fee_recipients
                )
            );
        RETURN NEW;

      WHEN 'UPDATE' THEN
        PERFORM
            public.notify (
                'state_changed',
                'updated',
                'route_trade',
                NEW.id,
                jsonb_build_object(
                  'all_involved_asset_ids', NEW.all_involved_asset_ids,
                  'participant_swappers', NEW.participant_swappers,
                  'participant_fillers', NEW.participant_fillers,
                  'fee_recipients', NEW.fee_recipients
                )
            );
        RETURN NEW;

      WHEN 'DELETE' THEN
        PERFORM
            public.notify (
                'state_changed',
                'deleted',
                'route_trade',
                OLD.id,
                jsonb_build_object(
                  'all_involved_asset_ids', OLD.all_involved_asset_ids,
                  'participant_swappers', OLD.participant_swappers,
                  'participant_fillers', OLD.participant_fillers,
                  'fee_recipients', OLD.fee_recipients
                )
            );
        RETURN OLD;

  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;


CREATE TRIGGER _500_gql_update_route_trade
  AFTER INSERT OR UPDATE OR DELETE ON public.route_trade
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_route_trade ();