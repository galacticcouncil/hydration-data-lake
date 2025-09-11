import {
  OmnipoolLMDepositDestroyedEventParams,
  OmnipoolLMGlobalFarmCreatedEventParams,
  OmnipoolLMGlobalFarmTerminatedEventParams,
  OmnipoolLMGlobalFarmUpdatedEventParams,
  OmnipoolLMRewardClaimedEventParams,
  OmnipoolLMSharesDepositedEventParams,
  OmnipoolLMSharesRedepositedEventParams,
  OmnipoolLMSharesWithdrawnEventParams,
  OmnipoolLMYieldFarmCreatedEventParams,
  OmnipoolLMYieldFarmResumedEventParams,
  OmnipoolLMYieldFarmStoppedEventParams,
  OmnipoolLMYieldFarmTerminatedEventParams,
  OmnipoolLMYieldFarmUpdatedEventParams,
} from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Omnipool LM :: GlobalFarmCreated ====
 */

export type OmnipoolLMGlobalFarmCreatedData = ParsedEventCallData<
  OmnipoolLMGlobalFarmCreatedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMGlobalFarmCreatedEventParsedData =
  EventParsedData<OmnipoolLMGlobalFarmCreatedEventParams>;

/**
 *  ==== Omnipool LM :: GlobalFarmUpdated ====
 */
export type OmnipoolLMGlobalFarmUpdatedData = ParsedEventCallData<
  OmnipoolLMGlobalFarmUpdatedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMGlobalFarmUpdatedEventParsedData =
  EventParsedData<OmnipoolLMGlobalFarmUpdatedEventParams>;

/**
 *  ==== Omnipool LM :: GlobalFarmTerminated ====
 */
export type OmnipoolLMGlobalFarmTerminatedData = ParsedEventCallData<
  OmnipoolLMGlobalFarmTerminatedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMGlobalFarmTerminatedEventParsedData =
  EventParsedData<OmnipoolLMGlobalFarmTerminatedEventParams>;

/**
 *  ==== Omnipool LM :: YieldFarmCreated ====
 */

export type OmnipoolLMYieldFarmCreatedData = ParsedEventCallData<
  OmnipoolLMYieldFarmCreatedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMYieldFarmCreatedEventParsedData =
  EventParsedData<OmnipoolLMYieldFarmCreatedEventParams>;

/**
 *  ==== Omnipool LM :: YieldFarmStopped ====
 */

export type OmnipoolLMYieldFarmStoppedData = ParsedEventCallData<
  OmnipoolLMYieldFarmStoppedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMYieldFarmStoppedEventParsedData =
  EventParsedData<OmnipoolLMYieldFarmStoppedEventParams>;

/**
 *  ==== Omnipool LM :: YieldFarmResumed ====
 */

export type OmnipoolLMYieldFarmResumedData = ParsedEventCallData<
  OmnipoolLMYieldFarmResumedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMYieldFarmResumedEventParsedData =
  EventParsedData<OmnipoolLMYieldFarmResumedEventParams>;

/**
 *  ==== Omnipool LM :: YieldFarmUpdated ====
 */

export type OmnipoolLMYieldFarmUpdatedData = ParsedEventCallData<
  OmnipoolLMYieldFarmUpdatedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMYieldFarmUpdatedEventParsedData =
  EventParsedData<OmnipoolLMYieldFarmUpdatedEventParams>;

/**
 *  ==== Omnipool LM :: YieldFarmTerminated ====
 */

export type OmnipoolLMYieldFarmTerminatedData = ParsedEventCallData<
  OmnipoolLMYieldFarmTerminatedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMYieldFarmTerminatedEventParsedData =
  EventParsedData<OmnipoolLMYieldFarmTerminatedEventParams>;

/**
 *  ==== Omnipool LM :: SharesDeposited ====
 */

export type OmnipoolLMSharesDepositedData = ParsedEventCallData<
  OmnipoolLMSharesDepositedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMSharesDepositedEventParsedData =
  EventParsedData<OmnipoolLMSharesDepositedEventParams>;

/**
 *  ==== Omnipool LM :: SharesRedeposited ====
 */

export type OmnipoolLMSharesRedepositedData = ParsedEventCallData<
  OmnipoolLMSharesRedepositedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMSharesRedepositedEventParsedData =
  EventParsedData<OmnipoolLMSharesRedepositedEventParams>;

/**
 *  ==== Omnipool LM :: RewardClaimed ====
 */

export type OmnipoolLMRewardClaimedData = ParsedEventCallData<
  OmnipoolLMRewardClaimedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMRewardClaimedEventParsedData =
  EventParsedData<OmnipoolLMRewardClaimedEventParams>;

/**
 *  ==== Omnipool LM :: SharesWithdrawn ====
 */

export type OmnipoolLMSharesWithdrawnData = ParsedEventCallData<
  OmnipoolLMSharesWithdrawnEventParsedData,
  CallParsedData
>;

export type OmnipoolLMSharesWithdrawnEventParsedData =
  EventParsedData<OmnipoolLMSharesWithdrawnEventParams>;

/**
 *  ==== Omnipool LM :: DepositDestroyed ====
 */

export type OmnipoolLMDepositDestroyedData = ParsedEventCallData<
  OmnipoolLMDepositDestroyedEventParsedData,
  CallParsedData
>;

export type OmnipoolLMDepositDestroyedEventParsedData =
  EventParsedData<OmnipoolLMDepositDestroyedEventParams>;
