import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getAsset } from '../assets/assetRegistry';
import {
  DcaSchedule,
  DcaScheduleEventName,
  DcaScheduleOrderRouteHop,
  DcaScheduleStatus,
  DispatchError,
} from '../../model';
import { getAccount } from '../accounts';
import {
  DcaCompletedData,
  DcaScheduledData,
  DcaTerminatedData,
} from '../../parsers/batchBlocksParser/types';
import { DcaScheduledEventParams } from '../../parsers/types/events';
import { DcaScheduleCallArgs } from '../../parsers/types/calls';
import { FindOptionsRelations } from 'typeorm';
import parsers from '../../parsers';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { processDcaScheduleEvent } from './dcaScheduleEvents';

export async function createDcaSchedule({
  ctx,
  blockHeader,
  eventId,
  traceIds,
  scheduleData: { id, startExecutionBlock, scheduleData },
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  eventId: string;
  traceIds?: string[];
  scheduleData: DcaScheduledEventParams & DcaScheduleCallArgs;
}) {
  const {
    owner,
    period,
    totalAmount,
    slippage,
    maxRetries,
    stabilityThreshold,
    order,
  } = scheduleData;
  const assetIn = await getAsset({
    ctx,
    id: order.assetInId,
    ensure: true,
    blockHeader: blockHeader,
  });
  const assetOut = await getAsset({
    ctx,
    id: order.assetOutId,
    ensure: true,
    blockHeader: blockHeader,
  });

  if (!assetIn || !assetOut)
    throw Error(
      `Asset ${!assetIn ? order.assetInId : order.assetOutId} has not been found and created.`
    );

  const newSchedule = new DcaSchedule({
    id: id.toString(),
    startExecutionBlock: startExecutionBlock ?? null,
    owner: await getAccount({ ctx, id: owner }),
    period: period ?? null,
    totalAmount: totalAmount ?? null,
    slippage: slippage ?? null,
    maxRetries: maxRetries ?? null,
    stabilityThreshold: stabilityThreshold ?? null,
    assetIn,
    assetOut,
    amountIn: order.amountIn ?? null,
    amountOut: order.amountOut ?? null,
    maxAmountIn: order.maxAmountIn ?? null,
    minAmountOut: order.minAmountOut ?? null,
    orderType: order.kind,
    status: DcaScheduleStatus.Open,
    paraChainBlockHeight: blockHeader.height,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    event: ctx.batchState.state.batchEvents.get(eventId),
    traceIds: traceIds ?? [],
  });

  const orderRouteHops: DcaScheduleOrderRouteHop[] = [];

  for (const orderRoute of order.routes) {
    const routeAssetIn = await getAsset({
      ctx,
      id: orderRoute.assetInId,
      ensure: true,
      blockHeader: blockHeader,
    });
    const routeAssetOut = await getAsset({
      ctx,
      id: orderRoute.assetOutId,
      ensure: true,
      blockHeader: blockHeader,
    });
    if (!assetIn || !assetOut)
      throw Error(
        `Asset ${!assetIn ? order.assetInId : order.assetOutId} has not been found and created.`
      );

    orderRouteHops.push(
      new DcaScheduleOrderRouteHop({
        id: `${newSchedule.id}-${orderRoute.assetInId}-${orderRoute.assetOutId}`,
        schedule: newSchedule,
        poolKind: orderRoute.poolKind,
        assetIn: routeAssetIn,
        assetOut: routeAssetOut,
      })
    );
  }
  newSchedule.orderRouteHops = orderRouteHops;

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newSchedule.traceIds,
    participants: [newSchedule.owner],
    ctx,
  });

  return newSchedule;
}

export async function getDcaSchedule({
  ctx,
  id,
  relations = {
    owner: true,
  },
  fetchFromDb = false,
}: {
  ctx: SqdProcessorContext<Store>;
  id: string;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<DcaSchedule>;
}) {
  const batchState = ctx.batchState.state;

  let schedule = batchState.dcaSchedules.get(id);
  if (schedule || (!schedule && !fetchFromDb)) return schedule ?? null;

  schedule = await ctx.store.findOne(DcaSchedule, {
    where: { id },
    relations,
  });

  if (!schedule) return null;
  ctx.batchState.state.dcaSchedules.set(schedule.id, schedule);
  return schedule;
}

export async function handleDcaScheduleCreated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: DcaScheduledData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { args, traceId: callTraceId },
  } = eventCallData;

  const callArgs = args ?? {
    scheduleData: await parsers.storage.dca.getDcaSchedule({
      scheduleId: eventParams.id,
      block: eventMetadata.blockHeader,
    }),
  };

  if (!callArgs) return;

  const newSchedule = await createDcaSchedule({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    eventId: eventMetadata.id,
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    scheduleData: {
      ...eventParams,
      ...(callArgs as DcaScheduleCallArgs),
    },
  });

  if (!newSchedule) return;

  const scheduleEvent = await processDcaScheduleEvent({
    ctx,
    schedule: newSchedule,
    eventId: eventMetadata.id,
    eventName: DcaScheduleEventName.Created,
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    blockHeader: eventMetadata.blockHeader,
  });

  newSchedule.owner.dcaSchedules = [
    ...(newSchedule.owner.dcaSchedules || []),
    newSchedule,
  ];

  newSchedule.events = [...(newSchedule.events || []), scheduleEvent];

  const state = ctx.batchState.state;

  state.accounts.set(newSchedule.owner.id, newSchedule.owner);
  state.dcaSchedules.set(newSchedule.id, newSchedule);

  for (const orderRoute of newSchedule.orderRouteHops)
    state.dcaScheduleOrderRoutes.set(orderRoute.id, orderRoute);
}

export async function handleDcaScheduleCompleted(
  ctx: SqdProcessorContext<Store>,
  eventCallData: DcaCompletedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  const scheduleEntity = await getDcaSchedule({
    ctx,
    id: eventParams.id.toString(),
  });

  if (!scheduleEntity) return;

  scheduleEntity.status = DcaScheduleStatus.Completed;

  const scheduleEvent = await processDcaScheduleEvent({
    ctx,
    schedule: scheduleEntity,
    eventId: eventMetadata.id,
    eventName: DcaScheduleEventName.Completed,
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    blockHeader: eventMetadata.blockHeader,
  });

  scheduleEntity.events = [...(scheduleEntity.events || []), scheduleEvent];

  const state = ctx.batchState.state;

  state.dcaSchedules.set(scheduleEntity.id, scheduleEntity);
}

export async function handleDcaScheduleTerminated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: DcaTerminatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { traceId: callTraceId },
  } = eventCallData;

  const scheduleEntity = await getDcaSchedule({
    ctx,
    id: eventParams.id.toString(),
  });

  if (!scheduleEntity) return;

  scheduleEntity.status = DcaScheduleStatus.Terminated;

  const scheduleEvent = await processDcaScheduleEvent({
    ctx,
    schedule: scheduleEntity,
    eventId: eventMetadata.id,
    eventName: DcaScheduleEventName.Terminated,
    memo: eventParams.error
      ? new DispatchError({
          kind: eventParams.error.__kind,
          index: eventParams.error.value?.index,
          error: eventParams.error.value?.error,
        })
      : null,
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    blockHeader: eventMetadata.blockHeader,
  });

  scheduleEntity.events = [...(scheduleEntity.events || []), scheduleEvent];

  const state = ctx.batchState.state;

  state.dcaSchedules.set(scheduleEntity.id, scheduleEntity);
}
