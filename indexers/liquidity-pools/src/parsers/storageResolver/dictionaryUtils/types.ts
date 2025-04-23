import {
  LbpPool as LbpPoolGlq,
  Omnipool as OmnipoolGql,
  Stablepool as StablepoolGql,
  XykPool as XykPoolGlq,
} from './apiTypes/types';

export type PaginationConfig = {
  pageSize: number;
  offset: number;
};

export type PalletDictionaryCollectedData = {
  pallet: ProcessingPallets;
  data: LbpPoolGlq[] | StablepoolGql[] | XykPoolGlq[] | OmnipoolGql[];
};

export enum ProcessingPallets {
  LBP = 'LBP',
  XYK = 'XYK',
  STABLESWAP = 'STABLESWAP',
  OMNIPOOL = 'OMNIPOOL',
  AAVE = 'AAVE',
}
