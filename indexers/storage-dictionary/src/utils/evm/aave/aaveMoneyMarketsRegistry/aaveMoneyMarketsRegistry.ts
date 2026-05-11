import { ethers } from 'ethers';
import pMap from 'p-map';
import { Store } from '@subsquid/typeorm-store';
import { ProcessorContext } from '../../../../processor';
import { AppConfig } from '../../../../appConfig';
import {
  AccountMmPositionDataContractData,
  MoneyMarketResourceDetails,
  MoneyMarketTokenDetails,
  MoneyMarketTokenTotalSupply,
  ReservesDetailsRegistryKey,
  UserReserveDataContractData,
  WithMarketTag,
} from '../types';
import { AaveMoneyMarketInstanceManager } from './aaveMoneyMarketInstanceManager';

const appConfig = AppConfig.getInstance();

/**
 * Singleton orchestrator that manages all configured Aave money market
 * instances on Hydration EVM and exposes a unified API. Per-market state
 * (reserves cache, routing maps) lives inside each
 * `AaveMoneyMarketInstanceManager`.
 *
 * Aggregated methods return items tagged with `poolImplementationProxyAddress`
 * so callers can identify the source market. Per-token methods route to the
 * single market that owns the token via the routing map populated during
 * `initContractInstances`.
 */
export class AaveMoneyMarketsRegistry {
  private static instance: AaveMoneyMarketsRegistry;

  // Keyed by normalized poolImplementationProxyAddress
  private readonly markets: Map<string, AaveMoneyMarketInstanceManager> =
    new Map();

  private constructor() {
    const instanceConfigs = appConfig.evm.AAVE_MONEY_MARKET_INSTANCES ?? [];

    for (const config of instanceConfigs) {
      const key = ethers.utils.getAddress(
        config.poolImplementationProxyAddress
      );
      if (this.markets.has(key)) {
        console.warn(
          `[AaveMoneyMarketsRegistry] Duplicate poolImplementationProxyAddress "${key}" for marketId "${config.marketId}", ignoring duplicate.`
        );
        continue;
      }
      this.markets.set(key, new AaveMoneyMarketInstanceManager(config));
    }

    console.log(
      `[AaveMoneyMarketsRegistry] Initialized with ${this.markets.size} market instance(s): ${Array.from(
        this.markets.values()
      )
        .map((m) => `${m.marketId}=${m.poolImplementationProxyAddress}`)
        .join(', ')}`
    );
  }

  static getInstance(): AaveMoneyMarketsRegistry {
    if (!AaveMoneyMarketsRegistry.instance) {
      AaveMoneyMarketsRegistry.instance = new AaveMoneyMarketsRegistry();
    }
    return AaveMoneyMarketsRegistry.instance;
  }

  getAllMarkets(): AaveMoneyMarketInstanceManager[] {
    return Array.from(this.markets.values());
  }

  getMarketByPoolImplementationProxyAddress(
    poolImplementationProxyAddress: string
  ): AaveMoneyMarketInstanceManager | null {
    const normalized = ethers.utils.getAddress(poolImplementationProxyAddress);
    return this.markets.get(normalized) ?? null;
  }

  /**
   * Find which market owns a given token (underlying / aToken / debt token).
   * Returns null if no market knows about the address — usually means the
   * registry hasn't been initialised yet, or the token is unrelated to MM.
   */
  private findMarketByToken(
    tokenAddress: string
  ): AaveMoneyMarketInstanceManager | null {
    for (const market of this.markets.values()) {
      if (market.hasToken(tokenAddress)) return market;
    }
    return null;
  }

  /**
   * Unified reserves details map across all markets.
   * Key format: `${poolImplementationProxyAddress}::${underlyingAssetAddress}`
   */
  get moneyMarketReservesDetailsMap(): Map<
    ReservesDetailsRegistryKey,
    WithMarketTag<MoneyMarketResourceDetails>
  > {
    const unified = new Map<
      ReservesDetailsRegistryKey,
      WithMarketTag<MoneyMarketResourceDetails>
    >();

    for (const market of this.markets.values()) {
      const poolImpl = market.poolImplementationProxyAddress;
      market.moneyMarketReservesDetailsMap.forEach((details, underlying) => {
        const key: ReservesDetailsRegistryKey = `${poolImpl}::${underlying}`;
        unified.set(key, {
          ...details,
          poolImplementationProxyAddress: poolImpl,
        });
      });
    }

    return unified;
  }

  /**
   * Initialise / refresh reserves for all markets. Each instance keeps its
   * own block-window cache and decides whether to actually re-fetch.
   */
  async initContractInstances({
    blockNumber,
    ctx,
    invalidateReservesCache = false,
  }: {
    blockNumber?: number;
    ctx: ProcessorContext<Store>;
    invalidateReservesCache?: boolean;
  }): Promise<void> {
    await pMap(
      this.getAllMarkets(),
      (market) =>
        market.initContractInstances({
          blockNumber,
          ctx,
          invalidateReservesCache,
        }),
      { concurrency: this.markets.size || 1 }
    );
  }

