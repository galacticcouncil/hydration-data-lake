import {
  Aavepool,
  Asset,
  AssetHistoricalData,
  EmaOracle,
  Lbppool,
  LbppoolAssetsData,
  Omnipool,
  OmnipoolAssetData,
  Stableswap,
  StableswapAssetData,
  Xykpool,
  XykpoolAssetsData,
  Block,
  MmAggregatorOracle,
  AccountAssetBalanceHistoricalData,
  AccountMmPositionHistoricalData,
  Account,
} from '../model';
import { RelayChainInfo } from '../parsers/types/common';
import { MoneyMarketEvent } from '../handlers/evm/evmEventParser/utils/moneyMarketEvent';

type ParachainBlockNumber = number;

export type BatchStatePayload = {
  relayChainInfo: Map<ParachainBlockNumber, RelayChainInfo>;

  blocks: Map<number, Block>;

  accounts: Map<string, Account>;

  assetIdsToSave: Set<string>;
  assetsAllBatch: Map<string, Asset>;

  xykPools: Map<string, Xykpool>;
  xykPoolAssetsData: Map<string, XykpoolAssetsData>;
  xykPoolsProcessedBlocks: Set<number>;

  lbpPools: Map<string, Lbppool>;
  lbpPoolAssetsData: Map<string, LbppoolAssetsData>;
  lbpPoolsProcessedBlocks: Set<number>;

  omnipools: Map<string, Omnipool>;
  omnipoolAssetsData: Map<string, OmnipoolAssetData>;
  omnipoolsProcessedBlocks: Set<number>;

  stablepools: Map<string, Stableswap>;
  stablepoolAssetsData: Map<string, StableswapAssetData>;
  stablepoolsProcessedBlocks: Set<number>;

  emaOracles: Map<string, EmaOracle>;
  emaOraclesProcessedBlocks: Set<number>;

  mmAggregatorOracles: Map<string, MmAggregatorOracle>;
  mmAggregatorOraclesBlocks: Set<number>;

  assetHistoricalDataItems: Map<string, AssetHistoricalData>;
  assetHistoricalDataProcessedBlocks: Set<number>;

  aavepools: Map<string, Aavepool>;
  aavepoolsProcessedBlocks: Set<number>;

  accAssetBalanceHistData: Map<string, AccountAssetBalanceHistoricalData>;
  accAssetBalanceHistDataProcessedBlocks: Set<number>;

  accMmPositionHistData: Map<string, AccountMmPositionHistoricalData>;
  accMmPositionHistDataProcessedBlocks: Set<number>;

  moneyMarketEvents: Map<string, MoneyMarketEvent>;

  evmAccountExtensions: Map<string, string>;
};

export class BatchState {
  public state: BatchStatePayload = {
    relayChainInfo: new Map(),
    blocks: new Map(),

    accounts: new Map(),

    assetIdsToSave: new Set(),
    assetsAllBatch: new Map(),

    xykPools: new Map(),
    xykPoolAssetsData: new Map(),
    xykPoolsProcessedBlocks: new Set(),

    lbpPools: new Map(),
    lbpPoolAssetsData: new Map(),
    lbpPoolsProcessedBlocks: new Set(),

    omnipools: new Map(),
    omnipoolAssetsData: new Map(),
    omnipoolsProcessedBlocks: new Set(),

    stablepools: new Map(),
    stablepoolAssetsData: new Map(),
    stablepoolsProcessedBlocks: new Set(),

    emaOracles: new Map(),
    emaOraclesProcessedBlocks: new Set(),

    mmAggregatorOracles: new Map(),
    mmAggregatorOraclesBlocks: new Set(),

    assetHistoricalDataItems: new Map(),
    assetHistoricalDataProcessedBlocks: new Set(),

    aavepools: new Map(),
    aavepoolsProcessedBlocks: new Set(),

    accAssetBalanceHistData: new Map(),
    accAssetBalanceHistDataProcessedBlocks: new Set(),

    accMmPositionHistData: new Map(),
    accMmPositionHistDataProcessedBlocks: new Set(),

    moneyMarketEvents: new Map(),

    evmAccountExtensions: new Map(),
  };

  // get state(): BatchStatePayload {
  //   return { ...this.statePayload };
  // }
  //
  // set state(partialState: Partial<BatchStatePayload>) {
  //   this.statePayload = { ...this.statePayload, ...partialState };
  // }

  getRelayChainBlockDataFromCache(paraBlockHeight: number): {
    height: number;
  } {
    const blockData = this.state.blocks.get(paraBlockHeight);

    return {
      height: blockData?.relayBlockHeight ?? 0,
    };
  }
}
