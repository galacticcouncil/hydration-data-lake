import { createSdkContext } from '@galacticcouncil/sdk';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { SdkCtx, FarmClient } from '@galacticcouncil/sdk';
import { AppConfig } from '../appConfig';

const appConfig = AppConfig.getInstance();

export class GalacticCouncilSdkManager {
  private pdApi: ApiPromise | null = null;
  private sdkCtx: SdkCtx | null = null;
  private farmClient: FarmClient | null = null;

  async getPolkadotApi() {
    if (this.pdApi) return this.pdApi;

    if (!appConfig.RPC_URL)
      throw new Error(
        'RPC_URL must be defined for GalacticCouncil SDK Context'
      );
    const wsProvider = new WsProvider(
      appConfig.RPC_URL,
      2_500,
      {},
      60_000,
      102400,
      10 * 60_000
    );

    this.pdApi = await ApiPromise.create({
      provider: wsProvider,
    });

    return this.pdApi;
  }

  async getSdkCtx() {
    if (this.sdkCtx) return this.sdkCtx;

    this.sdkCtx = createSdkContext(await this.getPolkadotApi());

    return this.sdkCtx;
  }

  async getFarmClient() {
    if (this.farmClient) return this.farmClient;

    this.farmClient = new FarmClient(await this.getPolkadotApi());

    return this.farmClient;
  }
}
