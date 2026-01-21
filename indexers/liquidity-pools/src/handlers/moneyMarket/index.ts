import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';

export async function saveAllMoneyMarketEvents(
  ctx: SqdProcessorContext<Store>
) {
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmSupplies.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmWithdrawals.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmBorrows.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmRepays.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmLiquidationCalls.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmUserEModeSetEvents.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(
      ctx.batchState.state.mmReserveUsedAsCollateralEnabledEvents.values()
    )
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(
      ctx.batchState.state.mmReserveUsedAsCollateralDisabledEvents.values()
    )
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.mmMintedToTreasuryEvents.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.moneyMarketEvents.values())
  );
}
