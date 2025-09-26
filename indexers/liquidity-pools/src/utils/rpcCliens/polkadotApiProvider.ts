import { ApiPromise, WsProvider } from '@polkadot/api';

export class PolkadotApiProvider {
  private apiClient: ApiPromise | null = null;

  constructor(private RPC_URL: string) {}

  private async initApi() {
    const wsProvider = new WsProvider(this.RPC_URL);
    this.apiClient = await ApiPromise.create({ provider: wsProvider });
  }

  async getClient() {
    if (!this.RPC_URL) return null;
    if (this.apiClient) return this.apiClient;
    await this.initApi();
    return this.apiClient;
  }
}
