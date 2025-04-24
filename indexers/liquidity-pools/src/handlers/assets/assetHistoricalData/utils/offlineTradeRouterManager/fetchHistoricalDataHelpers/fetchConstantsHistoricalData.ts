import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  ConstantsHistoricalData,
  Xykpool,
  XykpoolHistoricalData,
} from '../../../../../../model';
import { In, Not } from 'typeorm';

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
