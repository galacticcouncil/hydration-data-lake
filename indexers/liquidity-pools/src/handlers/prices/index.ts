import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../processor';
import { handleLbpPoolPrices } from './lbpPoolPrice';

export async function handlePoolPrices(ctx: SqdProcessorContext<Store>) {
  if (ctx.appConfig.PROCESS_LBP_POOLS) await handleLbpPoolPrices(ctx);

  await ctx.store.save([
    ...ctx.batchState.state.lbpPoolHistoricalPrices.values(),
  ]);

  await ctx.store.save(
    [...ctx.batchState.state.xykAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.xykPoolIdsToSave.has(pool.id)
    )
  );

  await ctx.store.save(
    [...ctx.batchState.state.lbpAllBatchPools.values()].filter((pool) =>
      ctx.batchState.state.lbpPoolIdsToSave.has(pool.id)
    )
  );
}
