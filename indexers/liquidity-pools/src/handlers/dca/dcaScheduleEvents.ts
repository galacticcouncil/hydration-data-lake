import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  ChainActivityTraceRelation,
  DcaSchedule,
  DcaScheduleEvent,
  DcaScheduleEventName,
  DcaScheduleExecution,
  DcaScheduleExecutionEvent,
  DcaScheduleExecutionEventName,
  DispatchError,
  Swap,
} from '../../model';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { getDcaSchedule } from './dcaSchedule';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { SwappedExecutionTypeKind } from '../../utils/types';
import { Entity } from '@subsquid/typeorm-store/src/store';
import { BlockHeader } from '@subsquid/substrate-processor';

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

  executionEvent = await ctx.store.findOne(DcaScheduleEvent, {
    where: {
      ...(id ? { id } : {}),
      ...(scheduleId && scheduleEventName
        ? { schedule: { id: scheduleId }, eventName: scheduleEventName }
        : {}),
    } as FindOptionsWhere<DcaScheduleEvent>,
    relations,
  });

  if (!executionEvent) return null;

  ctx.batchState.state.dcaScheduleEvents.set(executionEvent.id, executionEvent);

  return executionEvent;
}

export async function processDcaScheduleEvent({
  ctx,
  eventId,
  eventName,
  memo,
  schedule,
  traceIds,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  traceIds: string[];
  schedule: DcaSchedule;
  eventId: string;
  eventName: DcaScheduleEventName;
  memo?: DispatchError | null;
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
    memo: memo ?? null,
    relayChainBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    paraChainBlockHeight: blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventId),
  });

  ctx.batchState.state.dcaScheduleEvents.set(executionEvent.id, executionEvent);

  return executionEvent;
}
