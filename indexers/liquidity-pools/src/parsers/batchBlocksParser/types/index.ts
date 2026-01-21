import { RelayChainInfo } from '../../types/events';
import { SqdBlock, SqdExtrinsic } from '../../../processor';

export * from './assetRegistry';
export * from './lbp';
export * from './tokens';
export * from './balances';
export * from './dca';
export * from './omnipool';
export * from './omnipoolLiquidityMining';
export * from './omnipoolWarehouseLM';
export * from './stableswap';
export * from './xyk';
export * from './xykLiquidityMining';
export * from './otc';
export * from './broadcast';
export * from './hsm';
export * from './uniques';
export * from './liquidation';
export * from './support/eventData';
export * from './support/batchBlocksParsedDataScope';

export type EventId = string;

export type StoragePrefetchIdsGroup =
  | 'lbppoolAssetIdsForStoragePrefetch'
  | 'xykPoolIdsForStoragePrefetch'
  | 'omnipoolAssetIdsForStoragePrefetch'
  | 'stableswapIdsForStoragePrefetch';

export interface CallMetadata {
  name: string;
  id?: string;
  traceId?: string;
  // signer: string;
}

export type CallParsedData<T = undefined> = CallMetadata & {
  args?: T;
};

export type EventParsedData<T> = {
  name: string;
  metadata: EventMetadata;
  params: T;
};

export type ParsedEventCallData<
  E extends { metadata: EventMetadata },
  C extends { name: string },
> = {
  id: string;
  relayChainInfo: RelayChainInfo;
  eventData: E;
  callData: C;
};

export interface EventMetadata {
  id: EventId;
  traceId: string;
  name: string;
  indexInBlock: number;
  blockHeader: SqdBlock;
  extrinsic?: SqdExtrinsic;
}
