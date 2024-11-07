import {
  Account,
  Asset,
  LbpPool,
  LbpPoolOperation,
  PoolOperationType,
  XykPool,
  XykPoolOperation,
} from '../../../model';
import { BigNumber } from 'bignumber.js';

export function initLbpPoolOperation({
  eventId,
  hash,
  indexInBlock,
  account,
  assetIn,
  assetOut,
  amountIn,
  amountOut,
  feeAsset,
  feeAmount,
  operationType,
  pool,
  relayChainBlockHeight,
  paraChainBlockHeight,
}: {
  eventId: string;
  hash: string;
  indexInBlock: number;
  account: Account;
  assetIn: Asset;
  assetOut: Asset;
  amountIn: bigint;
  amountOut: bigint;
  feeAsset: Asset;
  feeAmount: bigint;
  operationType: PoolOperationType;
  pool: LbpPool;
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
}) {
  return new LbpPoolOperation({
    id: eventId,
    account: account,
    extrinsicHash: hash,
    indexInBlock,
    assetIn,
    assetInAmount: amountIn,
    assetInFee: feeAsset.id === assetIn.id ? feeAmount : BigInt(0),
    assetOut,
    assetOutAmount: amountOut,
    assetOutFee: feeAsset.id === assetOut.id ? feeAmount : BigInt(0),
    swapPrice: new BigNumber(amountIn.toString())
      .div(amountOut.toString())
      .toNumber(),
    pool: pool,
    relayChainBlockHeight,
    paraChainBlockHeight,
    type: operationType,
  });
}

export function initXykPoolOperation({
  eventId,
  hash,
  indexInBlock,
  account,
  assetIn,
  assetOut,
  amountIn,
  amountOut,
  feeAsset,
  feeAmount,
  operationType,
  pool,
  relayChainBlockHeight,
  paraChainBlockHeight,
}: {
  eventId: string;
  hash: string;
  indexInBlock: number;
  account: Account;
  assetIn: Asset;
  assetOut: Asset;
  amountIn: bigint;
  amountOut: bigint;
  feeAsset: Asset;
  feeAmount: bigint;
  operationType: PoolOperationType;
  pool: XykPool;
  relayChainBlockHeight: number;
  paraChainBlockHeight: number;
}) {
  return new XykPoolOperation({
    id: eventId,
    account: account,
    extrinsicHash: hash,
    indexInBlock,
    assetIn,
    assetInAmount: amountIn,
    assetInFee: feeAsset.id === assetIn.id ? feeAmount : BigInt(0),
    assetOut,
    assetOutAmount: amountOut,
    assetOutFee: feeAsset.id === assetOut.id ? feeAmount : BigInt(0),
    swapPrice: new BigNumber(amountIn.toString())
      .div(amountOut.toString())
      .toNumber(),
    pool: pool,
    relayChainBlockHeight,
    paraChainBlockHeight,
    type: operationType,
  });
}
