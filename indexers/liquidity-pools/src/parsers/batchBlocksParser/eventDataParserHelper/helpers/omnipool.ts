import parsers from '../../../index';
import { EventDataParserHelper } from '../index';
import { BaseEventDataParserHelper } from './baseHelper'; // TODO fix for different CHAIN env value

export class OmnipoolEventParserHelper extends BaseEventDataParserHelper {
  constructor(rootHelpersFrame: EventDataParserHelper) {
    super(rootHelpersFrame);
  }

  /**
   * ==== Omnipool Token Added ====
   */
  parseOmnipoolTokenAddedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.omnipool.parseTokenAddedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== Omnipool Token Removed ====
   */
  parseOmnipoolTokenRemovedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.omnipool.parseTokenRemovedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== Omnipool Buy Executed ====
   */
  parseOmnipoolBuyExecutedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.omnipool.parseBuyExecutedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== Omnipool Sell Executed ====
   */
  parseOmnipoolSellExecutedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams = parsers.events.omnipool.parseSellExecutedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== Omnipool Liquidity Added ====
   */
  parseOmnipoolLiquidityAddedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipool.parseLiquidityAddedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== Omnipool Liquidity Removed ====
   */
  parseOmnipoolLiquidityRemovedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipool.parseLiquidityAddedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== Omnipool Position Created ====
   */
  parseOmnipoolPositionCreatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipool.parsePositionCreatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== Omnipool Position Updated ====
   */
  parseOmnipoolPositionUpdatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipool.parsePositionUpdatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Position Destroyed ====
   */
  parseOmnipoolPositionDestroyedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipool.parsePositionDestroyedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
}
