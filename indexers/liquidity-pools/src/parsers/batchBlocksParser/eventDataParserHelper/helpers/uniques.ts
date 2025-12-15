import parsers from '../../../index';
import { EventDataParserHelper } from '../index';
import { BaseEventDataParserHelper } from './baseHelper'; // TODO fix for different CHAIN env value

export class UniquesEventParserHelper extends BaseEventDataParserHelper {
  constructor(rootHelpersFrame: EventDataParserHelper) {
    super(rootHelpersFrame);
  }

  /**
   * ==== Uniques Item Transferred ====
   */
  parseUniquesItemTransferredData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.uniques.parseUniqueTransferredParams(event);

    return this.compileGenericParsedData(eventParams);
  }
}
