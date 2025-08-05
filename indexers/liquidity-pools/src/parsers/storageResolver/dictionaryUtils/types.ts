import {
  Lbppool as LbppoolGlq,
  Omnipool as OmnipoolGql,
  Stableswap as StableswapGql,
  Xykpool as XykpoolGlq,
  Aavepool as AavepoolGlq,
  EmaOracle as EmaOracleGlq,
  AssetHistoricalDatum as AssetHistoricalDatumGql,
  MmAggregatorOracle as MmAggregatorOracleGql,
  AccountAssetBalanceHistoricalDatum as AccountAssetBalanceHistoricalDatumGql,
  AccountMmPositionHistoricalDatum as AccountMmPositionHistoricalDatumGql,
} from './apiTypes/types';

export type PaginationConfig = {
  pageSize: number;
  offset: number;
  topic: ProcessingTopic;
};

export type PalletDictionaryCollectedData = {
  pallet: ProcessingTopic;
  data:
    | LbppoolGlq[]
    | StableswapGql[]
    | XykpoolGlq[]
    | OmnipoolGql[]
    | AavepoolGlq[]
    | EmaOracleGlq[]
    | AssetHistoricalDatumGql[]
    | MmAggregatorOracleGql[]
    | AccountAssetBalanceHistoricalDatumGql[]
    | AccountMmPositionHistoricalDatumGql[];
};

// TODO  create fetching of each entity separately, update fetching function -> use the same dict URL for all generic entities
export enum ProcessingTopic {
  LBP = 'LBP',
  XYK = 'XYK',
  STABLESWAP = 'STABLESWAP',
  OMNIPOOL = 'OMNIPOOL',
  AAVE = 'AAVE',
  HSM = 'HSM',
  EMA_ORACLE = 'EMA_ORACLE',
  MM_AGGREGATOR_ORACLE = 'MM_AGGREGATOR_ORACLE',
  ASSET_HIST_DATA = 'ASSET_HIST_DATA',
  GENERIC_HIST_DATA = 'GENERIC_HIST_DATA',
  ACCOUNT_HIST_DATA = 'ACCOUNT_HIST_DATA',
}
