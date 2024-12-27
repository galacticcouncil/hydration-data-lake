import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import {
  handleDcaScheduleCompleted,
  handleDcaScheduleCreated,
  handleDcaScheduleTerminated,
} from './dcaSchedule';
import {
  handleDcaScheduleExecutionPlanned,
  handleDcaTradeExecuted,
  handleDcaTradeFailed,
} from './dcaScheduleExecution';
import { handleDcaRandomnessGenerationFailed } from './dcaRandomnessGenerationFailed';

export async function handleDcaSchedules(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_DCA) return;

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.DCA_Scheduled).values(),
  ])) {
    await handleDcaScheduleCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.DCA_Completed).values(),
  ])) {
    await handleDcaScheduleCompleted(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.DCA_Terminated).values(),
  ])) {
    await handleDcaScheduleTerminated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.DCA_ExecutionPlanned)
      .values(),
  ])) {
    await handleDcaScheduleExecutionPlanned(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.DCA_TradeExecuted).values(),
  ])) {
    await handleDcaTradeExecuted(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.DCA_TradeFailed).values(),
  ])) {
    await handleDcaTradeFailed(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents
      .getSectionByEventName(EventName.DCA_RandomnessGenerationFailed)
      .values(),
  ])) {
    await handleDcaRandomnessGenerationFailed(ctx, eventData);
  }

  await ctx.store.save([...ctx.batchState.state.dcaSchedules.values()]);
  await ctx.store.save([
    ...ctx.batchState.state.dcaScheduleOrderRoutes.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.dcaScheduleExecutions.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.dcaScheduleExecutionActions.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.dcaRandomnessGenerationFailedErrors.values(),
  ]);
}
