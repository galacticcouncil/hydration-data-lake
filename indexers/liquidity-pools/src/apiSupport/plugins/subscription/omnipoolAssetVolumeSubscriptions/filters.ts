export function omnipoolAssetHistoricalVolumeSubscriptionFilter(
  event: any,
  args: any
) {
  if (
    !args ||
    !args.filter ||
    !args.filter.assetIds ||
    !Array.isArray(args.filter.assetIds) ||
    args.filter.assetIds.length === 0
  )
    return true;

  return new Set(args.filter.assetIds).has(
    event.__node__.node_id.match(/^([a-zA-Z0-9]+-[0-9]+)-[0-9]+$/)[1]
  );
}

export function omnipoolAssetHistoricalVolumeByPeriodSubscriptionFilter(
  event: any,
  args: any
) {
  if (
    !args ||
    !args.filter ||
    !args.filter.assetIds ||
    !Array.isArray(args.filter.assetIds) ||
    args.filter.assetIds.length === 0
  )
    return false;

  const eventExtraPayload = event.extra_payload ?? {};
  if (!eventExtraPayload.asset_ids) return false;

  const involvedAssetIdsSet = new Set(eventExtraPayload.asset_ids);

  return args.filter.assetIds.some((id: string) => involvedAssetIdsSet.has(id));
}
