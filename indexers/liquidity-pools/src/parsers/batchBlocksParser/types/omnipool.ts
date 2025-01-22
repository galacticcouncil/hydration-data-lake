import {
  OmnipoolBuyExecutedEventParams,
  OmnipoolSellExecutedEventParams,
  OmnipoolTokenAddedEventParams,
  OmnipoolTokenRemovedEventParams,
} from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Omnipool Token Added ====
 */

export type OmnipoolTokenAddedData = ParsedEventCallData<
  OmnipoolTokenAddedEventParsedData,
  CallParsedData
>;

export type OmnipoolTokenAddedEventParsedData =
  EventParsedData<OmnipoolTokenAddedEventParams>;

/**
 *  ==== Omnipool Token Removed ====
 */

export type OmnipoolTokenRemovedData = ParsedEventCallData<
  OmnipoolTokenRemovedEventParsedData,
  CallParsedData
>;

export type OmnipoolTokenRemovedEventParsedData =
  EventParsedData<OmnipoolTokenRemovedEventParams>;

/**
 *  ==== Omnipool Buy Executed ====
 */

export type OmnipoolBuyExecutedData = ParsedEventCallData<
  OmnipoolBuyExecutedEventParsedData,
  CallParsedData
>;

export type OmnipoolBuyExecutedEventParsedData =
  EventParsedData<OmnipoolBuyExecutedEventParams>;

/**
 *  ==== Omnipool Sell Executed ====
 */

export type OmnipoolSellExecutedData = ParsedEventCallData<
  OmnipoolSellExecutedEventParsedData,
  CallParsedData
>;

export type OmnipoolSellExecutedEventParsedData =
  EventParsedData<OmnipoolSellExecutedEventParams>;
