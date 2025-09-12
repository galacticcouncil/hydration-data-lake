import { EventDataParserHelper } from '../index';
import { EventParsedData, ParsedEventCallData } from '../../types';

export class BaseEventDataParserHelper {
  constructor(protected rootHelpersFrame: EventDataParserHelper) {}

  compileGenericParsedData<T>(
    eventParams: T
  ): ParsedEventCallData<EventParsedData<T>, { name: string }> {
    const { relayChainInfo, eventMetadata, callMetadata } =
      this.rootHelpersFrame;

    return {
      relayChainInfo,
      id: eventMetadata.id,
      eventData: {
        name: eventMetadata.name,
        metadata: eventMetadata,
        params: eventParams,
      },
      callData: {
        ...callMetadata,
      },
    };
  }
}
