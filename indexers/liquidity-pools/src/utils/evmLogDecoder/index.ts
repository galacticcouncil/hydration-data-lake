import aavePoolImplementation from './abi/aavePoolImplementation.json';
import aTokenHydration from './abi/aTokenHydration.json';
import { ethers } from 'ethers';
import { MoneyMarketEventsParser } from './moneyMarketEventsParser';
import {
  EvmLogEventParams,
  MmEventParamsWithEventName,
  MmTransferEventParams,
} from '../../parsers/types/events';
import { EvmEventParamsTypeDecorated } from './types';
import { EvmEventName } from '../../model';

export class EvmLogDecoder extends MoneyMarketEventsParser {
  private static instance: EvmLogDecoder;
  private interfacesMap = new Map([
    [
      aavePoolImplementation.address,
      new ethers.Interface(aavePoolImplementation.abi),
    ],
    [aTokenHydration.address, new ethers.Interface(aTokenHydration.abi)],
  ]);

  constructor() {
    super();
  }

  static getInstance(): EvmLogDecoder {
    if (!EvmLogDecoder.instance) {
      EvmLogDecoder.instance = new EvmLogDecoder();
    }
    return EvmLogDecoder.instance;
  }

  tryDecodeLog({
    address,
    data,
    topics,
  }: {
    address: string;
    data: string;
    topics: string[];
  }) {
    let parsedLog = null;
    try {
      parsedLog = this.interfacesMap
        .get(aavePoolImplementation.address)!
        .parseLog({ topics, data });
    } catch (error) {}
    if (!parsedLog) {
      try {
        parsedLog = this.interfacesMap
          .get(aTokenHydration.address)!
          .parseLog({ topics, data });
      } catch (error) {}
    }

    return parsedLog;
  }

  getEvmEventFromLog<N extends EvmEventName>(
    evmLogParams: EvmLogEventParams
  ): EvmEventParamsTypeDecorated<N> | null {
    switch (evmLogParams.eventName) {
      case EvmEventName.Transfer:
        return this.parseTransferEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      case EvmEventName.Supply:
        return this.parseSupplyEvent(
          evmLogParams
        ) as unknown as EvmEventParamsTypeDecorated<N>;
      default:
        return null;
    }
  }
}
