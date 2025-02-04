import type { QueryBuilder, SQL } from 'graphile-build-pg';

export function routeTradeSelectGraphQLResult({
  sql,
  event,
  tableAlias,
  sqlBuilder,
}: {
  sql: SQL & { fragment: any; value: any };
  event: any;
  tableAlias: any;
  sqlBuilder: QueryBuilder;
}) {
  sqlBuilder.where(
    sql.fragment`${tableAlias}.id = ${sql.value(event.__node__.node_id)}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.id`, 'id');
  sqlBuilder.select(sql.fragment`${tableAlias}.route_id`, 'route_id');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.all_involved_asset_ids`,
    'all_involved_asset_ids'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.participant_swappers`,
    'participant_swappers'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.participant_fillers`,
    'participant_fillers'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.fee_recipients`,
    'fee_recipients'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.para_block_height`,
    'para_block_height'
  );
  sqlBuilder.select(
    sql.fragment`${tableAlias}.relay_block_height`,
    'relay_block_height'
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.block_id`, 'block_id');
}

export function routeTradeAssetBalanceSelectGraphQLResult({
  sql,
  event,
  tableAlias,
  sqlBuilder,
}: {
  sql: SQL & { fragment: any; value: any };
  event: any;
  tableAlias: any;
  sqlBuilder: QueryBuilder;
}) {
  sqlBuilder.where(
    sql.fragment`${tableAlias}.route_trade_id = ${sql.value(event.__node__.node_id)}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.asset_id`, 'asset_id');
  sqlBuilder.select(sql.fragment`${tableAlias}.amount`, 'amount');
  sqlBuilder.select(
    sql.fragment`${tableAlias}.asset_balance_type`,
    'asset_balance_type'
  );
}
export function routeTradeSwapsSelectGraphQLResult({
  sql,
  event,
  tableAlias,
  sqlBuilder,
}: {
  sql: SQL & { fragment: any; value: any };
  event: any;
  tableAlias: any;
  sqlBuilder: QueryBuilder;
}) {
  sqlBuilder.where(
    sql.fragment`${tableAlias}.route_trade_id = ${sql.value(event.__node__.node_id)}`
  );
  sqlBuilder.select(sql.fragment`${tableAlias}.id`, 'id');
}

export function routeTradesSubscriptionFilter(event: any, args: any) {
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
