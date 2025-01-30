import {
  XykBuyExecutedEventParams,
  XykPoolCreatedEventParams,
  XykPoolDestroyedEventParams,
  XykSellExecutedEventParams,
} from '../../types/events';
import { XykCreatePoolCallArgs } from '../../types/calls';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== XYK Pool Created ====
 */
export type XykPoolCreatedData = ParsedEventCallData<
  XykPoolCreatedEventParsedData,
  XykCreatePoolCallParsedData
>;

export type XykPoolCreatedEventParsedData =
  EventParsedData<XykPoolCreatedEventParams>;

export type XykCreatePoolCallParsedData = CallParsedData<XykCreatePoolCallArgs>;

/**
 *  ==== XYK Pool Destroyed ====
 */
export type XykPoolDestroyedData = ParsedEventCallData<
  XykPoolDestroyedEventParsedData,
  CallParsedData
>;

export type XykPoolDestroyedEventParsedData =
  EventParsedData<XykPoolDestroyedEventParams>;

/**
 *  ==== XYK Buy Executed ====
 */

export type XykBuyExecutedData = ParsedEventCallData<
  XykBuyExecutedEventParsedData,
  CallParsedData
>;

export type XykBuyExecutedEventParsedData =
  EventParsedData<XykBuyExecutedEventParams>;

/**
 *  ==== XYK Sell Executed ====
 */

export type XykSellExecutedData = ParsedEventCallData<
  XykSellExecutedEventParsedData,
  CallParsedData
>;

export type XykSellExecutedEventParsedData =
  EventParsedData<XykSellExecutedEventParams>;
