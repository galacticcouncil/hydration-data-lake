import aavePoolImplementation from './abi/aavePoolImplementation.json';
import aTokenHydration from './abi/aTokenHydration.json';
import { ethers } from 'ethers';

export class EvmLogDecoder {
  private static instance: EvmLogDecoder;
  private interfacesMap = new Map([
    [
      aavePoolImplementation.address,
      new ethers.Interface(aavePoolImplementation.abi),
    ],
    [aTokenHydration.address, new ethers.Interface(aTokenHydration.abi)],
  ]);

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
}
