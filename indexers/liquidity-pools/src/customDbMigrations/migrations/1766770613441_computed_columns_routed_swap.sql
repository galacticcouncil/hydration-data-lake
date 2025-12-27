DROP FUNCTION IF EXISTS swap_para_timestamp CASCADE;
DROP FUNCTION IF EXISTS swap_all_involved_asset_registry_ids CASCADE;

CREATE FUNCTION swap_para_timestamp(s public.swap) RETURNS timestamptz AS $$
    SELECT b.timestamp
    FROM public.block b
    WHERE b.height = s.para_block_height
$$ LANGUAGE sql STABLE;

CREATE FUNCTION swap_all_involved_asset_registry_ids(s public.swap) RETURNS text[] AS $$
    SELECT ARRAY_AGG(a.asset_registry_id)
    FROM public.asset a
    WHERE a.id = ANY(s.all_involved_asset_ids::text[])
$$ LANGUAGE sql STABLE;
