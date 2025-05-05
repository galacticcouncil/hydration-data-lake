import { storage, constants } from '../typegenTypes/';
import {
  GetConstantsInput,
  GetPoolAssetInfoInput,
  OmnipoolAssetTradability,
  StablepoolAssetState,
  StablepoolGetAllPoolIdsInput,
  StablepoolGetPoolDataInput,
  StablepoolGetPoolPegsInput,
  StablepoolInfo,
  StablepoolPoolPegsInfo,
  StablepoolStorageData,
  StableswapConstants,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { hexToString } from '@polkadot/util';
import { EmaOraclePeriod } from '../../../../model';

function getConstants({ block }: GetConstantsInput): StableswapConstants {
  let minTradingLimit = null;
  let amplificationRange = null;
  let minPoolLiquidity = null;

  if (constants.stableswap.minTradingLimit.v276.is(block)) {
    const resp = constants.stableswap.minTradingLimit.v276.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }
  if (constants.stableswap.minPoolLiquidity.v276.is(block)) {
    const resp = constants.stableswap.minPoolLiquidity.v276.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.stableswap.amplificationRange.v276.is(block)) {
    const resp = constants.stableswap.amplificationRange.v276.get(block);
    if (resp !== undefined) amplificationRange = [resp.start, resp.end];
  }

  return {
    minPoolLiquidity,
    minTradingLimit,
    amplificationRange,
  };
}

async function getPoolData({
  poolId,
  block,
}: StablepoolGetPoolDataInput): Promise<StablepoolInfo | null> {
  if (storage.stableswap.pools.v276.is(block)) {
    const resp = await storage.stableswap.pools.v276.get(block, poolId);
    if (resp !== undefined) return resp;
    return null;
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

async function getPoolAssetStorageData({
  poolId,
  block,
  assetId,
}: GetPoolAssetInfoInput): Promise<StablepoolAssetState | null> {
  let tradable: OmnipoolAssetTradability | null = null;

  if (storage.stableswap.assetTradability.v276.is(block)) {
    const resp = await storage.stableswap.assetTradability.v276.get(
      block,
      poolId!,
      assetId
    );
    if (resp !== undefined) tradable = resp;
  }

  if (tradable === null) return null;

  return {
    tradable,
  };
}

async function getAllPoolIds({
  block,
}: StablepoolGetAllPoolIdsInput): Promise<number[]> {
  if (block.specVersion < 276) return [];

  if (storage.stableswap.pools.v276.is(block)) {
    const ids = await storage.stableswap.pools.v276.getKeys(block);

    return ids;
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

async function getPoolPegs({
  poolId,
  block,
}: StablepoolGetPoolPegsInput): Promise<StablepoolPoolPegsInfo | null> {
  return null;
}

export default {
  getPoolData,
  getPoolAssetStorageData,
  getAllPoolIds,
  getConstants,
  getPoolPegs,
};
