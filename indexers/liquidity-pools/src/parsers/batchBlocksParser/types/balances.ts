import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';
import {
  BalancesTransferEventParams,
  BalancesDepositEventParams,
  BalancesWithdrawEventParams,
  BalancesReservedEventParams,
  BalancesUnreservedEventParams,
} from '../../types/events';

/**
 *  ==== Balances Transfer ====
 */

export type BalancesTransferData = ParsedEventCallData<
  BalancesTransferEventParsedData,
  CallParsedData
>;

export type BalancesTransferEventParsedData =
  EventParsedData<BalancesTransferEventParams>;

/**
 *  ==== Balances Deposit ====
 */

export type BalancesDepositData = ParsedEventCallData<
  BalancesDepositEventParsedData,
  CallParsedData
>;

export type BalancesDepositEventParsedData =
  EventParsedData<BalancesDepositEventParams>;

/**
 *  ==== Balances Withdraw ====
 */

export type BalancesWithdrawData = ParsedEventCallData<
  BalancesWithdrawEventParsedData,
  CallParsedData
>;

export type BalancesWithdrawEventParsedData =
  EventParsedData<BalancesWithdrawEventParams>;

/**
 *  ==== Balances Reserved ====
 */

export type BalancesReservedData = ParsedEventCallData<
  BalancesReservedEventParsedData,
  CallParsedData
>;

export type BalancesReservedEventParsedData =
  EventParsedData<BalancesReservedEventParams>;

/**
 *  ==== Balances Unreserved ====
 */

export type BalancesUnreservedData = ParsedEventCallData<
  BalancesUnreservedEventParsedData,
  CallParsedData
>;

export type BalancesUnreservedEventParsedData =
  EventParsedData<BalancesUnreservedEventParams>;
