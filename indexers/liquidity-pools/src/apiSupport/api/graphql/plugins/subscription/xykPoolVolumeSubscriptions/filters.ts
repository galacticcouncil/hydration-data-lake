export function xykpoolHistoricalVolumeSubscriptionFilter(
  event: any,
  args: any
) {
  if (
    !args ||
    !args.filter ||
    !args.filter.poolIds ||
    !Array.isArray(args.filter.poolIds) ||
    args.filter.poolIds.length === 0
  )
    return true;

  return new Set(args.filter.poolIds).has(event.__node__.node_id.split('-')[0]);
}

export function xykpoolHistoricalVolumeByPeriodSubscriptionFilter(
  event: any,
  args: any
) {
  if (
    !args ||
    !args.filter ||
    !args.filter.poolIds ||
    !Array.isArray(args.filter.poolIds) ||
    args.filter.poolIds.length === 0
  )
    return false;

  const eventExtraPayload = event.extra_payload ?? {};
  if (!eventExtraPayload.pool_ids) return false;

  const involvedPoolIdsSet = new Set(eventExtraPayload.pool_ids);

  return args.filter.poolIds.some((id: string) => involvedPoolIdsSet.has(id));
}
