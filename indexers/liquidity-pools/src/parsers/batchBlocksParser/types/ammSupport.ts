import { AmmSupportSwappedEventParams } from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== AmmSupport Swapped ====
 */

export type AmmSupportSwappedData = ParsedEventCallData<
  AmmSupportSwappedEventParsedData,
  CallParsedData
>;

export type AmmSupportSwappedEventParsedData =
  EventParsedData<AmmSupportSwappedEventParams>;
