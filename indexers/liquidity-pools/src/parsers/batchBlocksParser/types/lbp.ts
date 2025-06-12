import {
  LbpBuyExecutedEventParams,
  LbpPoolCreatedEventParams,
  LbpPoolUpdatedEventParams, LbpSellExecutedEventParams,
} from '../../types/events';
import { LbpCreatePoolCallArgs } from '../../types/calls';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== LBP Pool Created ====
 */
export type LbpPoolCreatedData = ParsedEventCallData<
  LbpPoolCreatedEventParsedData,
  LbpCreatePoolCallParsedData
>;

export type LbpPoolCreatedEventParsedData =
  EventParsedData<LbpPoolCreatedEventParams>;

export type LbpCreatePoolCallParsedData = CallParsedData<LbpCreatePoolCallArgs>;

/**
 *  ==== LBP Pool Updated ====
 */

export type LbpPoolUpdatedData = ParsedEventCallData<
  LbpPoolUpdatedEventParsedData,
  CallParsedData
>;

export type LbpPoolUpdatedEventParsedData =
  EventParsedData<LbpPoolUpdatedEventParams>;

/**
 *  ==== LBP Buy Executed ====
 */

export type LbpBuyExecutedData = ParsedEventCallData<
  LbpBuyExecutedEventParsedData,
  CallParsedData
>;

export type LbpBuyExecutedEventParsedData =
  EventParsedData<LbpBuyExecutedEventParams>;

/**
 *  ==== LBP Sell Executed ====
 */

export type LbpSellExecutedData = ParsedEventCallData<
  LbpSellExecutedEventParsedData,
  CallParsedData
>;

export type LbpSellExecutedEventParsedData =
  EventParsedData<LbpSellExecutedEventParams>;
