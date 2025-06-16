import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AssetHistoricalData } from '../../model';
import pMap from 'p-map';
import { LessThan } from 'typeorm';

export async function getAssetHistDataWithUniqueData(
  src: Map<string, AssetHistoricalData>,
  ctx: ProcessorContext<Store>
) {
  const result: Map<string, AssetHistoricalData> = new Map();
  const concurrencyLimit = 1000;

  const assetHistoryIndex = new Map<string, AssetHistoricalData[]>();

  for (const i of (
    src || ctx.batchState.state.assetHistoricalDataItems
  ).values()) {
    if (!assetHistoryIndex.has(i.asset.id)) {
      assetHistoryIndex.set(i.asset.id, []);
    }
    assetHistoryIndex.get(i.asset.id)!.push(i);
  }

  for (const [assetId, list] of assetHistoryIndex.entries()) {
    assetHistoryIndex.set(
      assetId,
      list.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    );
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAssetHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: assetHistoryIndex,
          ctx,
        })
      ) {
        result.set(item.id, item);
      }
    },
    { concurrency: concurrencyLimit }
  );

  return result;
}

export async function isAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: AssetHistoricalData;
  cachedIndexedRecords: Map<string, AssetHistoricalData[]>;
  ctx: ProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.asset.id) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(AssetHistoricalData, {
      where: {
        asset: {
          id: currentRecord.asset.id,
        },
        paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    });
  }

  if (!previousItem) {
    return true;
  }

  let isEqual = true;

  if (
    previousItem.totalIssuance !== currentRecord.totalIssuance ||
    previousItem.existentialDeposit !== currentRecord.existentialDeposit ||
    !!previousItem.dynamicFee !== !!currentRecord.dynamicFee ||
    (!!previousItem.dynamicFee &&
      !!currentRecord.dynamicFee &&
      previousItem.dynamicFee.d.join(',') !==
        currentRecord.dynamicFee.d.join(','))
  ) {
    isEqual = false;
  }

  return !isEqual;
}
