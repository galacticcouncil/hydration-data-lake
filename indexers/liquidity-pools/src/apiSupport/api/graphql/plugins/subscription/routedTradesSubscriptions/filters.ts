export function routedTradesSubscriptionFilter(event: any, args: any) {
  if (!args || !args.filter) return true;

  const filterArgs = args.filter;

  const isAssetsFilterProvided =
    filterArgs.assetIds &&
    Array.isArray(filterArgs.assetIds) &&
    filterArgs.assetIds.length > 0;

  const isSwapperIdsFilterProvided =
    filterArgs.swapperIds &&
    Array.isArray(filterArgs.swapperIds) &&
    filterArgs.swapperIds.length > 0;

  const isFillerIdsFilterProvided =
    filterArgs.fillerIds &&
    Array.isArray(filterArgs.fillerIds) &&
    filterArgs.fillerIds.length > 0;

  const isFeeRecipientIdsFilterProvided =
    filterArgs.feeRecipientIds &&
    Array.isArray(filterArgs.feeRecipientIds) &&
    filterArgs.feeRecipientIds.length > 0;

  const isParticipantIdsFilterProvided =
    filterArgs.participantIds &&
    Array.isArray(filterArgs.participantIds) &&
    filterArgs.participantIds.length > 0;

  if (
    !isAssetsFilterProvided &&
    !isSwapperIdsFilterProvided &&
    !isFillerIdsFilterProvided &&
    !isFeeRecipientIdsFilterProvided &&
    !isParticipantIdsFilterProvided
  )
    return true;

  let isAssetsFilterMatched = false;
  let isSwapperIdsFilterMatched = false;
  let isFillerIdsFilterMatched = false;
  let isFeeRecipientIdsFilterMatched = false;
  let isParticipantIdsFilterMatched = false;

  const eventExtraPayload = event.extra_payload ?? {};

  const allInvolvedAssetIdsSet = new Set(
    eventExtraPayload.all_involved_asset_ids || []
  );
  const participantSwappersSet = new Set(
    eventExtraPayload.participant_swappers || []
  );
  const participantFillersSet = new Set(
    eventExtraPayload.participant_fillers || []
  );
  const feeRecipientsSet = new Set(eventExtraPayload.fee_recipients || []);
  const participantsSet = new Set([
    ...(eventExtraPayload.participant_swappers || []),
    ...(eventExtraPayload.participant_fillers || []),
    ...(eventExtraPayload.fee_recipients || []),
  ]);

  if (isAssetsFilterProvided)
    isAssetsFilterMatched = filterArgs.assetIds.some((id: string) =>
      allInvolvedAssetIdsSet.has(id)
    );
  if (isSwapperIdsFilterProvided)
    isSwapperIdsFilterMatched = filterArgs.swapperIds.some((id: string) =>
      participantSwappersSet.has(id)
    );
  if (isFillerIdsFilterProvided)
    isFillerIdsFilterMatched = filterArgs.fillerIds.some((id: string) =>
      participantFillersSet.has(id)
    );
  if (isFeeRecipientIdsFilterProvided)
    isFeeRecipientIdsFilterMatched = filterArgs.feeRecipientIds.some(
      (id: string) => feeRecipientsSet.has(id)
    );
  if (isParticipantIdsFilterProvided)
    isParticipantIdsFilterMatched = filterArgs.participantIds.some(
      (id: string) => participantsSet.has(id)
    );

  return [
    isAssetsFilterMatched,
    isSwapperIdsFilterMatched,
    isFillerIdsFilterMatched,
    isFeeRecipientIdsFilterMatched,
    isParticipantIdsFilterMatched,
  ].some((res) => res);
}
