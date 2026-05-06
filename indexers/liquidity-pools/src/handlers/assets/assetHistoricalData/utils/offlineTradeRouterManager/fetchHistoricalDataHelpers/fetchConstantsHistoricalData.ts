import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  ConstantsHistoricalData,
  EmaOracleEntryHistoricalData,
} from '../../../../../../model';
import { fetchEmaOracleEntriesHistoricalDataForBlocksRangeResolver } from './fetchEmaOraclesHistoricalData';
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

  const persistedHistData = await ctx.storeUtils.findOneWithLogs(
    ConstantsHistoricalData,
    {
      where: {
        paraBlockHeight: blockNumber,
      },
    },
    {
      className: 'ConstantsHistoricalData',
      originCallFn: 'fetchConstantsHistoricalData',
    }
  );

  return persistedHistData;
}

export async function fetchConstantsHistoricalDataForBlocksRangeResolver({
  blockFromNumber,
  blockToNumber,
  ctx,
}: {
  blockFromNumber: number;
  blockToNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const cachedHistData: ConstantsHistoricalData[] = [];
  for (const item of ctx.batchState.state.constantsHistoricalData.values()) {
    if (
      item.paraBlockHeight >= blockFromNumber &&
      item.paraBlockHeight <= blockToNumber
    ) {
      cachedHistData.push(item);
    }
  }

  let persistedHistData: ConstantsHistoricalData[] = [];

  if (!cachedHistData || cachedHistData.length === 0)
    persistedHistData = ctx.appConfig
      .ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE
      ? await ctx.storeUtils.findWithLogs(
          ConstantsHistoricalData,
          {
            where: {
              paraBlockHeight: Between(blockFromNumber - 1, blockToNumber + 1),
            },
          },
          {
            className: 'ConstantsHistoricalData',
            originCallFn: 'offline_trade_router_spot_price_calc_prefetch',
          }
        )
      : [];

  const histDataPerBlock = new Map<number, ConstantsHistoricalData>();

  for (const histDataItem of cachedHistData || persistedHistData) {
    histDataPerBlock.set(histDataItem.paraBlockHeight, histDataItem);
  }

  return histDataPerBlock;
}
