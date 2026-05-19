import { Contract, ContractInterface, ethers } from 'ethers';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

/**
 * Manages a pool of EVM contract instances across multiple RPC providers.
 * Distributes contract calls across multiple RPC endpoints using round-robin
 * to avoid bottlenecks on a single provider.
 *
 * - All requests ALWAYS receive a contract instance (no requests are declined)
 * - When concurrent calls exceed pool size, instances are safely reused
 * - Contract instances are stateless for read operations, so reuse is safe
 */
export class ContractsPoolManager {
  private static instance: ContractsPoolManager;

  private providers: ethers.providers.JsonRpcProvider[] = [];

  // Keyed by ABI object identity (imported JSON ABIs are module singletons,
  // so identity equality is stable for the process lifetime). Prevents cache
  // collisions when the same address is used with different ABIs.
  private contractPools: Map<ContractInterface, Map<string, Contract[]>> =
    new Map();

  private contractCallCounter = 0;
  private providerCallCounter = 0;

  private providerCallDistribution: Map<number, number> = new Map();
  private lastLogTime: number = Date.now();
  private readonly LOG_INTERVAL_MS = 10000;

  private readonly poolingEnabled: boolean;

  private constructor() {
    this.poolingEnabled =
      appConfig.ENABLE_RPC_HTTPS_URLS_POOL &&
      appConfig.RPC_HTTPS_URLS_POOL.length > 0;

    if (this.poolingEnabled) {
      this.providers = appConfig.RPC_HTTPS_URLS_POOL.map(
        (url) => new ethers.providers.JsonRpcProvider(url)
      );

      for (let i = 0; i < this.providers.length; i++) {
        this.providerCallDistribution.set(i, 0);
      }

      console.log(
        `[ContractsPoolManager] Initialized with ${this.providers.length} RPC providers`
      );

      if (appConfig.ENABLE_RPC_POOL_DEBUG_LOGS) {
        console.log(`[ContractsPoolManager] Provider URLs:`);
        appConfig.RPC_HTTPS_URLS_POOL.forEach((url, i) => {
          console.log(`  [${i}] ${url}`);
        });
        console.log(
          `[ContractsPoolManager] Debug logging enabled (stats every ${this.LOG_INTERVAL_MS / 1000}s)`
        );
      }
    } else {
      const rpcUrl =
        appConfig.RPC_URL_HTTPS || 'https://archive.rpc.hydration.cloud';
      this.providers = [new ethers.providers.JsonRpcProvider(rpcUrl)];
      console.log(
        `[ContractsPoolManager] Pool disabled, using single provider`
      );
    }
  }

  static getInstance(): ContractsPoolManager {
    if (!ContractsPoolManager.instance) {
      ContractsPoolManager.instance = new ContractsPoolManager();
    }
    return ContractsPoolManager.instance;
  }

  private getOrCreateContractPool(
    address: string,
    abi: ContractInterface
  ): Contract[] {
    const normalizedAddress = ethers.utils.getAddress(address);

    let abiPools = this.contractPools.get(abi);
    if (!abiPools) {
      abiPools = new Map();
      this.contractPools.set(abi, abiPools);
    }

    let pool = abiPools.get(normalizedAddress);
    if (!pool) {
      pool = this.providers.map(
        (provider) => new Contract(normalizedAddress, abi, provider)
      );
      abiPools.set(normalizedAddress, pool);

      if (this.poolingEnabled && appConfig.ENABLE_RPC_POOL_DEBUG_LOGS) {
        console.log(
          `[ContractsPoolManager] Created contract pool for ${normalizedAddress.slice(0, 10)}... with ${pool.length} instances`
        );
      }
    }

    return pool;
  }

  private trackProviderUsage(providerIndex: number): void {
    if (!appConfig.ENABLE_RPC_POOL_DEBUG_LOGS) {
      return;
    }

    const currentCount = this.providerCallDistribution.get(providerIndex) || 0;
    this.providerCallDistribution.set(providerIndex, currentCount + 1);

    const now = Date.now();
    if (now - this.lastLogTime >= this.LOG_INTERVAL_MS) {
      this.logDistributionStats();
      this.lastLogTime = now;
    }
  }

  private logDistributionStats(): void {
    if (
      !this.poolingEnabled ||
      this.contractCallCounter === 0 ||
      !appConfig.ENABLE_RPC_POOL_DEBUG_LOGS
    ) {
      return;
    }

    const totalCalls = this.contractCallCounter;
    const providerCount = this.providers.length;
    const expectedPerProvider = totalCalls / providerCount;

    console.log(`\n[ContractsPoolManager] Distribution Stats:`);
    console.log(`  Total contract calls: ${totalCalls}`);
    console.log(`  Providers: ${providerCount}`);
    console.log(`  Expected per provider: ${expectedPerProvider.toFixed(1)}`);

    for (let i = 0; i < providerCount; i++) {
      const actualCalls = this.providerCallDistribution.get(i) || 0;
      const percentage = ((actualCalls / totalCalls) * 100).toFixed(1);
      const deviation = (
        ((actualCalls - expectedPerProvider) / expectedPerProvider) *
        100
      ).toFixed(1);
      const url = appConfig.RPC_HTTPS_URLS_POOL[i] || 'unknown';

      console.log(`  Provider ${i} [${url}]:`);
      console.log(
        `    Calls: ${actualCalls} (${percentage}%, deviation: ${deviation}%)`
      );
    }

    const maxCalls = Math.max(
      ...Array.from(this.providerCallDistribution.values())
    );
    const minCalls = Math.min(
      ...Array.from(this.providerCallDistribution.values())
    );
    const imbalance =
      maxCalls > 0
        ? (((maxCalls - minCalls) / maxCalls) * 100).toFixed(1)
        : '0';

    console.log(`  Load imbalance: ${imbalance}%`);
    if (parseFloat(imbalance) > 20) {
      console.warn(
        `  ⚠️  WARNING: High load imbalance detected! Expected even distribution.`
      );
    }
    console.log('');
  }

  /**
   * Get the next contract instance from the pool using round-robin with atomic counter.
   * Uses atomic counter increment (thread-safe in Node.js event loop).
   * Always returns a contract instance — when concurrent calls exceed pool size,
   * instances are safely reused.
   */
  getContract(address: string, abi: ContractInterface): Contract {
    const normalizedAddress = ethers.utils.getAddress(address);
    const pool = this.getOrCreateContractPool(normalizedAddress, abi);

    if (!this.poolingEnabled) {
      return pool[0];
    }

    const index = this.contractCallCounter++ % pool.length;

    this.trackProviderUsage(index);

    return pool[index];
  }

  getProvider(): ethers.providers.JsonRpcProvider {
    if (!this.poolingEnabled) {
      return this.providers[0];
    }

    const index = this.providerCallCounter++ % this.providers.length;
    return this.providers[index];
  }

  getAllProviders(): ethers.providers.JsonRpcProvider[] {
    return this.providers;
  }

  getPoolSize(): number {
    return this.providers.length;
  }

  isPoolingEnabled(): boolean {
    return this.poolingEnabled;
  }

  getPoolStats(): {
    totalContracts: number;
    providersCount: number;
    poolingEnabled: boolean;
  } {
    return {
      totalContracts: this.contractPools.size,
      providersCount: this.providers.length,
      poolingEnabled: this.poolingEnabled,
    };
  }
}
