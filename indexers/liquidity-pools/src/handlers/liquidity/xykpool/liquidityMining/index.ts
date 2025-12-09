import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../../../utils/helpers';
import { EventName } from '../../../../parsers/types/events';
import {
  handleXylpoolLMDepositDestroyed,
  handleXylpoolLMSharesDeposited,
} from './depositsHandlers';

export async function handleXykPoolLiquidityMiningEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.XYKLiquidityMining_SharesDeposited)
      .values(),
  ])) {
    await handleXylpoolLMSharesDeposited(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.XYKLiquidityMining_DepositDestroyed)
      .values(),
  ])) {
    await handleXylpoolLMDepositDestroyed(ctx, eventData);
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.xykYieldFarmDeposits.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.xykYieldFarmDepositEvents.values())
  );
}
