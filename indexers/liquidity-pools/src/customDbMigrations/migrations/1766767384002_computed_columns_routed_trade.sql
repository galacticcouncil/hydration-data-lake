DROP FUNCTION IF EXISTS routed_trade_block CASCADE;
DROP FUNCTION IF EXISTS routed_trade_input_asset_registry_ids CASCADE;
DROP FUNCTION IF EXISTS routed_trade_output_asset_registry_ids CASCADE;

CREATE FUNCTION routed_trade_block(rt public.routed_trade) RETURNS public.block AS $$
    SELECT b.*
    FROM public.block b
    WHERE b.height = rt.para_block_height
$$ LANGUAGE sql STABLE;

CREATE FUNCTION routed_trade_input_asset_registry_ids(rt public.routed_trade) RETURNS text[] AS $$
    SELECT ARRAY_AGG(a.asset_registry_id)
    FROM public.asset a
    WHERE a.id = ANY(rt.input_asset_ids::text[])
$$ LANGUAGE sql STABLE;

CREATE FUNCTION routed_trade_output_asset_registry_ids(rt public.routed_trade) RETURNS text[] AS $$
    SELECT ARRAY_AGG(a.asset_registry_id)
    FROM public.asset a
    WHERE a.id = ANY(rt.output_asset_ids::text[])
$$ LANGUAGE sql STABLE;