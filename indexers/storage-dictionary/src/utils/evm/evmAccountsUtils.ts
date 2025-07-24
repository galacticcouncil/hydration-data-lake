import { AppConfig } from '../../appConfig';

/**
 * This class provides functionality which helps manage creation account records.
 *
 * Given issue: in specific block indexer can process EVM events where some EVM
 * accounts are involved. At the moment of EVM event processing indexer is not
 * aware if this EVM account is derived from a Substrate account or vice versa -
 * this particular EVM address is a parent for some
 * Substrate account (0x<h160_address><zero_value>).
 *
 * Only one reliable way to recognize if EVM address is derived from Substrate
 * account is to process an event `EVMAccounts.Bound`.
 * Reading of storage doesn't work in this case, because if EVM address is
 * a parent for Substrate account, it's not a Bound action. Also, Evm address can
 * be involved to the EVM events even before Bound event has happend (event in
 * different blocks).
 *
 * To avoid processing additional events, we can assume: if the EVM address
 * occurred in past blocks and in the current block it still doesn't have bounded
 * extension, so this particular EVM address can be used as a parent for a new
 * Substrate account.
 *
 * EvmAccountsUtils allows cache EVM addresses throughout the blocks and support
 * functionality explained above.
 */
export class EvmAccountsUtils {
  private static instance: EvmAccountsUtils;
  private addressesHistory: Set<string> = new Set();
  private addressesCurrentBlock: Set<string> = new Set();

  static getInstance(): EvmAccountsUtils {
    if (!EvmAccountsUtils.instance) {
      EvmAccountsUtils.instance = new EvmAccountsUtils();
    }
    return EvmAccountsUtils.instance;
  }

  addAddressToCache(address: string) {
    this.addressesCurrentBlock.add(address);
  }
  extractAddressFromHistoryCache(address: string) {
    if (!this.addressesHistory.has(address)) return null;
    this.addressesHistory.delete(address);
    return address;
  }

  margeCachedData() {
    for (const addr of this.addressesCurrentBlock) {
      this.addressesHistory.add(addr);
    }
    this.addressesCurrentBlock = new Set();
  }
}
