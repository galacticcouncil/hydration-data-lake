import { BlockHeader } from '@subsquid/substrate-processor';

export enum RuntimeApiVersion {
  v264 = 'v264',
}

export enum RuntimeApiName {
  CurrenciesApi = 'CurrenciesApi',
  AaveTradeExecutor = 'AaveTradeExecutor',
}
export enum RpcCallName {
  EthCall = 'EthCall',
}

export enum RuntimeApiMethodName {
  account = 'account',
  accounts = 'accounts',
  synthAccountsMany = 'synthAccountsMany',
  pool = 'pool',
  pools = 'pools',
}

export enum RpcCallMethodName {
  balanceOf = 'balanceOf',
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

export type CurrenciesApiAccountsData = Array<{
  assetId: number;
  data: CurrenciesApiAccountData;
}>;

export type AaveTradeExecutorPoolsInput = {
  block: BlockHeader;
};
export type AaveTradeExecutorPoolInput = {
  block: BlockHeader;
  reserveId: number;
  aTokenId: number;
};

export type AaveTradeExecutorPoolData = {
  reserve: number;
  aToken: number;
  liquidityIn: bigint;
  liquidityOut: bigint;
};

export type AaveTradeExecutorPoolDataWithPoolId = {
  poolId: string;
  data: AaveTradeExecutorPoolData;
};
