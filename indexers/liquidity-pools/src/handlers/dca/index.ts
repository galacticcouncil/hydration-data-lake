import { In } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { DcaSchedule, DcaScheduleExecution } from '../../model';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';
import { SqdProcessorContext } from '../../processor';
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

export async function handleDcaSchedules(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_DCA) return;

  console.time(`handleDcaSchedules :: prefetchEntities`);
  await prefetchEntities(ctx, parsedEvents);
  console.timeEnd(`handleDcaSchedules :: prefetchEntities`);

  console.time(`handleDcaSchedules :: handleDcaScheduleCreated`);
  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_Scheduled).values()
    )
  )) {
    await handleDcaScheduleCreated(ctx, eventData);
  }
  console.timeEnd(`handleDcaSchedules :: handleDcaScheduleCreated`);

  console.time(`handleDcaSchedules :: handleDcaScheduleExecutionPlanned`);
  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents
        .getSectionByEventName(EventName.DCA_ExecutionPlanned)
        .values()
    )
  )) {
    await handleDcaScheduleExecutionPlanned(ctx, eventData);
  }
  console.timeEnd(`handleDcaSchedules :: handleDcaScheduleExecutionPlanned`);

  console.time(`handleDcaSchedules :: handleDcaTradeExecuted`);
  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_TradeExecuted).values()
    )
  )) {
    await handleDcaTradeExecuted(ctx, eventData);
  }
  console.timeEnd(`handleDcaSchedules :: handleDcaTradeExecuted`);

  console.time(`handleDcaSchedules :: handleDcaTradeFailed`);
  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_TradeFailed).values()
    )
  )) {
    await handleDcaTradeFailed(ctx, eventData);
  }
  console.timeEnd(`handleDcaSchedules :: handleDcaTradeFailed`);

  console.time(`handleDcaSchedules :: handleDcaScheduleCompleted`);
  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_Completed).values()
    )
  )) {
    await handleDcaScheduleCompleted(ctx, eventData);
  }
  console.timeEnd(`handleDcaSchedules :: handleDcaScheduleCompleted`);

  console.time(`handleDcaSchedules :: handleDcaScheduleTerminated`);
  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_Terminated).values()
    )
  )) {
    await handleDcaScheduleTerminated(ctx, eventData);
  }
  console.timeEnd(`handleDcaSchedules :: handleDcaScheduleTerminated`);

  await saveDcaEntities(ctx);
}

export async function saveDcaEntities(ctx: SqdProcessorContext<Store>) {
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaSchedules.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaScheduleOrderRoutes.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaScheduleEvents.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaScheduleExecutions.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaScheduleExecutionEvents.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.swaps.values())
  );
}

async function prefetchEntities(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const scheduleIdsSet = new Set<string>();
  const scheduleExecutionsSet = new Set<string>();

  for (const event of parsedEvents
    .getSectionByEventName(EventName.DCA_Scheduled)
    .values()) {
    scheduleIdsSet.add(event.eventData.params.id.toString());
  }

  for (const event of parsedEvents
    .getSectionByEventName(EventName.DCA_Completed)
    .values()) {
    scheduleIdsSet.add(event.eventData.params.id.toString());
  }

  for (const event of parsedEvents
    .getSectionByEventName(EventName.DCA_Terminated)
    .values()) {
    scheduleIdsSet.add(event.eventData.params.id.toString());
  }

  for (const event of parsedEvents
    .getSectionByEventName(EventName.DCA_ExecutionPlanned)
    .values()) {
    const id = event.eventData.params.id.toString();
    scheduleIdsSet.add(id);
    scheduleExecutionsSet.add(`${id}-${event.eventData.params.blockNumber}`);
  }

  for (const event of parsedEvents
    .getSectionByEventName(EventName.DCA_TradeExecuted)
    .values()) {
    const id = event.eventData.params.id.toString();
    scheduleIdsSet.add(id);
    scheduleExecutionsSet.add(
      `${id}-${event.eventData.metadata.blockHeader.height}`
    );
  }

  for (const event of parsedEvents
    .getSectionByEventName(EventName.DCA_TradeFailed)
    .values()) {
    const id = event.eventData.params.id.toString();
    scheduleIdsSet.add(id);
    scheduleExecutionsSet.add(
      `${id}-${event.eventData.metadata.blockHeader.height}`
    );
  }

  const scheduleIds = Array.from(scheduleIdsSet);
  const scheduleExecutions = Array.from(scheduleExecutionsSet);

  if (scheduleIds.length === 0 && scheduleExecutions.length === 0) {
    return;
  }

  const promises = [];

  if (scheduleIds.length > 0) {
    promises.push(
      ctx.storeUtils.findWithLogs(
        DcaSchedule,
        {
          where: { id: In(scheduleIds) },
          relations: {
            executions: true,
          },
        },
        { className: 'DcaSchedule' }
      )
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  if (scheduleExecutions.length > 0) {
    promises.push(
      ctx.storeUtils.findWithLogs(
        DcaScheduleExecution,
        {
          where: { id: In(scheduleExecutions) },
          relations: {
            schedule: true,
            events: {
              scheduleExecution: true,
              swaps: true,
              event: true,
            },
          },
        },
        { className: 'DcaScheduleExecution' }
      )
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  const [prefetchedSchedules, prefetchedScheduleExecutions] =
    (await Promise.all(promises)) as [DcaSchedule[], DcaScheduleExecution[]];

  if (prefetchedSchedules.length > 0)
    for (const prefetchedSchedule of prefetchedSchedules) {
      ctx.batchState.state.dcaSchedules.set(
        prefetchedSchedule.id,
        prefetchedSchedule
      );
    }

  if (prefetchedScheduleExecutions.length > 0)
    for (const prefetchedScheduleExec of prefetchedScheduleExecutions) {
      ctx.batchState.state.dcaScheduleExecutions.set(
        prefetchedScheduleExec.id,
        prefetchedScheduleExec
      );
    }
}
