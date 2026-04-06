import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import {
  DcaScheduleExecution,
  DcaScheduleExecutionStatus,
  DispatchError,
} from '../../model';
import {
  DcaExecutionPlannedData,
  DcaTradeExecutedData,
  DcaTradeFailedData,
} from '../../parsers/batchBlocksParser/types';
import { SqdProcessorContext } from '../../processor';
import { getOrCreateAccount } from '../accounts';
import { getDcaSchedule } from './dcaSchedule';
import { processDcaScheduleExecutionEvent } from './dcaScheduleExecutionEvents';

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

  execution = await ctx.storeUtils.findOneWithLogs(
    DcaScheduleExecution,
    {
      where: { id },
      relations,
    },
    { className: 'DcaScheduleExecution' }
  );

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
    // relations: {
    //   executions: true,
    // },
  });

  if (!scheduleEntity) {
    return;
  }

  const executionId = `${eventParams.id}-${eventParams.blockNumber}`;

  let plannedExecution = await getDcaScheduleExecution({
    ctx,
    id: executionId,
    relations: {},
  });

  if (!plannedExecution) {
    plannedExecution = new DcaScheduleExecution({
      id: executionId,
      schedule: scheduleEntity,
      status: DcaScheduleExecutionStatus.Planned,
    });
  }

  const executionAction = await processDcaScheduleExecutionEvent({
    ctx,
    who: eventParams.who,
    id: `${plannedExecution.id}-${DcaScheduleExecutionStatus.Planned}`,
    eventId: eventMetadata.id,
    scheduleExecution: plannedExecution,
    eventName: DcaScheduleExecutionStatus.Planned,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
  });

  // plannedExecution.events = [
  //   ...(plannedExecution.events || []),
  //   executionAction,
  // ];

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
      schedule: true,
      // events: true,
    },
  });

  if (!scheduleExecutionEntity) return;

  scheduleExecutionEntity.status = DcaScheduleExecutionStatus.Executed;
  scheduleExecutionEntity.amountIn = eventParams.amountIn;
  scheduleExecutionEntity.amountOut = eventParams.amountOut;

  const executionEvents = await processDcaScheduleExecutionEvent({
    ctx,
    who: eventParams.who,
    id: `${scheduleExecutionEntity.id}-${DcaScheduleExecutionStatus.Executed}`,
    eventId: eventMetadata.id,
    scheduleExecution: scheduleExecutionEntity,
    eventName: DcaScheduleExecutionStatus.Executed,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    traceIds,
  });

  // scheduleExecutionEntity.events = [
  //   ...(scheduleExecutionEntity.events || []),
  //   executionEvents,
  // ];

  const state = ctx.batchState.state;

  state.dcaScheduleExecutions.set(
    scheduleExecutionEntity.id,
    scheduleExecutionEntity
  );

  const ownerAccount = await getOrCreateAccount({
    ctx,
    id: scheduleExecutionEntity.schedule.ownerId,
  });

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [ownerAccount],
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
      schedule: true,
    },
  });

  if (!scheduleExecutionEntity) return;

  scheduleExecutionEntity.status = DcaScheduleExecutionStatus.Failed;

  const executionAction = await processDcaScheduleExecutionEvent({
    ctx,
    who: eventParams.who,
    id: `${scheduleExecutionEntity.id}-${DcaScheduleExecutionStatus.Failed}`,
    eventId: eventMetadata.id,
    scheduleExecution: scheduleExecutionEntity,
    eventName: DcaScheduleExecutionStatus.Failed,
    errorState: eventParams.error
      ? new DispatchError({
          kind: eventParams.error.__kind,
          index: eventParams.error.value?.index,
          error: eventParams.error.value?.error,
        })
      : null,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    traceIds,
  });

  // scheduleExecutionEntity.events = [
  //   ...(scheduleExecutionEntity.events || []),
  //   executionAction,
  // ];

  const state = ctx.batchState.state;

  state.dcaScheduleExecutions.set(
    scheduleExecutionEntity.id,
    scheduleExecutionEntity
  );

  const ownerAccount = await getOrCreateAccount({
    ctx,
    id: scheduleExecutionEntity.schedule.ownerId,
  });

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [ownerAccount],
    traceIds,
    ctx,
  });
}
