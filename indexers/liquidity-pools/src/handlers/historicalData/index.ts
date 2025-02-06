import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';

export class HistoricalDataManager {
  static async saveHistoricalDataBulk(ctx: SqdProcessorContext<Store>) {
    await ctx.store.save([
      ...ctx.batchState.state.historicalAssetSwapFees.values(),
    ]);
    await ctx.store.save([
      ...ctx.batchState.state.historicalAccountSwapFees.values(),
    ]);
    await ctx.store.save([
      ...ctx.batchState.state.historicalAccountAssetSwapFees.values(),
    ]);
  }
}
