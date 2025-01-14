import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  ChainActivityTraceRelation,
  DcaScheduleExecution,
  DcaScheduleExecutionAction,
  DcaScheduleExecutionStatus,
  DispatchError,
  Swap,
  SwappedExecutionTypeKind,
} from '../../model';
import { FindOptionsRelations } from 'typeorm';
import { getDcaSchedule } from './dcaSchedule';
import { ChainActivityTraceManager } from '../../chainActivityTraceManager';

export async function getDcaScheduleExecutionAction({
  ctx,
  id,
  executionId,
  relations = {
    scheduleExecution: true,
    swaps: true,
  },
  fetchFromDb = false,
}: {
  ctx: ProcessorContext<Store>;
  id?: string;
  executionId?: string;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<DcaScheduleExecutionAction>;
}) {
  if (!id && !executionId) return null;
  const batchState = ctx.batchState.state;

  let executionAction = null;
  if (id) {
    executionAction = batchState.dcaScheduleExecutionActions.get(id);
  } else if (executionId) {
    executionAction = [...batchState.dcaScheduleExecutionActions.values()].find(
      (action) => action.scheduleExecution.id === executionId
    );
  }

  if (executionAction || (!executionAction && !fetchFromDb))
    return executionAction ?? null;

  executionAction = await ctx.store.findOne(DcaScheduleExecutionAction, {
    where: {
      ...(id ? { id } : {}),
      ...(executionId ? { scheduleExecution: { id: executionId } } : {}),
    },
    relations,
  });

  if (!executionAction) return null;

  ctx.batchState.state.dcaScheduleExecutionActions.set(
    executionAction.id,
    executionAction
  );

  return executionAction;
}

export async function processDcaScheduleExecutionAction({
  ctx,
  id,
  status,
  statusMemo,
  scheduleExecution,
  traceIds,
  operationIds,
  relayChainBlockHeight,
  paraChainBlockHeight,
}: {
  ctx: ProcessorContext<Store>;
  scheduleExecution: DcaScheduleExecution;
  who: string;
  id: string;
  status: DcaScheduleExecutionStatus;
  statusMemo?: DispatchError | null;
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
  traceIds: string[];
  operationIds?: string[];
}) {
  let executionAction = await getDcaScheduleExecutionAction({
    ctx,
    id,
    fetchFromDb: false,
  });

  if (executionAction) return executionAction;

  executionAction = new DcaScheduleExecutionAction({
    id,
    scheduleExecution,
    status,
    relayChainBlockHeight,
    paraChainBlockHeight,
    traceIds,
    operationIds: operationIds ?? null,
    statusMemo: statusMemo ?? null,
  });

  if (status === DcaScheduleExecutionStatus.EXECUTED) {
    const relatedSwaps = [...ctx.batchState.state.swaps.values()].filter(
      (swap) =>
        swap.paraChainBlockHeight === paraChainBlockHeight &&
        !!swap.operationId &&
        swap.operationId.length > 0 &&
        swap.operationId.includes(
          `${SwappedExecutionTypeKind.DCA}:${scheduleExecution.schedule.id}`
        )
    );

    if (relatedSwaps && relatedSwaps.length > 0) {
      for (const relatedSwap of relatedSwaps) {
        await processChainActivityTracesOnDcaExecutionAction({
          executionAction,
          swap: relatedSwap,
          scheduleId: scheduleExecution.id.split('-')[0],
          ctx,
        });

        executionAction.swaps = [...(executionAction.swaps || []), relatedSwap];
        executionAction.operationIds = [
          ...new Set([
            ...(executionAction.operationIds || []),
            relatedSwap.operationId,
          ]).values(),
        ];
        relatedSwap.dcaScheduleExecutionAction = executionAction;
        ctx.batchState.state.swaps.set(relatedSwap.id, relatedSwap);
      }
    }
  }

  ctx.batchState.state.dcaScheduleExecutionActions.set(
    executionAction.id,
    executionAction
  );

  return executionAction;
}

async function processChainActivityTracesOnDcaExecutionAction({
  swap,
  scheduleId,
  ctx,
}: {
  executionAction: DcaScheduleExecutionAction;
  swap: Swap;
  scheduleId: string;
  ctx: ProcessorContext<Store>;
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
    id: `${swapChainActivityTrace.id}-${rootChainActivityTrace.id}`,
    childTrace: swapChainActivityTrace,
    parentTrace: rootChainActivityTrace,
    createdAtParaChainBlockHeight: swap.paraChainBlockHeight,
  });

  ctx.batchState.state.chainActivityTraceRelations.set(
    newChainActivityTraceRelation.id,
    newChainActivityTraceRelation
  );
}
