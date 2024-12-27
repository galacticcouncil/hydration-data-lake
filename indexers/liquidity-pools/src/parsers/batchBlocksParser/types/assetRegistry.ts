import {
  AssetRegistryRegisteredEventParams,
  AssetRegistryUpdatedEventParams,
} from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Asset Registry Registered ====
 */
export type AssetRegistryRegisteredData = ParsedEventCallData<
  AssetRegistryRegisteredEventParsedData,
  CallParsedData
>;

export type AssetRegistryRegisteredEventParsedData =
  EventParsedData<AssetRegistryRegisteredEventParams>;

/**
 *  ==== Asset Registry Updated ====
 */

export type AssetRegistryUpdatedData = ParsedEventCallData<
  AssetRegistryUpdatedEventParsedData,
  CallParsedData
>;

export type AssetRegistryUpdatedEventParsedData =
  EventParsedData<AssetRegistryUpdatedEventParams>;
