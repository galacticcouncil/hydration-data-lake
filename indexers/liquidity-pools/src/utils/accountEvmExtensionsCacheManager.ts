import { Hop } from '../handlers/assets/assetHistoricalData/utils/offlineSdk/sdk/src';
import { SqdBlock, SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmAccountsBoundEventParams } from '../parsers/types/events';
import parsers from '../parsers';

export class AccountEvmExtensionsCacheManager {
  private static instance: AccountEvmExtensionsCacheManager;

  private boundedAccountsCached: Map<string, EvmAccountsBoundEventParams> =
    new Map();
  private cacheInvalidatedAtBlock: number = 0;

  static getInstance(): AccountEvmExtensionsCacheManager {
    if (!AccountEvmExtensionsCacheManager.instance) {
      AccountEvmExtensionsCacheManager.instance =
        new AccountEvmExtensionsCacheManager();
    }
    return AccountEvmExtensionsCacheManager.instance;
  }

  addBoundedAccount(data: EvmAccountsBoundEventParams) {
    this.boundedAccountsCached.set(data.evmAddress, data);
  }

  async getAllBoundedAccountsList(ctx: SqdProcessorContext<Store>) {
    if (this.boundedAccountsCached.size > 0)
      return Array.from(this.boundedAccountsCached.values());

    this.boundedAccountsCached = await this.fetchAllBoundedAccounts(
      ctx.blocks[0].header
    );
    this.cacheInvalidatedAtBlock = ctx.blocks[0].header.height;

    return Array.from(this.boundedAccountsCached.values());
  }

  async initCache(ctx: SqdProcessorContext<Store>) {
    if (ctx.blocks.length === 0) return;

    if (ctx.blocks.length > 1) {
      this.boundedAccountsCached = await this.fetchAllBoundedAccounts(
        ctx.blocks[ctx.blocks.length - 1].header
      );
      this.cacheInvalidatedAtBlock =
        ctx.blocks[ctx.blocks.length - 1].header.height;
      return;
    }

    if (
      ctx.blocks[0].header.height - this.cacheInvalidatedAtBlock >
      ctx.appConfig.CACHED_EVM_BOUNDED_ACCOUNTS_TTL_BLOCKS
    ) {
      this.boundedAccountsCached = await this.fetchAllBoundedAccounts(
        ctx.blocks[0].header
      );
      this.cacheInvalidatedAtBlock = ctx.blocks[0].header.height;
    }
  }

  private async fetchAllBoundedAccounts(blockHeader: SqdBlock) {
    const allEvmAccounts =
      await parsers.storage.evmAccounts.getAllAccountsExtensions({
        block: blockHeader,
      });

    if (!allEvmAccounts) return new Map();

    const result: Map<string, EvmAccountsBoundEventParams> = new Map();

    for (const { h160Address, extension } of allEvmAccounts) {
      const accId = `${h160Address}${extension.replace(/^0x/, '')}`;
      result.set(h160Address, {
        accountAddress: accId,
        evmAddress: h160Address,
      });
    }

    return result;
  }
}
