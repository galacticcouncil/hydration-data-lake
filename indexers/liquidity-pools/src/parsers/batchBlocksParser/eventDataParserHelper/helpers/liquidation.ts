import parsers from '../../../index';
import { EventDataParserHelper } from '../index';
import { BaseEventDataParserHelper } from './baseHelper'; // TODO fix for different CHAIN env value

export class LiquidationEventParserHelper extends BaseEventDataParserHelper {
  constructor(rootHelpersFrame: EventDataParserHelper) {
    super(rootHelpersFrame);
  }

  /**
   * ==== Liquidation Liquidated ====
   */
  parseLiquidationLiquidatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.liquidation.parseLiquidationLiquidatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
}
