import { Contract, ContractInterface, ethers } from 'ethers';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

/**
 * Manages a pool of EVM contract instances across multiple RPC providers.
 * This class distributes contract calls across multiple RPC endpoints using round-robin
 * to avoid bottlenecks on a single provider.
 *
 * CONCURRENCY GUARANTEE:
 * - All requests ALWAYS receive a contract instance (no requests are declined)
 * - When concurrent calls exceed pool size, instances are safely reused
 * - Multiple parallel calls to the same contract instance are supported
 * - Load is distributed evenly across all available RPC providers
 *
 * Example with 3 providers and 100 concurrent calls:
 * - Each provider handles ~33 requests
 * - Requests queue at the provider/RPC level, not at the application level
 * - Better than single provider handling all 100 requests
 */
export class ContractsPoolManager {
  private static instance: ContractsPoolManager;

  // Pool of providers
  private providers: ethers.providers.JsonRpcProvider[] = [];

  // Contract pools - keyed by ABI reference, then by normalized address.
  // Keying on the ABI object identity prevents cache collisions when the same
  // address is used with different ABIs (e.g. HOLLAR as both an aToken and the
  // native stable token). Imported JSON ABIs are module singletons, so identity
  // equality is stable for the process lifetime.
  private contractPools: Map<ContractInterface, Map<string, Contract[]>> =
    new Map();

  // Atomic counter for round-robin contract distribution (thread-safe via Node.js event loop)
  private contractCallCounter = 0;

  // Atomic counter for round-robin provider distribution (thread-safe via Node.js event loop)
  private providerCallCounter = 0;

  // Distribution tracking for diagnostics
  private providerCallDistribution: Map<number, number> = new Map();
  private lastLogTime: number = Date.now();
  private readonly LOG_INTERVAL_MS = 10000; // Log stats every 10 seconds

  // Whether pooling is enabled
  private readonly poolingEnabled: boolean;

  private constructor() {
    this.poolingEnabled =
      appConfig.ENABLE_RPC_HTTPS_URLS_POOL &&
      appConfig.RPC_HTTPS_URLS_POOL.length > 0;

    if (this.poolingEnabled) {
      // Initialize multiple providers from the pool
      this.providers = appConfig.RPC_HTTPS_URLS_POOL.map(
        (url) => new ethers.providers.JsonRpcProvider(url)
      );

      // Initialize distribution tracking
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
      // Fallback to single provider
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

  /**
   * Get or create a pool of contract instances for a given address and ABI
   */
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

  /**
   * Track distribution statistics for diagnostics
   */
  private trackProviderUsage(providerIndex: number): void {
    if (!appConfig.ENABLE_RPC_POOL_DEBUG_LOGS) {
      return;
    }

    const currentCount = this.providerCallDistribution.get(providerIndex) || 0;
    this.providerCallDistribution.set(providerIndex, currentCount + 1);

    // Periodically log distribution stats
    const now = Date.now();
    if (now - this.lastLogTime >= this.LOG_INTERVAL_MS) {
      this.logDistributionStats();
      this.lastLogTime = now;
    }
  }

  /**
   * Log distribution statistics
   */
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

    // Check for imbalance
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
   * Get the next contract instance from the pool using round-robin with atomic counter
   *
   * IMPORTANT: This method ALWAYS returns a contract instance and NEVER declines requests.
   * When there are more concurrent calls than available contract instances in the pool,
   * instances will be safely reused. This is safe because:
   * - Contract instances are stateless for read operations
   * - Each call is independent and doesn't block others
   * - The underlying provider handles concurrent request queuing
   *
   * CONCURRENCY: Uses atomic counter increment (thread-safe in Node.js event loop).
   * Each concurrent call gets a unique sequential number, ensuring even distribution.
   *
   * Example: With 4 providers and 100 parallel calls:
   * - Calls 0,4,8,12... → Provider 0 (~25 requests)
   * - Calls 1,5,9,13... → Provider 1 (~25 requests)
   * - Calls 2,6,10,14... → Provider 2 (~25 requests)
   * - Calls 3,7,11,15... → Provider 3 (~25 requests)
   */
  getContract(address: string, abi: ContractInterface): Contract {
    const normalizedAddress = ethers.utils.getAddress(address);
    const pool = this.getOrCreateContractPool(normalizedAddress, abi);

    // If pooling is disabled, always return the first (and only) contract
    if (!this.poolingEnabled) {
      return pool[0];
    }

    // Atomic increment ensures thread-safe round-robin distribution
    // Post-increment: returns current value, then increments for next call
    const index = this.contractCallCounter++ % pool.length;

    // Track usage for diagnostics
    this.trackProviderUsage(index);

    return pool[index];
  }

  /**
   * Get the next provider from the pool using round-robin with atomic counter
   *
   * CONCURRENCY: Uses atomic counter increment (thread-safe in Node.js event loop).
   * Ensures even distribution of direct provider requests across all available providers.
   */
  getProvider(): ethers.providers.JsonRpcProvider {
    if (!this.poolingEnabled) {
      return this.providers[0];
    }

    // Atomic increment ensures thread-safe round-robin distribution
    const index = this.providerCallCounter++ % this.providers.length;
    return this.providers[index];
  }

  /**
   * Get all providers (useful for operations that need to check all providers)
   */
  getAllProviders(): ethers.providers.JsonRpcProvider[] {
    return this.providers;
  }

  /**
   * Get pool size
   */
  getPoolSize(): number {
    return this.providers.length;
  }

  /**
   * Check if pooling is enabled
   */
  isPoolingEnabled(): boolean {
    return this.poolingEnabled;
  }

  /**
   * Get statistics about contract pool usage
   */
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
