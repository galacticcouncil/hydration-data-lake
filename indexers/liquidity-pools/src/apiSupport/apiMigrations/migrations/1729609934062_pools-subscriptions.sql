DROP FUNCTION IF EXISTS public.notify_xykpool_volume CASCADE;
DROP FUNCTION IF EXISTS public.notify_omnipool_asset_volume CASCADE;
DROP FUNCTION IF EXISTS public.notify_stableswap_volume CASCADE;

CREATE FUNCTION public.notify_xykpool_volume ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
      WHEN 'INSERT' THEN
        PERFORM
          public.notify ('state_changed', 'created', 'xykpool_historical_volume', NEW.id); RETURN NEW;
      WHEN 'UPDATE' THEN
        PERFORM
          public.notify ('state_changed', 'updated', 'xykpool_historical_volume', NEW.id); RETURN NEW;
      WHEN 'DELETE' THEN
        PERFORM
          public.notify ('state_changed', 'deleted', 'xykpool_historical_volume', OLD.id); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

CREATE FUNCTION public.notify_xykpool_volumes_entries_list ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP

      WHEN 'INSERT' THEN
        PERFORM
          public.notify (
            'state_changed',
            'created',
            'batch_xykpool_hist_vols_list',
            NEW.id,
            jsonb_build_object(
              'pool_ids', NEW.pool_ids
            ));
        RETURN NEW;

      WHEN 'UPDATE' THEN
        PERFORM
          public.notify (
            'state_changed',
            'updated',
            'batch_xykpool_hist_vols_list',
            NEW.id,
            jsonb_build_object(
              'pool_ids', NEW.pool_ids
            ));
        RETURN NEW;

      WHEN 'DELETE' THEN
        PERFORM
          public.notify (
            'state_changed',
            'deleted',
            'batch_xykpool_hist_vols_list',
            OLD.id,
            jsonb_build_object(
              'pool_ids', OLD.pool_ids
            ));
        RETURN OLD;

  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;


CREATE FUNCTION public.notify_omnipool_asset_volume ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
      WHEN 'INSERT' THEN
        PERFORM
          public.notify ('state_changed', 'created', 'omnipool_asset_historical_volume', NEW.id); RETURN NEW;
      WHEN 'UPDATE' THEN
        PERFORM
          public.notify ('state_changed', 'updated', 'omnipool_asset_historical_volume', NEW.id); RETURN NEW;
      WHEN 'DELETE' THEN
        PERFORM
          public.notify ('state_changed', 'deleted', 'omnipool_asset_historical_volume', OLD.id); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;


CREATE FUNCTION public.notify_omnipool_asset_volumes_entries_list ()
    RETURNS TRIGGER
AS $$
BEGIN
CASE TG_OP

      WHEN 'INSERT' THEN
        PERFORM
          public.notify (
            'state_changed',
            'created',
            'batch_omnipool_asset_hist_vols_list',
            NEW.id,
            jsonb_build_object(
              'asset_ids', NEW.pool_ids
            ));
        RETURN NEW;

    WHEN 'UPDATE' THEN
        PERFORM
          public.notify (
            'state_changed',
            'updated',
            'batch_omnipool_asset_hist_vols_list',
            NEW.id,
            jsonb_build_object(
              'asset_ids', NEW.pool_ids
            ));
        RETURN NEW;

    WHEN 'DELETE' THEN
        PERFORM
          public.notify (
            'state_changed',
            'deleted',
            'batch_omnipool_asset_hist_vols_list',
            OLD.id,
            jsonb_build_object(
              'asset_ids', OLD.pool_ids
            ));
        RETURN OLD;

END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;



CREATE FUNCTION public.notify_stableswap_volume ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
      WHEN 'INSERT' THEN
        PERFORM
          public.notify ('state_changed', 'created', 'stableswap_historical_volume', NEW.id); RETURN NEW;
      WHEN 'UPDATE' THEN
        PERFORM
          public.notify ('state_changed', 'updated', 'stableswap_historical_volume', NEW.id); RETURN NEW;
      WHEN 'DELETE' THEN
        PERFORM
          public.notify ('state_changed', 'deleted', 'stableswap_historical_volume', OLD.id); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;


CREATE FUNCTION public.notify_stableswap_volumes_entries_list ()
    RETURNS TRIGGER
AS $$
BEGIN
CASE TG_OP

    WHEN 'INSERT' THEN
        PERFORM
          public.notify (
            'state_changed',
            'created',
            'batch_stableswap_hist_vols_list',
            NEW.id,
            jsonb_build_object(
              'pool_ids', NEW.pool_ids
            ));
        RETURN NEW;

    WHEN 'UPDATE' THEN
        PERFORM
          public.notify (
            'state_changed',
            'updated',
            'batch_stableswap_hist_vols_list',
            NEW.id,
            jsonb_build_object(
              'pool_ids', NEW.pool_ids
            ));
        RETURN NEW;

    WHEN 'DELETE' THEN
        PERFORM
          public.notify (
            'state_changed',
            'deleted',
            'batch_stableswap_hist_vols_list',
            OLD.id,
            jsonb_build_object(
              'pool_ids', OLD.pool_ids
            ));
        RETURN OLD;

END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;





CREATE TRIGGER _500_gql_update_xykpool_historical_volume
  AFTER INSERT OR UPDATE OR DELETE ON public.xykpool_historical_volume
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_xykpool_volume ();

CREATE TRIGGER _500_gql_update_xykpool_historical_volumes_batch_entries_list
  AFTER INSERT OR UPDATE OR DELETE ON public.batch_xykpool_hist_vols_list
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_xykpool_volumes_entries_list ();



CREATE TRIGGER _500_gql_update_omnipool_asset_historical_volume
  AFTER INSERT OR UPDATE OR DELETE ON public.omnipool_asset_historical_volume
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_omnipool_asset_volume ();

CREATE TRIGGER _500_gql_update_omnipool_asset_historical_volumes_batch_entries_list
  AFTER INSERT OR UPDATE OR DELETE ON public.batch_omnipool_asset_hist_vols_list
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_omnipool_asset_volumes_entries_list ();



CREATE TRIGGER _500_gql_update_stableswap_historical_volume
  AFTER INSERT OR UPDATE OR DELETE ON public.stableswap_historical_volume
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_stableswap_volume ();

CREATE TRIGGER _500_gql_update_stableswap_historical_volumes_batch_entries_list
  AFTER INSERT OR UPDATE OR DELETE ON public.batch_stableswap_hist_vols_list
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_stableswap_volumes_entries_list ();