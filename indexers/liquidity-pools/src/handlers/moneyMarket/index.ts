import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import mmEventHandlers from './mmEventHandlers';
import { EvmEventName, ResourceType, RoutedTrade } from '../../model';
import { processMmReserveIndexesHistoricalData } from './reserves/moneyMarketReservesIndexesHistoricalData';

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
    case EvmEventName.OracleUpdate:
      await mmEventHandlers.handleOracleUpdatedEvent(ctx, eventCallData);
      break;
    default:
  }
}
