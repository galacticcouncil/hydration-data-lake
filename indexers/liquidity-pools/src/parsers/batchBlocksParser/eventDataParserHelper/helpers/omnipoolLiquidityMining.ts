import parsers from '../../../index';
import { EventDataParserHelper } from '../index';
import { BaseEventDataParserHelper } from './baseHelper'; // TODO fix for different CHAIN env value

export class OmnipoolLiquidityMiningEventParserHelper extends BaseEventDataParserHelper {
  constructor(rootHelpersFrame: EventDataParserHelper) {
    super(rootHelpersFrame);
  }

  /**
   * ==== Omnipool Liquidity Mining GlobalFarmCreated ====
   */
  parseOmnipoolLMGlobalFarmCreatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseGlobalFarmCreatedParams(
        event
      );

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining GlobalFarmUpdated ====
   */
  parseOmnipoolLMGlobalFarmUpdatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseGlobalFarmUpdatedParams(
        event
      );

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining GlobalFarmTerminated ====
   */
  parseOmnipoolLMGlobalFarmTerminatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseGlobalFarmTerminatedParams(
        event
      );

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining YieldFarmCreated ====
   */
  parseOmnipoolLMYieldFarmCreatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseYieldFarmCreatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining YieldFarmStopped ====
   */
  parseOmnipoolLMYieldFarmStoppedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseYieldFarmStoppedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining YieldFarmResumed ====
   */
  parseOmnipoolLMYieldFarmResumedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseYieldFarmResumedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining YieldFarmUpdated ====
   */
  parseOmnipoolLMYieldFarmUpdatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseYieldFarmUpdatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining YieldFarmTerminated ====
   */
  parseOmnipoolLMYieldFarmTerminatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseYieldFarmTerminatedParams(
        event
      );

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining SharesDeposited ====
   */
  parseOmnipoolLMSharesDepositedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseSharesDepositedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
  /**
   * ==== Omnipool Liquidity Mining SharesRedeposited ====
   */
  parseOmnipoolLMSharesRedepositedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseSharesRedepositedParams(
        event
      );

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining RewardClaimed ====
   */
  parseOmnipoolLMRewardClaimedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseRewardClaimedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining SharesWithdrawn ====
   */
  parseOmnipoolLMSharesWithdrawnData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseSharesWithdrawnParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== Omnipool Liquidity Mining DepositDestroyed ====
   */
  parseOmnipoolLMDepositDestroyedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.omnipoolLiquidityMining.parseDepositDestroyedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
}
