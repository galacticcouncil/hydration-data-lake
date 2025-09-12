import parsers from '../../../index';
import { EventDataParserHelper } from '../index'; // TODO fix for different CHAIN env value

export class BroadcastEventParserHelper {
  constructor(private rootHelpersFrame: EventDataParserHelper) {}

  /**
   * ==== Broadcast Swapped ====
   */
  parseBroadcastSwappedData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } =
      this.rootHelpersFrame;
    const eventParams = parsers.events.broadcast.parseSwappedParams(event);

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
  /**
   * ==== Broadcast Swapped2 ====
   */
  parseBroadcastSwapped2Data() {
    const { relayChainInfo, eventMetadata, callMetadata, event } =
      this.rootHelpersFrame;
    const eventParams = parsers.events.broadcast.parseSwapped2Params(event);

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
  /**
   * ==== Broadcast Swapped3 ====
   */
  parseBroadcastSwapped3Data() {
    const { relayChainInfo, eventMetadata, callMetadata, event } =
      this.rootHelpersFrame;
    const eventParams = parsers.events.broadcast.parseSwapped3Params(event);

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
