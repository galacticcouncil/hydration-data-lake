import { CallParsedData, EventParsedData, ParsedEventCallData } from './index';
import { UniquesTransferredEventParams } from '../../types/events/uniques';

/**
 *  ==== Uniques Transferred ====
 */

export type UniquesTransferredData = ParsedEventCallData<
  UniquesTransferredEventParsedData,
  CallParsedData
>;

export type UniquesTransferredEventParsedData =
  EventParsedData<UniquesTransferredEventParams>;
