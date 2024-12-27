import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getAsset } from '../assets/assetRegistry';
import {
  DcaSchedule,
  DcaScheduleOrderRoute,
  DcaScheduleStatus,
  DispatchError,
  DispatchErrorValue,
} from '../../model';
import { getAccount } from '../accounts';
import {
  DcaCompletedData,
  DcaScheduledData,
  DcaTerminatedData,
} from '../../parsers/batchBlocksParser/types';
import { DcaScheduledEventParams } from '../../parsers/types/events';
import {
  DcaScheduleCallArgs,
  DcaScheduleCallData,
} from '../../parsers/types/calls';
import { FindOptionsRelations } from 'typeorm';
import parsers from '../../parsers';

export async function createDcaSchedule({
  ctx,
  blockHeader,
  scheduleData: { id, startExecutionBlock, scheduleData },
}: {
  ctx: ProcessorContext<Store>;
  blockHeader: Block;
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
    owner: await getAccount(ctx, owner),
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
    orderKind: order.kind,
    status: DcaScheduleStatus.OPEN,
    paraChainBlockHeight: blockHeader.height,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
  });

  const orderRoutes: DcaScheduleOrderRoute[] = [];

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

    orderRoutes.push(
      new DcaScheduleOrderRoute({
        id: `${newSchedule.id}-${orderRoute.assetInId}-${orderRoute.assetOutId}`,
        schedule: newSchedule,
        poolKind: orderRoute.poolKind,
        assetIn: routeAssetIn,
        assetOut: routeAssetOut,
      })
    );
  }
  newSchedule.orderRoutes = orderRoutes;

  return newSchedule;
}

export async function getDcaSchedule({
  ctx,
  id,
  relations = {
    owner: true,
  },
}: {
  ctx: ProcessorContext<Store>;
  id: string;
  relations?: FindOptionsRelations<DcaSchedule>;
}) {
  const batchState = ctx.batchState.state;

  let schedule = batchState.dcaSchedules.get(id);
  if (!schedule)
    schedule = await ctx.store.findOne(DcaSchedule, {
      where: { id },
      relations,
    });

  return schedule ?? null;
}

export async function handleDcaScheduleCreated(
  ctx: ProcessorContext<Store>,
  eventCallData: DcaScheduledData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData: { args },
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
    scheduleData: {
      ...eventParams,
      ...(callArgs as DcaScheduleCallArgs),
    },
  });

  if (!newSchedule) return;

  newSchedule.owner.dcaSchedules = [
    ...(newSchedule.owner.dcaSchedules || []),
    newSchedule,
  ];

  const state = ctx.batchState.state;

  state.accounts.set(newSchedule.owner.id, newSchedule.owner);
  state.dcaSchedules.set(newSchedule.id, newSchedule);

  for (const orderRoute of newSchedule.orderRoutes)
    state.dcaScheduleOrderRoutes.set(orderRoute.id, orderRoute);

  ctx.batchState.state = {
    accounts: state.accounts,
    dcaSchedules: state.dcaSchedules,
    dcaScheduleOrderRoutes: state.dcaScheduleOrderRoutes,
  };
}

export async function handleDcaScheduleCompleted(
  ctx: ProcessorContext<Store>,
  eventCallData: DcaCompletedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const scheduleEntity = await getDcaSchedule({
    ctx,
    id: eventParams.id.toString(),
  });

  if (!scheduleEntity) return;

  scheduleEntity.status = DcaScheduleStatus.COMPLETED;
  scheduleEntity.statusUpdatedAtBlockHeight = eventMetadata.blockHeader.height;

  const state = ctx.batchState.state;

  state.dcaSchedules.set(scheduleEntity.id, scheduleEntity);

  ctx.batchState.state = {
    dcaSchedules: state.dcaSchedules,
  };
}

export async function handleDcaScheduleTerminated(
  ctx: ProcessorContext<Store>,
  eventCallData: DcaTerminatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const scheduleEntity = await getDcaSchedule({
    ctx,
    id: eventParams.id.toString(),
  });

  if (!scheduleEntity) return;

  scheduleEntity.status = DcaScheduleStatus.TERMINATED;
  scheduleEntity.statusUpdatedAtBlockHeight = eventMetadata.blockHeader.height;
  scheduleEntity.statusMemo = eventParams.error
    ? new DispatchError({
        kind: eventParams.error.__kind,
        value: eventParams.error.value
          ? new DispatchErrorValue({
              index: eventParams.error.value?.index,
              error: eventParams.error.value?.error,
            })
          : null,
      })
    : null;

  const state = ctx.batchState.state;

  state.dcaSchedules.set(scheduleEntity.id, scheduleEntity);

  ctx.batchState.state = {
    dcaSchedules: state.dcaSchedules,
  };
}