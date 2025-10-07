import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetHistoricalData,
  EmaOracleEntryHistoricalData,
} from '../../../../../../model';
import { Between } from 'typeorm/find-options/operator/Between';

export async function fetchEmaOracleEntriesHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const cachedHistData = [
    ...ctx.batchState.state.emaOracleEntriesHistoricalData.values(),
  ].filter((item) => item.paraBlockHeight === blockNumber);

  const persistedHistData = await ctx.storeUtils.findWithLogs(EmaOracleEntryHistoricalData, {
    where: {
      paraBlockHeight: blockNumber,
    },
    relations: {
      assetA: true,
      assetB: true,
      block: true,
    },
  }, { className: 'EmaOracleEntryHistoricalData' });

  return new Map([
    ...persistedHistData.map(
      (histData): [string, EmaOracleEntryHistoricalData] => [
        histData.id,
        histData,
      ]
    ),
    ...cachedHistData.map(
      (histData): [string, EmaOracleEntryHistoricalData] => [
        histData.id,
        histData,
      ]
    ),
  ]);
}

export async function fetchEmaOracleEntriesHistoricalDataForBlocksRange({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const cachedHistData = [
    ...ctx.batchState.state.emaOracleEntriesHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight > blockFromNumber - 1 &&
      item.paraBlockHeight < blockToNumber + 1
  );

  const persistedHistData = await ctx.storeUtils.findWithLogs(EmaOracleEntryHistoricalData, {
    where: {
      paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
    },
    relations: {
      assetA: true,
      assetB: true,
      block: true,
    },
  }, { className: 'EmaOracleEntryHistoricalData' });

  // const mergedDataMap = new Map([
  //   ...persistedHistData.map(
  //     (histData): [string, EmaOracleEntryHistoricalData] => [
  //       histData.id,
  //       histData,
  //     ]
  //   ),
  //   ...cachedHistData.map(
  //     (histData): [string, EmaOracleEntryHistoricalData] => [
  //       histData.id,
  //       histData,
  //     ]
  //   ),
  // ]);

  const mergedDataMap = new Map<string, EmaOracleEntryHistoricalData>();
  for (const histData of persistedHistData) {
    mergedDataMap.set(histData.id, histData);
  }
  for (const histData of cachedHistData) {
    mergedDataMap.set(histData.id, histData);
  }

  const histDataPerBlock = new Map<
    number,
    Map<string, EmaOracleEntryHistoricalData>
  >();

  for (const histDataItem of mergedDataMap.values()) {
    if (!histDataPerBlock.has(histDataItem.paraBlockHeight))
      histDataPerBlock.set(histDataItem.paraBlockHeight, new Map());

    histDataPerBlock
      .get(histDataItem.paraBlockHeight)!
      .set(histDataItem.id, histDataItem);
  }

  return histDataPerBlock;
}
