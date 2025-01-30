import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  ChainActivityTraceRelation,
  DcaScheduleExecution,
  DcaScheduleExecutionEvent,
  DcaScheduleExecutionStatus,
  DispatchError,
  Swap,
} from '../../model';
import { FindOptionsRelations } from 'typeorm';
import { getDcaSchedule } from './dcaSchedule';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { SwappedExecutionTypeKind } from '../../utils/types';

export async function getDcaScheduleExecutionEvent({
  ctx,
  id,
  executionId,
  relations = {
    scheduleExecution: true,
    swaps: true,
  },
  fetchFromDb = false,
}: {
  ctx: SqdProcessorContext<Store>;
  id?: string;
  executionId?: string;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<DcaScheduleExecutionEvent>;
}) {
  if (!id && !executionId) return null;
  const batchState = ctx.batchState.state;

  let executionAction = null;
  if (id) {
    executionAction = batchState.dcaScheduleExecutionEvents.get(id);
  } else if (executionId) {
    executionAction = [...batchState.dcaScheduleExecutionEvents.values()].find(
      (action) => action.scheduleExecution.id === executionId
    );
  }

  if (executionAction || (!executionAction && !fetchFromDb))
    return executionAction ?? null;

  executionAction = await ctx.store.findOne(DcaScheduleExecutionEvent, {
    where: {
      ...(id ? { id } : {}),
      ...(executionId ? { scheduleExecution: { id: executionId } } : {}),
    },
    relations,
  });

  if (!executionAction) return null;

  ctx.batchState.state.dcaScheduleExecutionEvents.set(
    executionAction.id,
    executionAction
  );

  return executionAction;
}

export async function processDcaScheduleExecutionEvent({
  ctx,
  id,
  eventId,
  eventName,
  errorState,
  scheduleExecution,
  traceIds,
  operationIds,
  relayBlockHeight,
  paraBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  scheduleExecution: DcaScheduleExecution;
  who: string;
  id: string;
  eventId: string;
  eventName: DcaScheduleExecutionStatus;
  errorState?: DispatchError | null;
  relayBlockHeight: number;
  paraBlockHeight: number;
  traceIds: string[];
  operationIds?: string[];
}) {
  let executionEvent = await getDcaScheduleExecutionEvent({
    ctx,
    id,
    fetchFromDb: false,
  });

  if (executionEvent) return executionEvent;

  executionEvent = new DcaScheduleExecutionEvent({
    id,
    traceIds,
    scheduleExecution,
    eventName,
    operationIds: operationIds ?? null,
    errorState: errorState ?? null,
    relayBlockHeight,
    paraBlockHeight,
    event: ctx.batchState.state.batchEvents.get(eventId),
  });

  if (eventName === DcaScheduleExecutionStatus.Executed) {
    const dcaSchedule = await getDcaSchedule({
      ctx,
      id: scheduleExecution.id.split('-')[0],
      fetchFromDb: true,
    });

    if (dcaSchedule) {
      dcaSchedule.totalExecutedAmountIn =
        (dcaSchedule.totalExecutedAmountIn || 0n) +
        (scheduleExecution.amountIn || 0n);

      dcaSchedule.totalExecutedAmountOut =
        (dcaSchedule.totalExecutedAmountOut || 0n) +
        (scheduleExecution.amountOut || 0n);

      ctx.batchState.state.dcaSchedules.set(dcaSchedule.id, dcaSchedule);
    }

    const relatedSwaps = [...ctx.batchState.state.swaps.values()].filter(
      (swap) =>
        swap.paraBlockHeight === paraBlockHeight &&
        !!swap.operationId &&
        swap.operationId.length > 0 &&
        swap.operationId.includes(
          `${SwappedExecutionTypeKind.DCA}:${scheduleExecution.schedule.id}`
        )
    );

    if (relatedSwaps && relatedSwaps.length > 0) {
      for (const relatedSwap of relatedSwaps) {
        await processChainActivityTracesOnDcaExecutionEvent({
          executionEvent,
          swap: relatedSwap,
          scheduleId: scheduleExecution.id.split('-')[0],
          ctx,
        });

        executionEvent.swaps = [...(executionEvent.swaps || []), relatedSwap];
        executionEvent.operationIds = [
          ...new Set([
            ...(executionEvent.operationIds || []),
            relatedSwap.operationId,
          ]).values(),
        ];
        relatedSwap.dcaScheduleExecutionEvent = executionEvent;
        ctx.batchState.state.swaps.set(relatedSwap.id, relatedSwap);
      }
    }
  }

  ctx.batchState.state.dcaScheduleExecutionEvents.set(
    executionEvent.id,
    executionEvent
  );

  return executionEvent;
}

async function processChainActivityTracesOnDcaExecutionEvent({
  swap,
  scheduleId,
  ctx,
}: {
  executionEvent: DcaScheduleExecutionEvent;
  swap: Swap;
  scheduleId: string;
  ctx: SqdProcessorContext<Store>;
}) {
  const dcaSchedule = await getDcaSchedule({
    ctx,
    id: scheduleId,
    fetchFromDb: true,
  });

  if (
    !dcaSchedule ||
    !dcaSchedule.traceIds ||
    dcaSchedule.traceIds.length === 0
  )
    return;

  const swapChainActivityTrace =
    await ChainActivityTraceManager.getChainActivityTraceByTraceIdsBatch({
      ids: swap.traceIds ?? [],
      ctx,
    });

  const rootChainActivityTrace =
    await ChainActivityTraceManager.getChainActivityTraceByTraceIdsBatch({
      ids: dcaSchedule.traceIds,
      ctx,
    });

  if (
    !swapChainActivityTrace ||
    !rootChainActivityTrace ||
    (rootChainActivityTrace &&
      rootChainActivityTrace.id === swapChainActivityTrace.id)
  )
    return;

  const newChainActivityTraceRelation = new ChainActivityTraceRelation({
    id: `${rootChainActivityTrace.id}-${swapChainActivityTrace.id}`,
    childTrace: swapChainActivityTrace,
    parentTrace: rootChainActivityTrace,
    paraBlockHeight: swap.paraBlockHeight,
    relayBlockHeight: swap.relayBlockHeight,
    block: swap.event.block,
  });

  ctx.batchState.state.chainActivityTraceRelations.set(
    newChainActivityTraceRelation.id,
    newChainActivityTraceRelation
  );
}
