import {
  OmnipoolTokenAddedEventParams,
  OmnipoolWarehouseLMAllRewardsDistributedEventParams,
  OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedEventParams,
  OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedEventParams,
} from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Omnipool Warehouse LM :: GlobalFarmAccRPZUpdated ====
 */
export type OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedData =
  ParsedEventCallData<
    OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedEventParsedData,
    CallParsedData
  >;

export type OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedEventParsedData =
  EventParsedData<OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedEventParams>;

/**
 *  ==== Omnipool Warehouse LM :: YieldFarmAccRPVSUpdated ====
 */
export type OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedData =
  ParsedEventCallData<
    OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedEventParsedData,
    CallParsedData
  >;

export type OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedEventParsedData =
  EventParsedData<OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedEventParams>;

/**
 *  ==== Omnipool Warehouse LM :: AllRewardsDistributed ====
 */
export type OmnipoolWarehouseLMAllRewardsDistributedData = ParsedEventCallData<
  OmnipoolWarehouseLMAllRewardsDistributedEventParsedData,
  CallParsedData
>;

export type OmnipoolWarehouseLMAllRewardsDistributedEventParsedData =
  EventParsedData<OmnipoolWarehouseLMAllRewardsDistributedEventParams>;
