import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  DcaExecutionPlannedData,
  DcaTradeExecutedData,
  DcaTradeFailedData,
} from '../../parsers/batchBlocksParser/types';
import {
  DcaScheduleExecution,
  DcaScheduleExecutionStatus,
  DispatchError,
  DispatchErrorValue,
} from '../../model';
import { getDcaSchedule } from './dcaSchedule';
import { FindOptionsRelations } from 'typeorm';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { processDcaScheduleExecutionAction } from './dcaScheduleExecutionAction';

export async function getDcaScheduleExecution({
  ctx,
  id,
  relations = {
    actions: true,
  },
  fetchFromDb = false,
}: {
  ctx: ProcessorContext<Store>;
  id: string;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<DcaScheduleExecution>;
}) {
  const batchState = ctx.batchState.state;

  let execution = batchState.dcaScheduleExecutions.get(id);

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
  ctx: ProcessorContext<Store>,
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
    status: DcaScheduleExecutionStatus.PLANNED,
  });
  //
  // const executionAction = new DcaScheduleExecutionAction({
  //   id: `${plannedExecution.id}-${DcaScheduleExecutionStatus.PLANNED}`,
  //   scheduleExecution: plannedExecution,
  //   status: DcaScheduleExecutionStatus.PLANNED,
  //   relayChainBlockHeight:
  //     ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
  //       ?.relaychainBlockNumber ?? 0,
  //   paraChainBlockHeight: eventMetadata.blockHeader.height,
  //   traceIds: [
  //     ...(callData.traceId ? [callData.traceId] : []),
  //     eventMetadata.traceId,
  //   ],
  // });
  //
  // plannedExecution.actions = [
  //   ...(plannedExecution.actions || []),
  //   executionAction,
  // ];

  const executionAction = await processDcaScheduleExecutionAction({
    ctx,
    who: eventParams.who,
    id: `${plannedExecution.id}-${DcaScheduleExecutionStatus.PLANNED}`,
    scheduleExecution: plannedExecution,
    status: DcaScheduleExecutionStatus.PLANNED,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
  });

  plannedExecution.actions = [
    ...(plannedExecution.actions || []),
    executionAction,
  ];

  const state = ctx.batchState.state;

  state.dcaScheduleExecutions.set(plannedExecution.id, plannedExecution);
}

export async function handleDcaTradeExecuted(
  ctx: ProcessorContext<Store>,
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
      actions: true,
    },
  });

  if (!scheduleExecutionEntity) return;

  scheduleExecutionEntity.status = DcaScheduleExecutionStatus.EXECUTED;
  scheduleExecutionEntity.amountIn = eventParams.amountIn;
  scheduleExecutionEntity.amountOut = eventParams.amountOut;

  const executionAction = await processDcaScheduleExecutionAction({
    ctx,
    who: eventParams.who,
    id: `${scheduleExecutionEntity.id}-${DcaScheduleExecutionStatus.EXECUTED}`,
    scheduleExecution: scheduleExecutionEntity,
    status: DcaScheduleExecutionStatus.EXECUTED,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    traceIds,
  });

  scheduleExecutionEntity.actions = [
    ...(scheduleExecutionEntity.actions || []),
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

export async function handleDcaTradeFailed(
  ctx: ProcessorContext<Store>,
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

  scheduleExecutionEntity.status = DcaScheduleExecutionStatus.FAILED;

  // const executionAction = new DcaScheduleExecutionAction({
  //   id: `${scheduleExecutionEntity.id}-${DcaScheduleExecutionStatus.FAILED}`,
  //   scheduleExecution: scheduleExecutionEntity,
  //   status: DcaScheduleExecutionStatus.FAILED,
  //   statusMemo: eventParams.error
  //     ? new DispatchError({
  //         kind: eventParams.error.__kind,
  //         value: eventParams.error.value
  //           ? new DispatchErrorValue({
  //               index: eventParams.error.value?.index,
  //               error: eventParams.error.value?.error,
  //             })
  //           : null,
  //       })
  //     : null,
  //   relayChainBlockHeight:
  //     ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
  //       ?.relaychainBlockNumber ?? 0,
  //   paraChainBlockHeight: eventMetadata.blockHeader.height,
  //   traceIds,
  // });

  const executionAction = await processDcaScheduleExecutionAction({
    ctx,
    who: eventParams.who,
    id: `${scheduleExecutionEntity.id}-${DcaScheduleExecutionStatus.FAILED}`,
    scheduleExecution: scheduleExecutionEntity,
    status: DcaScheduleExecutionStatus.FAILED,
    statusMemo: eventParams.error
      ? new DispatchError({
          kind: eventParams.error.__kind,
          value: eventParams.error.value
            ? new DispatchErrorValue({
                index: eventParams.error.value?.index,
                error: eventParams.error.value?.error,
              })
            : null,
        })
      : null,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventMetadata.blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    paraChainBlockHeight: eventMetadata.blockHeader.height,
    traceIds,
  });

  scheduleExecutionEntity.actions = [
    ...(scheduleExecutionEntity.actions || []),
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
