import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';
import { BalancesTransferEventParams } from '../../types/events';

/**
 *  ==== Balances Transfer ====
 */

export type BalancesTransferData = ParsedEventCallData<
  BalancesTransferEventParsedData,
  CallParsedData
>;

export type BalancesTransferEventParsedData =
  EventParsedData<BalancesTransferEventParams>;
