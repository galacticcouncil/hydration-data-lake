import {
  Asset,
  LbpPool,
  LbpPoolAssetsData,
  OmnipoolAssetData,
  Stablepool,
  StablepoolAssetData,
  XykPool,
  XykPoolAssetsData,
} from '../model';
import { RelayChainInfo } from '../parsers/types/common';

type ParachainBlockNumber = number;

export type BatchStatePayload = {
  relayChainInfo: Map<ParachainBlockNumber, RelayChainInfo>;

  assetIdsToSave: Set<string>;
  assetsAllBatch: Map<string, Asset>;

  xykPools: Map<string, XykPool>;
  xykPoolAssetsData: Map<string, XykPoolAssetsData>;

  lbpPools: Map<string, LbpPool>;
  lbpPoolAssetsData: Map<string, LbpPoolAssetsData>;

  omnipoolAssetsData: Map<string, OmnipoolAssetData>;

  stablepools: Map<string, Stablepool>;
  stablepoolAssetsData: Map<string, StablepoolAssetData>;
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
}
