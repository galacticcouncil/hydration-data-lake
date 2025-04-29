import { SqdProcessorContext } from '../../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EmaOracleEntryHistoricalData } from '../../../../../../model';

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

  const persistedHistData = await ctx.store.find(EmaOracleEntryHistoricalData, {
    where: {
      paraBlockHeight: blockNumber,
    },
    relations: {
      assetA: true,
      assetB: true,
      block: true,
    },
  });

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
