import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import {
  DcaSchedule,
  DcaScheduleOrderRouteHop,
  DcaScheduleStatus,
  DispatchError,
} from '../../model';
import parsers from '../../parsers';
import {
  DcaCompletedData,
  DcaScheduledData,
  DcaTerminatedData,
} from '../../parsers/batchBlocksParser/types';
import { DcaScheduleCallArgs } from '../../parsers/types/calls';
import { DcaScheduledEventParams } from '../../parsers/types/events';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { getOrCreateAccount } from '../accounts';
import { getOrCreateAsset } from '../assets/asset';
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
  const assetIn = await getOrCreateAsset({
    ctx,
    assetRegistryId: order.assetInId,
    ensure: true,
    blockHeader: blockHeader,
  });
  const assetOut = await getOrCreateAsset({
    ctx,
    assetRegistryId: order.assetOutId,
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
    ownerId: owner.toString(),
    period: period ? BigInt(period) : null,
    totalAmount: totalAmount ?? null,
    slippage: slippage ?? null,
    maxRetries: maxRetries ?? null,
    stabilityThreshold: stabilityThreshold ?? null,
    assetInId: assetIn.id,
    assetOutId: assetOut.id,
    amountIn: order.amountIn ?? null,
    amountOut: order.amountOut ?? null,
    maxAmountIn: order.maxAmountIn ?? null,
    minAmountOut: order.minAmountOut ?? null,
    orderType: order.kind,
    status: DcaScheduleStatus.Created,
    paraBlockHeight: blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventId),
    traceIds: traceIds ?? [],
  });

  const orderRouteHops: DcaScheduleOrderRouteHop[] = [];

  for (const orderRoute of order.routes) {
    const routeAssetIn = await getOrCreateAsset({
      ctx,
      assetRegistryId: orderRoute.assetInId,
      ensure: true,
      blockHeader: blockHeader,
    });
    const routeAssetOut = await getOrCreateAsset({
      ctx,
      assetRegistryId: orderRoute.assetOutId,
      ensure: true,
      blockHeader: blockHeader,
    });
    if (!routeAssetIn || !routeAssetOut)
      throw Error(
        `Asset ${!assetIn ? order.assetInId : order.assetOutId} has not been found and created.`
      );

    orderRouteHops.push(
      new DcaScheduleOrderRouteHop({
        id: `${newSchedule.id}-${routeAssetIn.id}-${routeAssetOut.id}`,
        schedule: newSchedule,
        poolKind: orderRoute.poolKind,
        assetInId: routeAssetIn.id,
        assetOutId: routeAssetOut.id,
      })
    );
  }
  newSchedule.orderRouteHops = orderRouteHops;

  const ownerAccount = await getOrCreateAccount({
    ctx,
    id: newSchedule.ownerId,
  });

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    traceIds: newSchedule.traceIds,
    participants: [ownerAccount],
    ctx,
  });

  return newSchedule;
}

export async function getDcaSchedule({
  ctx,
  id,
  relations = {},
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

  schedule = await ctx.storeUtils.findOneWithLogs(
    DcaSchedule,
    {
      where: { id },
      relations,
    },
    { className: 'DcaSchedule', originCallFn: 'getDcaSchedule' }
  );

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

  const scheduleId = eventParams.id.toString();

  const existingSchedule = ctx.batchState.state.dcaSchedules.get(scheduleId);

  if (existingSchedule) {
    const scheduleEvent = await processDcaScheduleEvent({
      ctx,
      schedule: existingSchedule,
      eventId: eventMetadata.id,
      eventName: DcaScheduleStatus.Created,
      traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
      blockHeader: eventMetadata.blockHeader,
    });

    // existingSchedule.events = [
    //   ...(existingSchedule.events || []),
    //   scheduleEvent,
    // ];

    const state = ctx.batchState.state;

    state.dcaSchedules.set(existingSchedule.id, existingSchedule);
    return;
  }

  // TODO get more params from event for older spec versions
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
    eventName: DcaScheduleStatus.Created,
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    blockHeader: eventMetadata.blockHeader,
  });

  // const ownerAccount = await getOrCreateAccount({
  //   ctx,
  //   id: newSchedule.ownerId,
  // });

  // newSchedule.events = [...(newSchedule.events || []), scheduleEvent];

  const state = ctx.batchState.state;

  // state.accounts.set(ownerAccount.id, ownerAccount);
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
    eventName: DcaScheduleStatus.Completed,
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    blockHeader: eventMetadata.blockHeader,
  });

  // scheduleEntity.events = [...(scheduleEntity.events || []), scheduleEvent];

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
    eventName: DcaScheduleStatus.Terminated,
    errorState: eventParams.error
      ? new DispatchError({
          kind: eventParams.error.__kind,
          index: eventParams.error.value?.index,
          error: eventParams.error.value?.error,
        })
      : null,
    traceIds: [...(callTraceId ? [callTraceId] : []), eventMetadata.traceId],
    blockHeader: eventMetadata.blockHeader,
  });

  // scheduleEntity.events = [...(scheduleEntity.events || []), scheduleEvent];

  const state = ctx.batchState.state;

  state.dcaSchedules.set(scheduleEntity.id, scheduleEntity);
}
