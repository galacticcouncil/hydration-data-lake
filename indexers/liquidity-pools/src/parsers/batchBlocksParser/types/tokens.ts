import { TokensTransferEventParams } from '../../types/events';
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
