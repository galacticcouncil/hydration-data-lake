import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import mmEventHandlers from './mmEventHandlers';
import { EvmEventName } from '../../model';

export async function handleEvm(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  for (const eventData of getOrderedListByBlockNumber([
    ...parsedEvents.getSectionByEventName(EventName.EVM_Log).values(),
  ])) {
    await handleEvmLog(ctx, eventData);
  }
}

export async function saveAllMoneyMarketEvents(
  ctx: SqdProcessorContext<Store>
) {
  // console.log(
  //   `ctx.batchState.state.moneyMarketEvents - ${ctx.batchState.state.moneyMarketEvents.size}`
  // );
  // console.log(
  //   `ctx.batchState.state.mmSupplies - ${ctx.batchState.state.mmSupplies.size}`
  // );
  // console.log(
  //   `ctx.batchState.state.mmWithdrawals - ${ctx.batchState.state.mmWithdrawals.size}`
  // );
  // console.log(
  //   `ctx.batchState.state.mmBorrows - ${ctx.batchState.state.mmBorrows.size}`
  // );
  // console.log(
  //   `ctx.batchState.state.mmRepays - ${ctx.batchState.state.mmRepays.size}`
  // );
  // console.log(
  //   `ctx.batchState.state.mmLiquidationCalls - ${ctx.batchState.state.mmLiquidationCalls.size}`
  // );
  // console.log(
  //   `ctx.batchState.state.mmUserEModeSetEvents - ${ctx.batchState.state.mmUserEModeSetEvents.size}`
  // );
  // console.log(
  //   `ctx.batchState.state.mmReserveUsedAsCollateralEnabledEvents - ${ctx.batchState.state.mmReserveUsedAsCollateralEnabledEvents.size}`
  // );
  // console.log(
  //   `ctx.batchState.state.mmReserveUsedAsCollateralDisabledEvents - ${ctx.batchState.state.mmReserveUsedAsCollateralDisabledEvents.size}`
  // );

  await ctx.store.save([...ctx.batchState.state.mmSupplies.values()]);
  await ctx.store.save([...ctx.batchState.state.mmWithdrawals.values()]);
  await ctx.store.save([...ctx.batchState.state.mmBorrows.values()]);
  await ctx.store.save([...ctx.batchState.state.mmRepays.values()]);
  await ctx.store.save([...ctx.batchState.state.mmLiquidationCalls.values()]);
  await ctx.store.save([...ctx.batchState.state.mmUserEModeSetEvents.values()]);
  await ctx.store.save([
    ...ctx.batchState.state.mmReserveUsedAsCollateralEnabledEvents.values(),
  ]);
  await ctx.store.save([
    ...ctx.batchState.state.mmReserveUsedAsCollateralDisabledEvents.values(),
  ]);
  await ctx.store.save([...ctx.batchState.state.moneyMarketEvents.values()]);
}

export async function handleEvmLog(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  // console.log('MM event - ', eventCallData.eventData.params.eventName);

  switch (eventCallData.eventData.params.eventName) {
    case EvmEventName.Transfer:
      await mmEventHandlers.handleMmTransferEvent(ctx, eventCallData);
      break;
    case EvmEventName.Supply:
      await mmEventHandlers.handleMmSupplyEvent(ctx, eventCallData);
      break;
    case EvmEventName.Withdraw:
      await mmEventHandlers.handleMmWithdrawEvent(ctx, eventCallData);
      break;
    case EvmEventName.Borrow:
      await mmEventHandlers.handleMmBorrowEvent(ctx, eventCallData);
      break;
    case EvmEventName.Repay:
      await mmEventHandlers.handleMmRepayEvent(ctx, eventCallData);
      break;
    case EvmEventName.LiquidationCall:
      await mmEventHandlers.handleMmLiquidationCallEvent(ctx, eventCallData);
      break;
    case EvmEventName.UserEModeSet:
      await mmEventHandlers.handleMmUserEModeSetEvent(ctx, eventCallData);
      break;
    case EvmEventName.ReserveUsedAsCollateralEnabled:
      await mmEventHandlers.handleMmReserveUsedAsCollateralEnabledEvent(
        ctx,
        eventCallData
      );
      break;
    case EvmEventName.ReserveUsedAsCollateralDisabled:
      await mmEventHandlers.handleMmReserveUsedAsCollateralDisabledEvent(
        ctx,
        eventCallData
      );
      break;
    default:
  }
}
