import {
  TokensTransferEventParams,
  TokensDepositedEventParams,
  TokensWithdrawnEventParams,
  TokensReservedEventParams,
  TokensUnreservedEventParams,
} from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== Tokens Transfer ====
 */

export type TokensTransferData = ParsedEventCallData<
  TokensTransferEventParsedData,
  CallParsedData
>;

export type TokensTransferEventParsedData =
  EventParsedData<TokensTransferEventParams>;

/**
 *  ==== Tokens Deposited ====
 */

export type TokensDepositedData = ParsedEventCallData<
  TokensDepositedEventParsedData,
  CallParsedData
>;

export type TokensDepositedEventParsedData =
  EventParsedData<TokensDepositedEventParams>;

/**
 *  ==== Tokens Withdrawn ====
 */

export type TokensWithdrawnData = ParsedEventCallData<
  TokensWithdrawnEventParsedData,
  CallParsedData
>;

export type TokensWithdrawnEventParsedData =
  EventParsedData<TokensWithdrawnEventParams>;

/**
 *  ==== Tokens Reserved ====
 */

export type TokensReservedData = ParsedEventCallData<
  TokensReservedEventParsedData,
  CallParsedData
>;

export type TokensReservedEventParsedData =
  EventParsedData<TokensReservedEventParams>;

/**
 *  ==== Tokens Unreserved ====
 */

export type TokensUnreservedData = ParsedEventCallData<
  TokensUnreservedEventParsedData,
  CallParsedData
>;

export type TokensUnreservedEventParsedData =
  EventParsedData<TokensUnreservedEventParams>;
