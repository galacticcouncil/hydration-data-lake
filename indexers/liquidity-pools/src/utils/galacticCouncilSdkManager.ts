import { createWsClient } from 'polkadot-api/ws';
import { farm, client as sdkClient } from '@galacticcouncil/sdk-next';
import { AppConfig } from '../appConfig';

const appConfig = AppConfig.getInstance();

export class GalacticCouncilSdkManager {
  private pdClient: ReturnType<typeof createWsClient> | null = null;
  private _liquidityMiningApi: farm.LiquidityMiningApi | null = null;

  private async getPolkadotClient() {
    if (this.pdClient) return this.pdClient;

    if (!appConfig.RPC_URL)
      throw new Error(
        'RPC_URL must be defined for GalacticCouncil SDK Context'
      );

    this.pdClient = createWsClient(appConfig.RPC_URL);
    return this.pdClient;
  }

  async getLiquidityMiningApi(): Promise<farm.LiquidityMiningApi> {
    if (this._liquidityMiningApi) return this._liquidityMiningApi;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = (await this.getPolkadotClient()) as any;

    const params = new sdkClient.ChainParams(client);
    const blockTime = await params.getBlockTime();
    const farmClient = new farm.LiquidityMiningClient(client);
    const balance = new sdkClient.BalanceClient(client);

    this._liquidityMiningApi = new farm.LiquidityMiningApi(farmClient, balance, {
      blockTime,
    });
    return this._liquidityMiningApi;
  }
}
