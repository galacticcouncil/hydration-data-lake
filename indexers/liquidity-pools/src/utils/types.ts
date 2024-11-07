import { LbpPoolOperation } from '../model';
import type * as base from '@subsquid/substrate-data';

export interface TransferEvent {
  id: string;
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

export interface ProcessorBlockData {
  timestamp: Date | null;
  paraChainBlockHeight: number;
  relayChainBlockHeight: number | null;
  swaps: LbpPoolOperation[];
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
}

export enum ChainName {
  hydration = 'hydration',
  hydration_paseo = 'hydration_paseo',
}
