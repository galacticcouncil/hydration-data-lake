import { EvmAccountsBoundEventParams } from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== EVMAccounts Bound ====
 */

export type EvmAccountsBoundData = ParsedEventCallData<
  EvmAccountsBoundEventParsedData,
  CallParsedData
>;

export type EvmAccountsBoundEventParsedData =
  EventParsedData<EvmAccountsBoundEventParams | null>;
