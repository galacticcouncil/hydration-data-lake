import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import { getOrderedListByBlockNumber } from '../../../../utils/helpers';
import { EventName } from '../../../../parsers/types/events';
import {
  handleOmnipoolLMDepositDestroyed,
  handleOmnipoolLMSharesDeposited,
} from './depositHandlers';

export async function handleOmnipoolLiquidityMiningEvents(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.OmnipoolLiquidityMining_SharesDeposited)
      .values(),
  ])) {
    await handleOmnipoolLMSharesDeposited(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.OmnipoolLiquidityMining_DepositDestroyed)
      .values(),
  ])) {
    await handleOmnipoolLMDepositDestroyed(ctx, eventData);
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolYieldFarmDeposits.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolYieldFarmDepositEvents.values())
  );
}
