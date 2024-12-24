import {
  Swap,
  SwapFee,
  SwapInputAssetBalance,
  SwapOutputAssetBalance,
} from '../model';
import type * as base from '@subsquid/substrate-data';
import { getCallOriginParts } from './helpers';

export interface TransferEvent {
  id: string;
  traceIds: string[];
  assetId: number;
  blockNumber: number;
  timestamp: Date;
  extrinsicHash?: string;
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
}

export enum TraceIdContext {
  call = 'call',
  event = 'event',
}
export type EventPhase = 'ApplyExtrinsic' | 'Initialization' | 'Finalization';

export enum TraceIdEventGroup {
  init = 'init',
  extrinsic = 'extrinsic',
  finalization = 'finalization',
  buyback = 'buyback',
}

export type GetNewSwapResponse = {
  swap: Swap;
  swapFees: SwapFee[];
  swapInputs: SwapInputAssetBalance[];
  swapOutputs: SwapOutputAssetBalance[];
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
