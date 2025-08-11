import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';

export async function saveAllMoneyMarketEvents(
  ctx: SqdProcessorContext<Store>
) {
  await ctx.store.save([...ctx.batchState.state.mmSupplies.values()]);
  await ctx.store.save([...ctx.batchState.state.mmWithdrawals.values()]);
  await ctx.store.save([...ctx.batchState.state.mmBorrows.values()]);
  await ctx.store.save([...ctx.batchState.state.mmRepays.values()]);
  await ctx.store.save([...ctx.batchState.state.mmLiquidationCalls.values()]);
  await ctx.store.save([...ctx.batchState.state.mmUserEModeSetEvents.values()]);
  await ctx.store.save([
    ...ctx.batchState.state.mmReserveUsedAsCollateralEnabledEvents.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.mmReserveUsedAsCollateralDisabledEvents.values(),
  ]);
  await ctx.store.save([...ctx.batchState.state.moneyMarketEvents.values()]);
}
