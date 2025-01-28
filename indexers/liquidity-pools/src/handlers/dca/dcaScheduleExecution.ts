import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  DcaExecutionPlannedData,
  DcaTradeExecutedData,
  DcaTradeFailedData,
} from '../../parsers/batchBlocksParser/types';
import {
  DcaScheduleExecution,
  DcaScheduleExecutionEvent,
  DcaScheduleExecutionEventName,
  DcaScheduleExecutionStatus,
  DispatchError,
} from '../../model';
import { getDcaSchedule } from './dcaSchedule';
import { FindOptionsRelations } from 'typeorm';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { processDcaScheduleExecutionEvent } from './dcaScheduleExecutionAction';

export async function getDcaScheduleExecution({
  ctx,
  id,
  relations = {
    events: true,
  },
  fetchFromDb = false,
}: {
  ctx: SqdProcessorContext<Store>;
  id: string;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<DcaScheduleExecution>;
}) {
  let execution = ctx.batchState.state.dcaScheduleExecutions.get(id);

  if (execution || (!execution && !fetchFromDb)) return execution ?? null;

  execution = await ctx.store.findOne(DcaScheduleExecution, {
    where: { id },
    relations,
  });

  if (!execution) return null;

  ctx.batchState.state.dcaScheduleExecutions.set(execution.id, execution);

  return execution;
}

export async function handleDcaScheduleExecutionPlanned(
  ctx: SqdProcessorContext<Store>,
  eventCallData: DcaExecutionPlannedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const scheduleEntity = await getDcaSchedule({
    ctx,
    id: eventParams.id.toString(),
    relations: {
      owner: true,
      executions: true,
    },
  });

  if (!scheduleEntity) return;

  const executionId = `${eventParams.id}-${eventParams.blockNumber}`;

  let plannedExecution = await getDcaScheduleExecution({
    ctx,
    id: executionId,
  });

  if (plannedExecution) return;

  plannedExecution = new DcaScheduleExecution({
    id: executionId,
    schedule: scheduleEntity,
    status: DcaScheduleExecutionStatus.Planned,
  });

  const executionAction = await processDcaScheduleExecutionEvent({
    ctx,
    who: eventParams.who,
    id: `${plannedExecution.id}-${DcaScheduleExecutionEventName.Planned}`,
    scheduleExecution: plannedExecution,
    eventName: DcaScheduleExecutionEventName.Planned,
    relayChainBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
  });

  plannedExecution.events = [
    ...(plannedExecution.events || []),
    executionAction,
  ];

  ctx.batchState.state.dcaScheduleExecutions.set(
    plannedExecution.id,
    plannedExecution
  );
}

export async function handleDcaTradeExecuted(
  ctx: SqdProcessorContext<Store>,
  eventCallData: DcaTradeExecutedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const traceIds = [
    ...(callData.traceId ? [callData.traceId] : []),
    eventMetadata.traceId,
  ];

  const scheduleExecutionEntity = await getDcaScheduleExecution({
    ctx,
    id: `${eventParams.id}-${eventMetadata.blockHeader.height}`,
    relations: {
      schedule: {
        owner: true,
      },
      events: true,
    },
  });

  if (!scheduleExecutionEntity) return;

  scheduleExecutionEntity.status = DcaScheduleExecutionStatus.Executed;
  scheduleExecutionEntity.amountIn = eventParams.amountIn;
  scheduleExecutionEntity.amountOut = eventParams.amountOut;

  const executionEvents = await processDcaScheduleExecutionEvent({
    ctx,
    who: eventParams.who,
    id: `${scheduleExecutionEntity.id}-${DcaScheduleExecutionEventName.Executed}`,
    scheduleExecution: scheduleExecutionEntity,
    eventName: DcaScheduleExecutionEventName.Executed,
    relayChainBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    traceIds,
  });

  scheduleExecutionEntity.events = [
    ...(scheduleExecutionEntity.events || []),
    executionEvents,
  ];

  const state = ctx.batchState.state;

  state.dcaScheduleExecutions.set(
    scheduleExecutionEntity.id,
    scheduleExecutionEntity
  );

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [scheduleExecutionEntity.schedule.owner],
    traceIds,
    ctx,
  });
}

export async function handleDcaTradeFailed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: DcaTradeFailedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const traceIds = [
    ...(callData.traceId ? [callData.traceId] : []),
    eventMetadata.traceId,
  ];

  const scheduleExecutionEntity = await getDcaScheduleExecution({
    ctx,
    id: `${eventParams.id}-${eventMetadata.blockHeader.height}`,
    relations: {
      schedule: { owner: true },
    },
  });

  if (!scheduleExecutionEntity) return;

  scheduleExecutionEntity.status = DcaScheduleExecutionStatus.Failed;

  const executionAction = await processDcaScheduleExecutionEvent({
    ctx,
    who: eventParams.who,
    id: `${scheduleExecutionEntity.id}-${DcaScheduleExecutionEventName.Failed}`,
    scheduleExecution: scheduleExecutionEntity,
    eventName: DcaScheduleExecutionEventName.Failed,
    memo: eventParams.error
      ? new DispatchError({
          kind: eventParams.error.__kind,
          index: eventParams.error.value?.index,
          error: eventParams.error.value?.error,
        })
      : null,
    relayChainBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    traceIds,
  });

  scheduleExecutionEntity.events = [
    ...(scheduleExecutionEntity.events || []),
    executionAction,
  ];

  const state = ctx.batchState.state;

  state.dcaScheduleExecutions.set(
    scheduleExecutionEntity.id,
    scheduleExecutionEntity
  );

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [scheduleExecutionEntity.schedule.owner],
    traceIds,
    ctx,
  });
}
