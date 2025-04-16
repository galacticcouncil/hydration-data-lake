import { BroadcastSwapped2EventParams, BroadcastSwappedEventParams } from '../../types/events';
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

/**
 *  ==== Broadcast Swapped2 ====
 */

export type BroadcastSwapped2Data = ParsedEventCallData<
  BroadcastSwapped2EventParsedData,
  CallParsedData
>;

export type BroadcastSwapped2EventParsedData =
  EventParsedData<BroadcastSwapped2EventParams>;
