import {
  Asset,
  Lbppool,
  LbppoolAssetsData,
  OmnipoolAssetData,
  Stableswap,
  StableswapAssetData,
  Xykpool,
  XykpoolAssetsData,
} from '../model';
import { RelayChainInfo } from '../parsers/types/common';

type ParachainBlockNumber = number;

export type BatchStatePayload = {
  relayChainInfo: Map<ParachainBlockNumber, RelayChainInfo>;

  assetIdsToSave: Set<string>;
  assetsAllBatch: Map<string, Asset>;

  xykPools: Map<string, Xykpool>;
  xykPoolAssetsData: Map<string, XykpoolAssetsData>;

  lbpPools: Map<string, Lbppool>;
  lbpPoolAssetsData: Map<string, LbppoolAssetsData>;

  omnipoolAssetsData: Map<string, OmnipoolAssetData>;

  stablepools: Map<string, Stableswap>;
  stablepoolAssetsData: Map<string, StableswapAssetData>;
};

export class BatchState {
  private statePayload: BatchStatePayload = {
    relayChainInfo: new Map(),
    assetIdsToSave: new Set(),
    assetsAllBatch: new Map(),
    xykPools: new Map(),
    xykPoolAssetsData: new Map(),
    lbpPools: new Map(),
    lbpPoolAssetsData: new Map(),
    omnipoolAssetsData: new Map(),
    stablepools: new Map(),
    stablepoolAssetsData: new Map(),
  };

  get state(): BatchStatePayload {
    return { ...this.statePayload };
  }

  set state(partialState: Partial<BatchStatePayload>) {
    this.statePayload = { ...this.statePayload, ...partialState };
  }

  getRelayChainBlockDataFromCache(paraBlockHeight: number): {
    height: number;
  } {
    const blockData = this.state.relayChainInfo.get(paraBlockHeight);

    return {
      height: blockData?.relaychainBlockNumber ?? 0,
    };
  }
}
