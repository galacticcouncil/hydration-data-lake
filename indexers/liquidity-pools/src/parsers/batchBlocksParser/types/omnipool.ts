import {
  OmnipoolBuyExecutedEventParams,
  OmnipoolLiquidityAddedEventParams,
  OmnipoolLiquidityRemovedEventParams,
  OmnipoolPositionCreatedEventParams,
  OmnipoolPositionDestroyedEventParams,
  OmnipoolPositionUpdatedEventParams,
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

/**
 *  ==== Omnipool :: LiquidityAdded ====
 */
export type OmnipoolLiquidityAddedData = ParsedEventCallData<
  OmnipoolLiquidityAddedEventParsedData,
  CallParsedData
>;

export type OmnipoolLiquidityAddedEventParsedData =
  EventParsedData<OmnipoolLiquidityAddedEventParams>;

/**
 *  ==== Omnipool :: LiquidityRemoved ====
 */
export type OmnipoolLiquidityRemovedData = ParsedEventCallData<
  OmnipoolLiquidityRemovedEventParsedData,
  CallParsedData
>;

export type OmnipoolLiquidityRemovedEventParsedData =
  EventParsedData<OmnipoolLiquidityRemovedEventParams>;

/**
 *  ==== Omnipool :: PositionCreated ====
 */
export type OmnipoolPositionCreatedData = ParsedEventCallData<
  OmnipoolPositionCreatedEventParsedData,
  CallParsedData
>;

export type OmnipoolPositionCreatedEventParsedData =
  EventParsedData<OmnipoolPositionCreatedEventParams>;

/**
 *  ==== Omnipool :: PositionDestroyed ====
 */

export type OmnipoolPositionDestroyedData = ParsedEventCallData<
  OmnipoolPositionDestroyedEventParsedData,
  CallParsedData
>;

export type OmnipoolPositionDestroyedEventParsedData =
  EventParsedData<OmnipoolPositionDestroyedEventParams>;

/**
 *  ==== Omnipool :: PositionUpdated ====
 */

export type OmnipoolPositionUpdatedData = ParsedEventCallData<
  OmnipoolPositionUpdatedEventParsedData,
  CallParsedData
>;

export type OmnipoolPositionUpdatedEventParsedData =
  EventParsedData<OmnipoolPositionUpdatedEventParams>;
