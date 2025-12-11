import {
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import {
  DcaSchedule,
  DcaScheduleEvent,
  DcaScheduleStatus,
  DispatchError,
} from '../../model';
import { SqdProcessorContext } from '../../processor';

export async function getDcaScheduleEvent({
  ctx,
  id,
  scheduleId,
  scheduleEventName,
  relations = {
    schedule: true,
    event: {
      block: true,
    },
  },
  fetchFromDb = false,
}: {
  ctx: SqdProcessorContext<Store>;
  id?: string;
  scheduleId?: string;
  scheduleEventName?: string;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<DcaScheduleEvent>;
}) {
  if (!id && !scheduleId) return null;
  const batchState = ctx.batchState.state;

  let executionEvent: DcaScheduleEvent | undefined;
  if (id) {
    executionEvent = batchState.dcaScheduleEvents.get(id);
  } else if (scheduleId && scheduleEventName) {
    executionEvent = [...batchState.dcaScheduleEvents.values()].find(
      (event) =>
        event.schedule.id === scheduleId && event.eventName == scheduleEventName
    );
  }

  if (executionEvent || (!executionEvent && !fetchFromDb))
    return executionEvent ?? null;

  executionEvent = await ctx.storeUtils.findOneWithLogs(
    DcaScheduleEvent,
    {
      where: {
        ...(id ? { id } : {}),
        ...(scheduleId && scheduleEventName
          ? { schedule: { id: scheduleId }, eventName: scheduleEventName }
          : {}),
      } as FindOptionsWhere<DcaScheduleEvent>,
      relations,
    },
    { className: 'DcaScheduleEvent', originCallFn: 'getDcaScheduleEvent' }
  );

  if (!executionEvent) return null;

  ctx.batchState.state.dcaScheduleEvents.set(executionEvent.id, executionEvent);

  return executionEvent;
}

export async function processDcaScheduleEvent({
  ctx,
  eventId,
  eventName,
  errorState,
  schedule,
  traceIds,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  traceIds: string[];
  schedule: DcaSchedule;
  eventId: string;
  eventName: DcaScheduleStatus;
  errorState?: DispatchError | null;
  blockHeader: BlockHeader;
}) {
  let executionEvent = await getDcaScheduleEvent({
    ctx,
    scheduleId: schedule.id,
    scheduleEventName: eventName,
    fetchFromDb: false,
  });

  if (executionEvent) return executionEvent;

  executionEvent = new DcaScheduleEvent({
    id: `${schedule.id}-${eventId}`,
    traceIds,
    schedule,
    eventName,
    errorState: errorState ?? null,
    paraBlockHeight: blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventId),
  });

  ctx.batchState.state.dcaScheduleEvents.set(executionEvent.id, executionEvent);

  return executionEvent;
}
