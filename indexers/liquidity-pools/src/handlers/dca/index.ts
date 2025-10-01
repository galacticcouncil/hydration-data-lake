import { SqdProcessorContext } from '../../processor';
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
import { DcaSchedule, DcaScheduleExecution } from '../../model';
import { In } from 'typeorm';

export async function handleDcaSchedules(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_DCA) return;

  await prefetchEntities(ctx, parsedEvents);

  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_Scheduled).values()
    )
  )) {
    await handleDcaScheduleCreated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_Completed).values()
    )
  )) {
    await handleDcaScheduleCompleted(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_Terminated).values()
    )
  )) {
    await handleDcaScheduleTerminated(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents
        .getSectionByEventName(EventName.DCA_ExecutionPlanned)
        .values()
    )
  )) {
    await handleDcaScheduleExecutionPlanned(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_TradeExecuted).values()
    )
  )) {
    await handleDcaTradeExecuted(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(
    Array.from(
      parsedEvents.getSectionByEventName(EventName.DCA_TradeFailed).values()
    )
  )) {
    await handleDcaTradeFailed(ctx, eventData);
  }

  await saveDcaEntities(ctx);
}

export async function saveDcaEntities(ctx: SqdProcessorContext<Store>) {
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaSchedules.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaScheduleOrderRoutes.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaScheduleEvents.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaScheduleExecutions.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.dcaScheduleExecutionEvents.values()),
    ctx
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.swaps.values()),
    ctx
  );
}

async function prefetchEntities(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const scheduleIds = Array.from(
    new Set(
      [
        Array.from(
          parsedEvents.getSectionByEventName(EventName.DCA_Scheduled).values()
        ).map((event) => event.eventData.params.id),
        Array.from(
          parsedEvents.getSectionByEventName(EventName.DCA_Completed).values()
        ).map((event) => event.eventData.params.id),
        Array.from(
          parsedEvents.getSectionByEventName(EventName.DCA_Terminated).values()
        ).map((event) => event.eventData.params.id),
        Array.from(
          parsedEvents
            .getSectionByEventName(EventName.DCA_ExecutionPlanned)
            .values()
        ).map((event) => event.eventData.params.id),
        Array.from(
          parsedEvents
            .getSectionByEventName(EventName.DCA_TradeExecuted)
            .values()
        ).map((event) => event.eventData.params.id),
        Array.from(
          parsedEvents.getSectionByEventName(EventName.DCA_TradeFailed).values()
        ).map((event) => event.eventData.params.id),
      ].flat()
    ).values()
  );

  const scheduleExecutions = Array.from(
    new Set(
      [
        Array.from(
          parsedEvents
            .getSectionByEventName(EventName.DCA_ExecutionPlanned)
            .values()
        ).map(
          (event) =>
            `${event.eventData.params.id}-${event.eventData.params.blockNumber}`
        ),
        Array.from(
          parsedEvents
            .getSectionByEventName(EventName.DCA_TradeExecuted)
            .values()
        ).map(
          (event) =>
            `${event.eventData.params.id}-${event.eventData.metadata.blockHeader.height}`
        ),
        Array.from(
          parsedEvents.getSectionByEventName(EventName.DCA_TradeFailed).values()
        ).map(
          (event) =>
            `${event.eventData.params.id}-${event.eventData.metadata.blockHeader.height}`
        ),
      ].flat()
    ).values()
  );

  const [prefetchedSchedules, prefetchedScheduleExecutions] = await Promise.all(
    [
      ctx.store.find(DcaSchedule, {
        where: { id: In(scheduleIds) },
        relations: {
          owner: true,
          executions: true,
        },
      }),
      ctx.store.find(DcaScheduleExecution, {
        where: { id: In(scheduleExecutions) },
        relations: {
          schedule: {
            owner: true,
          },
          events: {
            scheduleExecution: true,
            swaps: true,
            event: true,
          },
        },
      }),
    ]
  );

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
