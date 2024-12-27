import {
  DcaCompletedEventParams,
  DcaExecutionPlannedEventParams,
  DcaRandomnessGenerationFailedEventParams,
  DcaScheduledEventParams,
  DcaTerminatedEventParams,
  DcaTradeExecutedEventParams,
  DcaTradeFailedEventParams,
} from '../../types/events';
import { DcaScheduleCallArgs } from '../../types/calls';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== DCA Scheduled ====
 */

export type DcaScheduledData = ParsedEventCallData<
  DcaScheduledEventParsedData,
  DcaScheduleCallParsedData
>;

export type DcaScheduledEventParsedData =
  EventParsedData<DcaScheduledEventParams>;

export type DcaScheduleCallParsedData = CallParsedData<DcaScheduleCallArgs>;

/**
 *  ==== DCA Execution planned ====
 */

export type DcaExecutionPlannedData = ParsedEventCallData<
  DcaExecutionPlannedEventParsedData,
  CallParsedData
>;

export type DcaExecutionPlannedEventParsedData =
  EventParsedData<DcaExecutionPlannedEventParams>;

/**
 *  ==== DCA trade executed ====
 */

export type DcaTradeExecutedData = ParsedEventCallData<
  DcaTradeExecutedEventParsedData,
  CallParsedData
>;

export type DcaTradeExecutedEventParsedData =
  EventParsedData<DcaTradeExecutedEventParams>;

/**
 *  ==== DCA trade failed ====
 */

export type DcaTradeFailedData = ParsedEventCallData<
  DcaTradeFailedEventParsedData,
  CallParsedData
>;

export type DcaTradeFailedEventParsedData =
  EventParsedData<DcaTradeFailedEventParams>;

/**
 *  ==== DCA terminated ====
 */

export type DcaTerminatedData = ParsedEventCallData<
  DcaTerminatedEventParsedData,
  CallParsedData
>;

export type DcaTerminatedEventParsedData =
  EventParsedData<DcaTerminatedEventParams>;

/**
 *  ==== DCA completed ====
 */

export type DcaCompletedData = ParsedEventCallData<
  DcaCompletedEventParsedData,
  CallParsedData
>;

export type DcaCompletedEventParsedData =
  EventParsedData<DcaCompletedEventParams>;

/**
 *  ==== DCA Randomness Generation Failed ====
 */

export type DcaRandomnessGenerationFailedData = ParsedEventCallData<
  DcaRandomnessGenerationFailedEventParsedData,
  CallParsedData
>;

export type DcaRandomnessGenerationFailedEventParsedData =
  EventParsedData<DcaRandomnessGenerationFailedEventParams>;