  /**
   * ------------------------------------------------------------------
   * Aggregated methods (fan-out, one call per market)
   * ------------------------------------------------------------------
   */

  /**
   * Fetch reserves data from every market and return a flat list, with each
   * reserve tagged by its `poolImplementationProxyAddress`. Bypasses the
   * per-instance reserves cache — use `initContractInstances` for the cached path.
   */
  async getAllMarketsReservesData(args: {
    blockNumber?: number;
  }): Promise<WithMarketTag<MoneyMarketResourceDetails>[]> {
    const aggregated: WithMarketTag<MoneyMarketResourceDetails>[] = [];

    await pMap(
      this.getAllMarkets(),
      async (market) => {
        const reserves = await market.getReservesData(args);
        if (!reserves) return;
        for (const reserve of reserves) {
          aggregated.push({
            ...reserve,
            poolImplementationProxyAddress:
              market.poolImplementationProxyAddress,
          });
        }
      },
      { concurrency: this.markets.size || 1 }
    );

    return aggregated;
  }

  async getUserReservesData(args: {
    accountAddress: string;
    blockNumber?: number;
  }): Promise<WithMarketTag<UserReserveDataContractData>[]> {
    const aggregated: WithMarketTag<UserReserveDataContractData>[] = [];

    await pMap(
      this.getAllMarkets(),
      async (market) => {
        const items = await market.getUserReservesData(args);
        if (!items) return;
        for (const item of items) {
          aggregated.push({
            ...item,
            poolImplementationProxyAddress:
              market.poolImplementationProxyAddress,
          });
        }
      },
      { concurrency: this.markets.size || 1 }
    );

    return aggregated;
  }

  async getAccountMmPositionData(args: {
    accountAddress: string;
    blockNumber?: number;
  }): Promise<WithMarketTag<AccountMmPositionDataContractData>[]> {
    const aggregated: WithMarketTag<AccountMmPositionDataContractData>[] = [];

    await pMap(
      this.getAllMarkets(),
      async (market) => {
        const data = await market.getAccountMmPositionData(args);
        if (!data) return;
        aggregated.push({
          ...data,
          poolImplementationProxyAddress: market.poolImplementationProxyAddress,
        });
      },
      { concurrency: this.markets.size || 1 }
    );

    return aggregated;
  }

  async getManyTokensTotalSupply(args: {
    addresses: string[];
    blockNumber?: number;
  }): Promise<WithMarketTag<MoneyMarketTokenTotalSupply>[]> {
    // Route each address to the single market that owns it. Avoids fan-out
    // null lookups across markets that don't know the token.
    const addressesByMarket = new Map<string, string[]>();
    const unowned: string[] = [];

    for (const rawAddress of args.addresses) {
      const market = this.findMarketByToken(rawAddress);
      if (!market) {
        unowned.push(rawAddress);
        continue;
      }
      const key = market.poolImplementationProxyAddress;
      const existing = addressesByMarket.get(key);
      if (existing) {
        existing.push(rawAddress);
      } else {
        addressesByMarket.set(key, [rawAddress]);
      }
    }

    if (unowned.length > 0) {
      console.warn(
        `[AaveMoneyMarketsRegistry] getManyTokensTotalSupply: ${unowned.length} address(es) not owned by any market and will be skipped: ${unowned.join(', ')}`
      );
    }

    const aggregated: WithMarketTag<MoneyMarketTokenTotalSupply>[] = [];

    await pMap(
      Array.from(addressesByMarket.entries()),
      async ([poolImpl, addresses]) => {
        const market = this.markets.get(poolImpl);
        if (!market) return;
        const items = await market.getManyTokensTotalSupply({
          addresses,
          blockNumber: args.blockNumber,
        });
        for (const item of items) {
          aggregated.push({
            ...item,
            poolImplementationProxyAddress:
              market.poolImplementationProxyAddress,
          });
        }
      },
      { concurrency: this.markets.size || 1 }
    );

    return aggregated;
  }

  /**
   * ------------------------------------------------------------------
   * Routed methods (single market, picked by token ownership)
   * ------------------------------------------------------------------
   */

  async getReserveDetails(
    address: string
  ): Promise<WithMarketTag<MoneyMarketTokenDetails> | null> {
    const market = this.findMarketByToken(address);
    if (!market) return null;

    const details = await market.getReserveDetails(address);
    if (!details) return null;

    return {
      ...details,
      poolImplementationProxyAddress: market.poolImplementationProxyAddress,
    };
  }

  async getAccountTokenBalance(args: {
    accountAddress: string;
    contractAddress: string;
    blockNumber?: number;
  }): Promise<WithMarketTag<{ value: bigint }> | null> {
    const market = this.findMarketByToken(args.contractAddress);
    if (!market) return null;

    const balance = await market.getAccountTokenBalance(args);
    if (balance === null || balance === undefined) return null;

    return {
      value: balance,
      poolImplementationProxyAddress: market.poolImplementationProxyAddress,
    };
  }
}
