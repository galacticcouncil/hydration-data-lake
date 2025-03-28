// import { createClient, PolkadotClient, TypedApi } from 'polkadot-api';
// import { getWsProvider } from 'polkadot-api/dist/reexports/ws-provider_node';
// import { hydration } from '@polkadot-api/descriptors';
// import { AppConfig } from '../appConfig';
//
// export enum WsEvent {
//   CONNECTING,
//   CONNECTED,
//   ERROR,
//   CLOSE,
// }
//
// const appConfig = AppConfig.getInstance();
//
// export class PolkadotApiProvider {
//   private static instance: PolkadotApiProvider;
//
//   private apiClient: PolkadotClient | null = null;
//
//   static getInstance(): PolkadotApiProvider {
//     if (!PolkadotApiProvider.instance) {
//       PolkadotApiProvider.instance = new PolkadotApiProvider();
//     }
//     return PolkadotApiProvider.instance;
//   }
//
//   private initTypedApi() {
//     const wsProvider = getWsProvider(appConfig.RPC_URL!, (status) => {
//       switch (status.type) {
//         case WsEvent.CONNECTING:
//           console.log('Connecting... 🔌');
//           break;
//         case WsEvent.CONNECTED:
//           console.log(`Connected! ⚡ (${appConfig.RPC_URL})`);
//           break;
//         case WsEvent.ERROR:
//           console.log('Errored... 😢');
//           break;
//         case WsEvent.CLOSE:
//           console.log('Closed 🚪');
//           break;
//       }
//     });
//     this.apiClient = createClient(wsProvider);
//     return this.apiClient;
//   }
//
//   get client() {
//     if (!appConfig.RPC_URL) return null;
//     if (this.apiClient) return this.apiClient;
//     return this.initTypedApi();
//   }
//
//   get typedApi(): TypedApi<typeof hydration> | null {
//     if (!appConfig.RPC_URL) return null;
//     return this.client!.getTypedApi(hydration);
//   }
// }
