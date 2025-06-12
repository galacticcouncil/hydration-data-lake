import {
  StableswapBuyExecutedEventParams,
  StableswapLiquidityAddedEventParams,
  StableswapLiquidityRemovedEventParams,
  StableswapPoolCreatedEventParams,
  StableswapSellExecutedEventParams,
} from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Stableswap Pool Created ====
 */
export type StableswapPoolCreatedData = ParsedEventCallData<
  StableswapPoolCreatedEventParsedData,
  CallParsedData
>;

export type StableswapPoolCreatedEventParsedData =
  EventParsedData<StableswapPoolCreatedEventParams>;

/**
 *  ==== Stableswap Buy Executed ====
 */

export type StableswapBuyExecutedData = ParsedEventCallData<
  StableswapBuyExecutedEventParsedData,
  CallParsedData
>;

export type StableswapBuyExecutedEventParsedData =
  EventParsedData<StableswapBuyExecutedEventParams>;

/**
 *  ==== Stableswap Sell Executed ====
 */

export type StableswapSellExecutedData = ParsedEventCallData<
  StableswapSellExecutedEventParsedData,
  CallParsedData
>;

export type StableswapSellExecutedEventParsedData =
  EventParsedData<StableswapSellExecutedEventParams>;

/**
 *  ==== Stableswap Liquidity Added ====
 */

export type StableswapLiquidityAddedData = ParsedEventCallData<
  StableswapLiquidityAddedEventParsedData,
  CallParsedData
>;

export type StableswapLiquidityAddedEventParsedData =
  EventParsedData<StableswapLiquidityAddedEventParams>;

/**
 *  ==== Stableswap Liquidity Removed ====
 */

export type StableswapLiquidityRemovedData = ParsedEventCallData<
  StableswapLiquidityRemovedEventParsedData,
  CallParsedData
>;

export type StableswapLiquidityRemovedEventParsedData =
  EventParsedData<StableswapLiquidityRemovedEventParams>;
