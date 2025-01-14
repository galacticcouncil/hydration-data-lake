import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import {
  getOrderedListByBlockNumber,
  getTotalAvailableHeapSizeMb,
} from '../../utils/helpers';
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
import { DcaSchedule, DcaScheduleExecution } from '../../model';
import { In } from 'typeorm';

export async function handleDcaSchedules(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_DCA) return;

  await prefetchEntities(ctx, parsedEvents);

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
  await saveDcaEntities(ctx);
}

export async function saveDcaEntities(ctx: ProcessorContext<Store>) {
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

async function prefetchEntities(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const scheduleIds = [
    ...new Set([
      ...[
        ...parsedEvents.getSectionByEventName(EventName.DCA_Scheduled).values(),
      ].map((event) => event.eventData.params.id),
      ...[
        ...parsedEvents.getSectionByEventName(EventName.DCA_Completed).values(),
      ].map((event) => event.eventData.params.id),
      ...[
        ...parsedEvents
          .getSectionByEventName(EventName.DCA_Terminated)
          .values(),
      ].map((event) => event.eventData.params.id),
      ...[
        ...parsedEvents
          .getSectionByEventName(EventName.DCA_ExecutionPlanned)
          .values(),
      ].map((event) => event.eventData.params.id),
      ...[
        ...parsedEvents
          .getSectionByEventName(EventName.DCA_TradeExecuted)
          .values(),
      ].map((event) => event.eventData.params.id),
      ...[
        ...parsedEvents
          .getSectionByEventName(EventName.DCA_TradeFailed)
          .values(),
      ].map((event) => event.eventData.params.id),
    ]).values(),
  ];

  const scheduleExecutions = [
    ...new Set([
      ...[
        ...parsedEvents
          .getSectionByEventName(EventName.DCA_ExecutionPlanned)
          .values(),
      ].map(
        (event) =>
          `${event.eventData.params.id}-${event.eventData.params.blockNumber}`
      ),
      ...[
        ...parsedEvents
          .getSectionByEventName(EventName.DCA_TradeExecuted)
          .values(),
      ].map(
        (event) =>
          `${event.eventData.params.id}-${event.eventData.metadata.blockHeader.height}`
      ),
      ...[
        ...parsedEvents
          .getSectionByEventName(EventName.DCA_TradeFailed)
          .values(),
      ].map(
        (event) =>
          `${event.eventData.params.id}-${event.eventData.metadata.blockHeader.height}`
      ),
    ]).values(),
  ];

  const prefetchedSchedules = await ctx.store.find(DcaSchedule, {
    where: { id: In(scheduleIds) },
    relations: {
      owner: true,
      executions: true,
    },
  });
  const prefetchedScheduleExecutions = await ctx.store.find(
    DcaScheduleExecution,
    {
      where: { id: In(scheduleExecutions) },
      relations: {
        schedule: {
          owner: true,
        },
        actions: true,
      },
    }
  );

  const state = ctx.batchState.state;

  if (prefetchedSchedules.length > 0)
    state.dcaSchedules = new Map(
      [...state.dcaSchedules.values(), ...prefetchedSchedules].map((item) => [
        item.id,
        item,
      ])
    );

  if (prefetchedScheduleExecutions.length > 0)
    state.dcaScheduleExecutions = new Map(
      [
        ...state.dcaScheduleExecutions.values(),
        ...prefetchedScheduleExecutions,
      ].map((item) => [item.id, item])
    );

  ctx.batchState.state = {
    dcaSchedules: state.dcaSchedules,
    dcaScheduleExecutions: state.dcaScheduleExecutions,
  };
}
