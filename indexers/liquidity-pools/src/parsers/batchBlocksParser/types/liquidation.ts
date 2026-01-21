import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';
import { LiquidationLiquidatedEventParams } from '../../types/events';

/**
 *  ==== Liquidation Liquidated ====
 */

export type LiquidationLiquidatedData = ParsedEventCallData<
  LiquidationLiquidatedEventParsedData,
  CallParsedData
>;

export type LiquidationLiquidatedEventParsedData =
  EventParsedData<LiquidationLiquidatedEventParams>;
