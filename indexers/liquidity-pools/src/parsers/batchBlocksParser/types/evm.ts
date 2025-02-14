import { EvmLogEventParams } from '../../types/events';
import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';

/**
 *  ==== EVM Log ====
 */

export type EvmLogData = ParsedEventCallData<
  EvmLogEventParsedData,
  CallParsedData
>;

export type EvmLogEventParsedData = EventParsedData<EvmLogEventParams | null>;
