import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';

export async function saveAllMoneyMarketEvents(
  ctx: SqdProcessorContext<Store>
) {
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmSupplies.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmWithdrawals.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmBorrows.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmRepays.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmLiquidationCalls.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmUserEModeSetEvents.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(
      ctx.batchState.state.mmReserveUsedAsCollateralEnabledEvents.values()
    ),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(
      ctx.batchState.state.mmReserveUsedAsCollateralDisabledEvents.values()
    ),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.moneyMarketEvents.values()),
    ctx
  );
}
