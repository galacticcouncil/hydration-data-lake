import {
  Lbppool as LbpPoolGlq,
  OmnipoolAssetDatum,
  Stableswap as StablepoolGql,
  Xykpool as XykPoolGlq,
} from './apiTypes/types';

export type PaginationConfig = {
  pageSize: number;
  offset: number;
};

export type PalletDictionaryCollectedData = {
  pallet: ProcessingPallets;
  data: LbpPoolGlq[] | StablepoolGql[] | XykPoolGlq[] | OmnipoolAssetDatum[];
};

export enum ProcessingPallets {
  LBP = 'LBP',
  XYK = 'XYK',
  STABLESWAP = 'STABLESWAP',
  OMNIPOOL = 'OMNIPOOL',
}
