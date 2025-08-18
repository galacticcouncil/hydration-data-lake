import {
  HsmCollateralAddedEventParams,
  HsmCollateralRemovedEventParams,
  HsmCollateralUpdatedEventParams,
} from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Collateral Added ====
 */
export type HsmCollateralAddedData = ParsedEventCallData<
  HsmCollateralAddedEventParsedData,
  CallParsedData
>;

export type HsmCollateralAddedEventParsedData =
  EventParsedData<HsmCollateralAddedEventParams>;

/**
 *  ==== Collateral Removed ====
 */
export type HsmCollateralRemovedData = ParsedEventCallData<
  HsmCollateralRemovedEventParsedData,
  CallParsedData
>;

export type HsmCollateralRemovedEventParsedData =
  EventParsedData<HsmCollateralRemovedEventParams>;

/**
 *  ==== Collateral Updated ====
 */
export type HsmCollateralUpdatedData = ParsedEventCallData<
  HsmCollateralUpdatedEventParsedData,
  CallParsedData
>;

export type HsmCollateralUpdatedEventParsedData =
  EventParsedData<HsmCollateralUpdatedEventParams>;
