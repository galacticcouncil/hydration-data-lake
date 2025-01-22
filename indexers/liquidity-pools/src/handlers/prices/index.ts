import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleLbpPoolPrices } from './lbpPoolPrice';
import { handleXykPoolPrices } from './xykPoolPrice';

export async function handlePoolPrices(ctx: ProcessorContext<Store>) {
  if (ctx.appConfig.PROCESS_LBP_POOLS) await handleLbpPoolPrices(ctx);
  if (ctx.appConfig.PROCESS_XYK_POOLS) await handleXykPoolPrices(ctx);

  await ctx.store.save([
    ...ctx.batchState.state.lbpPoolHistoricalPrices.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.xykPoolHistoricalPrices.values(),
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
