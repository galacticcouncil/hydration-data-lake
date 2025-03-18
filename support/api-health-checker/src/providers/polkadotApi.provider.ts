import { Injectable, Provider } from '@nestjs/common';
import { AppConfig } from '../config.module';
import { getWsProvider } from 'polkadot-api/ws-provider/node';

import { createClient, PolkadotClient, TypedApi } from 'polkadot-api';
import { hydration } from '@polkadot-api/descriptors';

export enum WsEvent {
  CONNECTING,
  CONNECTED,
  ERROR,
  CLOSE,
}

@Injectable()
export class PolkadotApiProvider {
  private apiClient: PolkadotClient | null = null;

  constructor(private env: AppConfig) {}

  private initTypedApi() {
    const wsProvider = getWsProvider(this.env.WSS_URL, (status) => {
      switch (status.type) {
        case WsEvent.CONNECTING:
          console.log('Connecting... 🔌');
          break;
        case WsEvent.CONNECTED:
          console.log(`Connected! ⚡ (${this.env.WSS_URL})`);
          break;
        case WsEvent.ERROR:
          console.log('Errored... 😢');
          break;
        case WsEvent.CLOSE:
          console.log('Closed 🚪');
          break;
      }
    });
    this.apiClient = createClient(wsProvider);
    return this.apiClient;
  }

  get client() {
    if (this.apiClient) return this.apiClient;
    return this.initTypedApi();
  }

  get typedApi(): TypedApi<typeof hydration> {
    return this.client.getTypedApi(hydration);
  }
}

export const PolkadotApiProviderToken = 'PolkadotApiProviderToken';

export const PolkadotApiProviderFactory: Provider = {
  provide: PolkadotApiProviderToken,
  useClass: PolkadotApiProvider,
};
