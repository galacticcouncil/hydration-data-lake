import {
  CurrenciesTransferredEventParams,
  TokensTransferEventParams,
} from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Currencies Transferred ====
 */

export type CurrenciesTransferredData = ParsedEventCallData<
  CurrenciesTransferredEventParsedData,
  CallParsedData
>;

export type CurrenciesTransferredEventParsedData =
  EventParsedData<CurrenciesTransferredEventParams>;
