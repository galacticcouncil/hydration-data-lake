import {
  EvmLogEventParams,
  MmSupplyEventParams,
  MmTransferEventParams,
} from '../../parsers/types/events';
import { EvmEventName } from '../../model';

export class MoneyMarketEventsParser {
  parseTransferEvent(event: EvmLogEventParams): MmTransferEventParams {
    return {
      eventName: EvmEventName.Transfer,
      reserveAddress: event.address,
      fromAddress: event.args[0],
      toAddress: event.args[1],
      amount: event.args[2],
    };
  }
  parseSupplyEvent(event: EvmLogEventParams): MmSupplyEventParams {
    return {
      eventName: EvmEventName.Supply,
      reserveAddress: event.args[0],
      userAddress: event.args[1],
      onBehalfOfUserAddress: event.args[2],
      amount: event.args[3],
      referralCode: event.args[4],
    };
  }
}
