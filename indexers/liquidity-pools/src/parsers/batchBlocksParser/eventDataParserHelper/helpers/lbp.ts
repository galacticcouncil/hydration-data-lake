import parsers from '../../../index';
import { calls, events } from '../../../chains/hydration/typegenTypes';
import { EventDataParserHelper } from '../index'; // TODO fix for different CHAIN env value

export class LbpEventParserHelper {
  constructor(private rootHelpersFrame: EventDataParserHelper) {}

  /**
   * ==== LBP Poll Created ====
   */
  parseLbpPoolCreatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } =
      this.rootHelpersFrame;

    const callArgs = call
      ? parsers.calls.lbp.parseCreatePoolArgs(call)
      : undefined;
    const eventParams = parsers.events.lbp.parsePoolCreatedParams(event);

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
        args: callArgs,
      },
    };
  }
  /**
   * ==== LBP Poll Updated ====
   */
  parseLbpPoolUpdatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } =
      this.rootHelpersFrame;
    const eventParams = parsers.events.lbp.parsePoolUpdatedParams(event);
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
   * ==== LBP Buy Executed ====
   */
  parseLbpBuyExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, event } =
      this.rootHelpersFrame;
    const eventParams = parsers.events.lbp.parseBuyExecutedParams(event);
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
   * ==== LBP Sell Executed ====
   */
  parseLbpSellExecutedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } =
      this.rootHelpersFrame;
    const eventParams = parsers.events.lbp.parseSellExecutedParams(event);
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
