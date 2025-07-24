import {
  Block,
  BlockWithData,
  Event,
  Extrinsic,
  ProcessorContext,
} from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { events } from '../../../typegenTypes';
import parsers from '../../../parsers';
import {
  EventMetadata,
  EventParsedData,
  EvmEventName,
  EvmLogEventParsedData,
} from '../../../parsers/types/events';
import mmEventHandlers from './utils';

function getEventMetadata({
  event,
  blockHeader,
  extrinsic,
  traceId,
}: {
  event: Event;
  blockHeader: Block;
  extrinsic?: Extrinsic;
  traceId: string;
}): EventMetadata {
  return {
    id: event.id,
    indexInBlock: event.index,
    name: event.name,
    traceId,
    blockHeader,
    extrinsic,
  };
}

export async function parseEvmEventsInBlock(
  block: BlockWithData,
  ctx: ProcessorContext<Store>
) {
  const eventsFiltered: Event[] = (block.events as Event[]).filter(
    (e) => e.name === events.evm.log.name
  );

  for (const event of eventsFiltered) {
    const eventParams = parsers.events.evm.parseLogParams(event);
    if (!eventParams) continue;

    const parsedEvent: EvmLogEventParsedData = {
      name: event.name,
      metadata: getEventMetadata({
        event,
        blockHeader: block.header,
        extrinsic: event.extrinsic,
        traceId: '',
      }),
      params: eventParams,
    };

    await handleEvmLog(ctx, parsedEvent);
  }
}

export async function handleEvmLog(
  ctx: ProcessorContext<Store>,
  eventData: EvmLogEventParsedData
) {
  if (!eventData.params) return;

  switch (eventData.params.eventName) {
    case EvmEventName.Transfer:
      await mmEventHandlers.handleMmTransferEvent(ctx, eventData);
      break;
    case EvmEventName.Supply:
      await mmEventHandlers.handleMmSupplyEvent(ctx, eventData);
      break;
    case EvmEventName.Withdraw:
      await mmEventHandlers.handleMmWithdrawEvent(ctx, eventData);
      break;
    case EvmEventName.Borrow:
      await mmEventHandlers.handleMmBorrowEvent(ctx, eventData);
      break;
    case EvmEventName.Repay:
      await mmEventHandlers.handleMmRepayEvent(ctx, eventData);
      break;
    case EvmEventName.LiquidationCall:
      await mmEventHandlers.handleMmLiquidationCallEvent(ctx, eventData);
      break;
    case EvmEventName.UserEModeSet:
      await mmEventHandlers.handleMmUserEModeSetEvent(ctx, eventData);
      break;
    case EvmEventName.ReserveUsedAsCollateralEnabled:
      await mmEventHandlers.handleMmReserveUsedAsCollateralEnabledEvent(
        ctx,
        eventData
      );
      break;
    case EvmEventName.ReserveUsedAsCollateralDisabled:
      await mmEventHandlers.handleMmReserveUsedAsCollateralDisabledEvent(
        ctx,
        eventData
      );
      break;
    case EvmEventName.OracleUpdate:
      await mmEventHandlers.handleOracleUpdatedEvent(ctx, eventData);
      break;
    default:
  }
}
