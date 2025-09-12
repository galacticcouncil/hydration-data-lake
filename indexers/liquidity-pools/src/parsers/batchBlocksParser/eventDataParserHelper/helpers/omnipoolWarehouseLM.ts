import parsers from '../../../index';
import { EventDataParserHelper } from '../index';
import { BaseEventDataParserHelper } from './baseHelper'; // TODO fix for different CHAIN env value

export class OmnipoolWarehouseLMEventParserHelper extends BaseEventDataParserHelper {
  constructor(rootHelpersFrame: EventDataParserHelper) {
    super(rootHelpersFrame);
  }

  /**
   * ==== Omnipool Warehouse LM :: GlobalFarmAccRPZUpdated ====
   */
  parseOmnipoolWarehouseLMGlobalFarmAccRPZUpdatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolWarehouseLM.parseWarehouseLMGlobalFarmAccRPZUpdatedParams(
        event
      );

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Warehouse LM :: YieldFarmAccRPVSUpdated ====
   */
  parseOmnipoolWarehouseLMYieldFarmAccRPVSUpdatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolWarehouseLM.parseYieldFarmAccRPVSUpdatedParams(
        event
      );

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Warehouse LM :: AllRewardsDistributed ====
   */
  parseOmnipoolWarehouseLMAllRewardsDistributedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolWarehouseLM.parseAllRewardsDistributedParams(
        event
      );

    return this.compileGenericParsedData(eventParams);
  }
}
