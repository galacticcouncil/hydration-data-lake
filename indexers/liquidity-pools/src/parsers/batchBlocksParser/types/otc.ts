import {
  DcaCompletedEventParams,
  DcaExecutionPlannedEventParams,
  DcaRandomnessGenerationFailedEventParams,
  DcaScheduledEventParams,
  DcaTerminatedEventParams,
  DcaTradeExecutedEventParams,
  DcaTradeFailedEventParams,
  OtcOrderCancelledEventParams,
  OtcOrderFilledEventParams,
  OtcOrderPartiallyFilledEventParams,
  OtcOrderPlacedEventParams,
} from '../../types/events';
import { DcaScheduleCallArgs } from '../../types/calls';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== OTC Order Placed ====
 */

export type OtcOrderPlacedData = ParsedEventCallData<
  OtcOrderPlacedEventParsedData,
  CallParsedData
>;

export type OtcOrderPlacedEventParsedData =
  EventParsedData<OtcOrderPlacedEventParams>;

/**
 *  ==== OTC Order Cancelled ====
 */

export type OtcOrderCancelledData = ParsedEventCallData<
  OtcOrderCancelledEventParsedData,
  CallParsedData
>;

export type OtcOrderCancelledEventParsedData =
  EventParsedData<OtcOrderCancelledEventParams>;

/**
 *  ==== OTC Order Filled ====
 */

export type OtcOrderFilledData = ParsedEventCallData<
  OtcOrderFilledEventParsedData,
  CallParsedData
>;

export type OtcOrderFilledEventParsedData =
  EventParsedData<OtcOrderFilledEventParams>;

/**
 *  ==== OTC Order Partially Filled ====
 */

export type OtcOrderPartiallyFilledData = ParsedEventCallData<
  OtcOrderPartiallyFilledEventParsedData,
  CallParsedData
>;

export type OtcOrderPartiallyFilledEventParsedData =
  EventParsedData<OtcOrderPartiallyFilledEventParams>;
