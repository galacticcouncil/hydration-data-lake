import parsers from '../../../index';
import { calls, events } from '../../../chains/hydration/typegenTypes';
import { EventDataParserHelper } from '../index';
import { BaseEventDataParserHelper } from './baseHelper'; // TODO fix for different CHAIN env value

export class XykEventParserHelper extends BaseEventDataParserHelper {
  constructor(rootHelpersFrame: EventDataParserHelper) {
    super(rootHelpersFrame);
  }

  /**
   * ==== XYK Pool Created ====
   */
  parseXykPoolCreatedData() {
    const { relayChainInfo, eventMetadata, callMetadata, call, event } =
      this.rootHelpersFrame;
    const callArgs =
      call && call.name === calls.xyk.createPool.name
        ? parsers.calls.xyk.parseCreatePoolArgs(call)
        : undefined;
    const eventParams = parsers.events.xyk.parsePoolCreatedParams(event);

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
   * ==== XYK Pool Destroyed ====
   */
  parseXykPoolDestroyedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.xyk.parsePoolDestroyedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== XYK Buy Executed ====
   */
  parseXykBuyExecutedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.xyk.parseBuyExecutedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== XYK Sell Executed ====
   */
  parseXykSellExecutedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.xyk.parseSellExecutedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Added ====
   */
  parseXykLiquidityAddedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.xyk.parseLiquidityAddedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== XYK Liquidity Removed ====
   */
  parseXykLiquidityRemovedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.xyk.parseLiquidityRemovedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
}
