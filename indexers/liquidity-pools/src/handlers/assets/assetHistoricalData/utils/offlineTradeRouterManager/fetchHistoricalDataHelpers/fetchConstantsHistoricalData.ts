import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  ConstantsHistoricalData,
  EmaOracleEntryHistoricalData,
} from '../../../../../../model';
import { fetchEmaOracleEntriesHistoricalDataForBlocksRange } from './fetchEmaOraclesHistoricalData';
import { Between } from 'typeorm/find-options/operator/Between';

export async function fetchConstantsHistoricalData({
  blockNumber,
  ctx,
}: {
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const cachedHistData = [
    ...ctx.batchState.state.constantsHistoricalData.values(),
  ].find(
    (item) => item.paraBlockHeight === blockNumber // TODO check this condition item.paraBlockHeight === blockNumber
  );

  if (cachedHistData) return cachedHistData;

  const persistedHistData = await ctx.store.findOne(ConstantsHistoricalData, {
    where: {
      paraBlockHeight: blockNumber,
    },
  });

  return persistedHistData;
}

export async function fetchConstantsHistoricalDataForBlocksRange({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const cachedHistData = [
    ...ctx.batchState.state.constantsHistoricalData.values(),
  ].filter(
    (item) =>
      item.paraBlockHeight > blockFromNumber - 1 &&
      item.paraBlockHeight < blockToNumber + 1
  );

  let persistedHistData: ConstantsHistoricalData[] = [];

  if (!cachedHistData)
    persistedHistData = await ctx.store.find(ConstantsHistoricalData, {
      where: {
        paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
      },
    });

  const histDataPerBlock = new Map<number, ConstantsHistoricalData>();

  for (const histDataItem of cachedHistData || persistedHistData) {
    histDataPerBlock.set(histDataItem.paraBlockHeight, histDataItem);
  }

  return histDataPerBlock;
}
