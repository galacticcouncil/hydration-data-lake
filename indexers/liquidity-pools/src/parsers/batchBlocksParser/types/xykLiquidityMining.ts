import {
  XykLMDepositDestroyedEventParams,
  XykLMGlobalFarmCreatedEventParams,
  XykLMGlobalFarmTerminatedEventParams,
  XykLMGlobalFarmUpdatedEventParams,
  XykLMRewardClaimedEventParams,
  XykLMSharesDepositedEventParams,
  XykLMSharesRedepositedEventParams,
  XykLMSharesWithdrawnEventParams,
  XykLMYieldFarmCreatedEventParams,
  XykLMYieldFarmResumedEventParams,
  XykLMYieldFarmStoppedEventParams,
  XykLMYieldFarmTerminatedEventParams,
  XykLMYieldFarmUpdatedEventParams,
} from '../../types/events/xykLiquidityMining';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== XYK LM :: GlobalFarmCreated ====
 */

export type XykLMGlobalFarmCreatedData = ParsedEventCallData<
  XykLMGlobalFarmCreatedEventParsedData,
  CallParsedData
>;

export type XykLMGlobalFarmCreatedEventParsedData =
  EventParsedData<XykLMGlobalFarmCreatedEventParams>;

/**
 *  ==== XYK LM :: GlobalFarmUpdated ====
 */

export type XykLMGlobalFarmUpdatedData = ParsedEventCallData<
  XykLMGlobalFarmUpdatedEventParsedData,
  CallParsedData
>;

export type XykLMGlobalFarmUpdatedEventParsedData =
  EventParsedData<XykLMGlobalFarmUpdatedEventParams>;

/**
 *  ==== XYK LM :: GlobalFarmTerminated ====
 */

export type XykLMGlobalFarmTerminatedData = ParsedEventCallData<
  XykLMGlobalFarmTerminatedEventParsedData,
  CallParsedData
>;

export type XykLMGlobalFarmTerminatedEventParsedData =
  EventParsedData<XykLMGlobalFarmTerminatedEventParams>;

/**
 *  ==== XYK LM :: YieldFarmCreated ====
 */

export type XykLMYieldFarmCreatedData = ParsedEventCallData<
  XykLMYieldFarmCreatedEventParsedData,
  CallParsedData
>;

export type XykLMYieldFarmCreatedEventParsedData =
  EventParsedData<XykLMYieldFarmCreatedEventParams>;

/**
 *  ==== XYK LM :: YieldFarmStopped ====
 */

export type XykLMYieldFarmStoppedData = ParsedEventCallData<
  XykLMYieldFarmStoppedEventParsedData,
  CallParsedData
>;

export type XykLMYieldFarmStoppedEventParsedData =
  EventParsedData<XykLMYieldFarmStoppedEventParams>;

/**
 *  ==== XYK LM :: YieldFarmTerminated ====
 */

export type XykLMYieldFarmTerminatedData = ParsedEventCallData<
  XykLMYieldFarmTerminatedEventParsedData,
  CallParsedData
>;

export type XykLMYieldFarmTerminatedEventParsedData =
  EventParsedData<XykLMYieldFarmTerminatedEventParams>;

/**
 *  ==== XYK LM :: YieldFarmResumed ====
 */

export type XykLMYieldFarmResumedData = ParsedEventCallData<
  XykLMYieldFarmResumedEventParsedData,
  CallParsedData
>;

export type XykLMYieldFarmResumedEventParsedData =
  EventParsedData<XykLMYieldFarmResumedEventParams>;

/**
 *  ==== XYK LM :: YieldFarmUpdated ====
 */

export type XykLMYieldFarmUpdatedData = ParsedEventCallData<
  XykLMYieldFarmUpdatedEventParsedData,
  CallParsedData
>;

export type XykLMYieldFarmUpdatedEventParsedData =
  EventParsedData<XykLMYieldFarmUpdatedEventParams>;

/**
 *  ==== XYK LM :: SharesDeposited ====
 */

export type XykLMSharesDepositedData = ParsedEventCallData<
  XykLMSharesDepositedEventParsedData,
  CallParsedData
>;

export type XykLMSharesDepositedEventParsedData =
  EventParsedData<XykLMSharesDepositedEventParams>;

/**
 *  ==== XYK LM :: SharesRedeposited ====
 */

export type XykLMSharesRedepositedData = ParsedEventCallData<
  XykLMSharesRedepositedEventParsedData,
  CallParsedData
>;

export type XykLMSharesRedepositedEventParsedData =
  EventParsedData<XykLMSharesRedepositedEventParams>;

/**
 *  ==== XYK LM :: SharesWithdrawn ====
 */

export type XykLMSharesWithdrawnData = ParsedEventCallData<
  XykLMSharesWithdrawnEventParsedData,
  CallParsedData
>;

export type XykLMSharesWithdrawnEventParsedData =
  EventParsedData<XykLMSharesWithdrawnEventParams>;

/**
 *  ==== XYK LM :: DepositDestroyed ====
 */

export type XykLMDepositDestroyedData = ParsedEventCallData<
  XykLMDepositDestroyedEventParsedData,
  CallParsedData
>;

export type XykLMDepositDestroyedEventParsedData =
  EventParsedData<XykLMDepositDestroyedEventParams>;

/**
 *  ==== XYK LM :: RewardClaimed ====
 */

export type XykLMRewardClaimedData = ParsedEventCallData<
  XykLMRewardClaimedEventParsedData,
  CallParsedData
>;

export type XykLMRewardClaimedEventParsedData =
  EventParsedData<XykLMRewardClaimedEventParams>;
