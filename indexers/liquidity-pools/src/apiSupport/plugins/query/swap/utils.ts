import type * as pg from 'pg';
import {
  AggregateSwapAssetFeesByBlocksRangeSqlResult,
  SwapAssetFeeAggregated,
} from './resolvers';
import { aggregateSwapAssetFeesByBlocksRange } from '../../sql/swap.sql';

function getRawDataIntersections(
  rawResult: AggregateSwapAssetFeesByBlocksRangeSqlResult
) {
  const startGroupSet = new Set(
    rawResult.grouped_result.group_start.map((item) => item.asset_id)
  );
  const endGroupSet = new Set(
    rawResult.grouped_result.group_end.map((item) => item.asset_id)
  );

  return {
    commonIds: [...startGroupSet].filter((item) => endGroupSet.has(item)),
    uniqueIds: [
      ...[...startGroupSet].filter((item) => !endGroupSet.has(item)),
      ...[...endGroupSet].filter((item) => !startGroupSet.has(item)),
    ],
  };
}

export async function handleSwapAssetFeesByPeriodAggregation({
  startBlockHeight,
  stopBlockHeight,
  pgClient,
}: {
  startBlockHeight: number;
  stopBlockHeight: number;
  pgClient: pg.Client;
}): Promise<SwapAssetFeeAggregated[]> {
  console.time('handleSwapAssetFeesByPeriodAggregation DB query');
  const groupedResult =
    await pgClient.query<AggregateSwapAssetFeesByBlocksRangeSqlResult>(
      aggregateSwapAssetFeesByBlocksRange,
      [startBlockHeight, stopBlockHeight]
    );
  console.timeEnd('handleSwapAssetFeesByPeriodAggregation DB query');

  if (groupedResult?.rows.length === 0) return [];

  const startGroupMap = new Map(
    groupedResult.rows[0].grouped_result.group_start.map((item) => [
      item.asset_id,
      item,
    ])
  );
  const endGroupMap = new Map(
    groupedResult.rows[0].grouped_result.group_end.map((item) => [
      item.asset_id,
      item,
    ])
  );

  const { commonIds, uniqueIds } = getRawDataIntersections(
    groupedResult.rows[0]
  );

  const decoratedNodes: SwapAssetFeeAggregated[] = [];

  for (const commonId of commonIds) {
    const startGroupItem = startGroupMap.get(commonId)!;
    const endGroupItem = endGroupMap.get(commonId)!;
    decoratedNodes.push({
      assetId: startGroupItem.asset_id,
      assetRegistryId: startGroupItem.asset_registry_id,
      amount:
        BigInt(endGroupItem.total_amount) -
        BigInt(startGroupItem.total_amount) +
        BigInt(startGroupItem.amount),
    });
  }
  for (const uniqueId of uniqueIds) {
    const item = startGroupMap.get(uniqueId) ?? endGroupMap.get(uniqueId);
    if (!item) continue;

    decoratedNodes.push({
      assetId: item.asset_id,
      assetRegistryId: item.asset_registry_id,
      amount: BigInt(item.amount),
    });
  }

  return decoratedNodes;
}
