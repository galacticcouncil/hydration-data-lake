import {
  BroadcastSwapped2EventParams,
  BroadcastSwapped3EventParams,
  BroadcastSwappedEventParams,
} from '../../types/events';
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

/**
 *  ==== Broadcast Swapped3 ====
 */

export type BroadcastSwapped3Data = ParsedEventCallData<
  BroadcastSwapped3EventParsedData,
  CallParsedData
>;

export type BroadcastSwapped3EventParsedData =
  EventParsedData<BroadcastSwapped3EventParams>;
