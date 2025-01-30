import { BroadcastSwappedEventParams } from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Broadcast Swapped ====
 */

export type BroadcastSwappedData = ParsedEventCallData<
  BroadcastSwappedEventParsedData,
  CallParsedData
>;

export type BroadcastSwappedEventParsedData =
  EventParsedData<BroadcastSwappedEventParams>;
