import parsers from '../../../index';
import { calls, events } from '../../../chains/hydration/typegenTypes';
import { EventDataParserHelper } from '../index';
import { BaseEventDataParserHelper } from './baseHelper'; // TODO fix for different CHAIN env value

export class XykLiquidityMiningEventParserHelper extends BaseEventDataParserHelper {
  constructor(rootHelpersFrame: EventDataParserHelper) {
    super(rootHelpersFrame);
  }

  /**
   * ==== XYK Liquidity Mining :: GlobalFarmCreated ====
   */
  parseXykLMGlobalFarmCreatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseGlobalFarmCreatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: GlobalFarmUpdated ====
   */
  parseXykLMGlobalFarmUpdatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseGlobalFarmUpdatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: GlobalFarmTerminated ====
   */
  parseXykLMGlobalFarmTerminatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseGlobalFarmTerminatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: YieldFarmCreated ====
   */
  parseXykLMYieldFarmCreatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseYieldFarmCreatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: YieldFarmStopped ====
   */
  parseXykLMYieldFarmStoppedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseYieldFarmStopedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: YieldFarmTerminated ====
   */
  parseXykLMYieldFarmTerminatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseYieldFarmTerminatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: YieldFarmResumed ====
   */
  parseXykLMYieldFarmResumedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseYieldFarmResumedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: YieldFarmUpdated ====
   */
  parseXykLMYieldFarmUpdatedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseYieldFarmUpdatedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: SharesDeposited ====
   */
  parseXykLMSharesDepositedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseSharesDepositedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: SharesRedeposited ====
   */
  parseXykLMSharesRedepositedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseSharesRedepositedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: SharesWithdrawn ====
   */
  parseXykLMSharesWithdrawnData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseSharesWithdrawnParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: DepositDestroyed ====
   */
  parseXykLMDepositDestroyedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseDepositDestroyedParams(event);

    return this.compileGenericParsedData(eventParams);
  }

  /**
   * ==== XYK Liquidity Mining :: RewardClaimed ====
   */
  parseXykLMRewardClaimedData() {
    const { event } = this.rootHelpersFrame;
    const eventParams =
      parsers.events.xykLiquidityMining.parseRewardClaimedParams(event);

    return this.compileGenericParsedData(eventParams);
  }
}
