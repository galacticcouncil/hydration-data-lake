import { ApiPromise, WsProvider } from '@polkadot/api';
import { TradeRouter, PoolService, PoolType } from '@galacticcouncil/sdk';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

export class HydrationSdkManager {
  private static instance: HydrationSdkManager;

  private traderRouterClient: TradeRouter | null = null;

  static getInstance(): HydrationSdkManager {
    if (!HydrationSdkManager.instance) {
      HydrationSdkManager.instance = new HydrationSdkManager();
    }
    return HydrationSdkManager.instance;
  }

  async init(atBlockHash?: string) {
    if (this.traderRouterClient) return this;
    const wsProvider = new WsProvider(appConfig.RPC_URL || '');
    const api = await ApiPromise.create({ provider: wsProvider });
    let apiAt = null;
    if (atBlockHash !== undefined) apiAt = await api.at(atBlockHash);

    const poolService = new PoolService((apiAt as ApiPromise) ?? api);
    await poolService.syncRegistry(); // Wait until pools initialized (optional), fallback to lazy init
    this.traderRouterClient = new TradeRouter(poolService);
    return this;
  }

  async getSpotPrice(assetIn: string, assetOut = '10') {
    if (!this.traderRouterClient) await this.init();
    return this.traderRouterClient!.getBestSpotPrice(assetIn, assetOut);
  }
}
