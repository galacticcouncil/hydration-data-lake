import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import { formatBalance } from '@polkadot/util';
import { ApiDecoration } from '@polkadot/api/types';

export class PolkadotApiManager {
  apiClient: ApiPromise | null = null;
  apiClientAtBlock: ApiDecoration<'promise'> | null = null;
  wsClient: WsProvider | null = null;
  readonly blockHash: string | null = null;
  readonly nodeUrl: string =
    process.env.RPC_HYDRATION_URL || 'ws://127.0.0.1:9944/';

  constructor({
    blockHash,
    nodeUrl,
  }: {
    blockHash?: string;
    nodeUrl?: string;
  }) {
    this.blockHash = blockHash || null;
    this.nodeUrl = nodeUrl ?? this.nodeUrl;
  }

  async getApiClient(): Promise<ApiPromise | ApiDecoration<'promise'>> {
    if (this.apiClientAtBlock) return this.apiClientAtBlock;
    if (this.apiClient) return this.apiClient;

    const rpcEndpoint = this.nodeUrl;
    let provider;
    if (rpcEndpoint.startsWith('http'))
      provider = new HttpProvider(rpcEndpoint);
    else {
      provider = new WsProvider(rpcEndpoint);
      this.wsClient = provider;
    }

    this.apiClient = await ApiPromise.create({ provider });

    formatBalance.setDefaults({
      decimals: this.apiClient.registry.chainDecimals,
      unit: this.apiClient.registry.chainTokens,
    });

    if (!this.blockHash) return this.apiClient;

    this.apiClientAtBlock = await this.apiClient.at(this.blockHash);
    return this.apiClientAtBlock;
  }
}
