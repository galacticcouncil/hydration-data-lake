import { Swap, SwapFee, SwapAssetBalance } from '../model';
import type * as base from '@subsquid/substrate-data';

export interface TransferEvent {
  id: string;
  traceIds: string[];
  assetId: number;
  blockNumber: number;
  timestamp: Date;
  from: string;
  to: string;
  amount: bigint;
  fee?: bigint;
}

export interface LBPPoolDataUpdate {
  owner: string;
  feeCollector: string;
  initialWeight: number;
  finalWeight: number;
  fee: [number, number];
  startBlockNumber?: number;
  endBlockNumber?: number;
  repayTarget?: bigint;
}

export interface PoolCreatedEvent {
  id: string;
  assetAId: number;
  assetBId: number;
  assetABalance: bigint;
  assetBBalance: bigint;
  createdAt: Date;
  createdAtParaBlock: number;
  lbpPoolData?: LBPPoolDataUpdate;
}

export interface FullExtrinsic extends base.Extrinsic {
  success: boolean;
  hash: base.Bytes;
}

export enum PoolType {
  XYK = 'Xyk',
  LBP = 'Lbp',
  Stable = 'Stableswap',
  Omni = 'Omnipool',
}

export enum NodeEnv {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
  SELF_HOSTED = 'self-hosted',
}

export enum ChainName {
  hydration = 'hydration',
  hydration_paseo = 'hydration_paseo',
  // hydration_paseo_next = 'hydration_paseo_next',
}

export enum TraceIdContext {
  call = 'call',
  event = 'event',
}
export type EventPhase = 'ApplyExtrinsic' | 'Initialization' | 'Finalization';

export enum TraceIdEventGroup {
  initialization = 'init',
  extrinsic = 'ext',
  finalization = 'fin',
}

export type GetNewSwapResponse = {
  swap: Swap;
  swapFees: SwapFee[];
  swapInputs: SwapAssetBalance[];
  swapOutputs: SwapAssetBalance[];
};

export type CallOriginValueRaw = {
  __kind: string;
  value?: string;
};

export type CallOriginRaw = {
  __kind: string;
  value?: CallOriginValueRaw;
};

export type CallOriginPartsDecorated = {
  kind: string;
  valueKind?: string;
  value?: string;
};

export type SwapFillerContextDetails = {
  xykSharedTokenId?: string;
  stablepoolId?: string;
  otcOrderId?: string;
};

export enum SwappedExecutionTypeKind {
  Batch = 'Batch',
  DCA = 'DCA',
  Omnipool = 'Omnipool',
  Router = 'Router',
  Xcm = 'Xcm',
  XcmExchange = 'XcmExchange',
}
