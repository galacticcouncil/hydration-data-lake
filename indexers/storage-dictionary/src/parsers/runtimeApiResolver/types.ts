import { BlockHeader } from '@subsquid/substrate-processor';

export enum RuntimeApiVersion {
  v264 = 'v264',
}

export enum RuntimeApiName {
  CurrenciesApi = 'CurrenciesApi',
}

export enum RuntimeApiMethodName {
  account = 'account',
  accounts = 'accounts',
}

export type CurrenciesApiAccountsInput = {
  block: BlockHeader;
  address: string;
};

export type CurrenciesApiAccountInput = {
  block: BlockHeader;
  address: string;
  assetId: number;
};

export type CurrenciesApiAccountData = {
  free: bigint;
  frozen: bigint;
  reserved: bigint;
};

export type CurrenciesApiAccountsData = {
  assetId: number;
  data: CurrenciesApiAccountData;
}[];
