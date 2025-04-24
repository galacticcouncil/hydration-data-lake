import { constants, storage } from '../typegenTypes/';
import {
  GetConstantsInput,
  GetPoolAssetInfoInput,
  OmnipoolAssetTradability,
  StablepoolAssetState,
  StablepoolGetAllPoolIdsInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  StablepoolStorageData,
  StableswapConstants,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

function getConstants({ block }: GetConstantsInput): StableswapConstants {
  let minTradingLimit = null;
  let amplificationRange = null;
  let minPoolLiquidity = null;

  if (constants.stableswap.minTradingLimit.v183.is(block)) {
    const resp = constants.stableswap.minTradingLimit.v183.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }
  if (constants.stableswap.minPoolLiquidity.v183.is(block)) {
    const resp = constants.stableswap.minPoolLiquidity.v183.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.stableswap.amplificationRange.v183.is(block)) {
    const resp = constants.stableswap.amplificationRange.v183.get(block);
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
  if (storage.stableswap.pools.v183.is(block)) {
    const resp = await storage.stableswap.pools.v183.get(block, poolId);
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
  const peg = ['1', '1'];

  if (storage.stableswap.assetTradability.v183.is(block)) {
    // TODO fix call - returns undefined in any case
    const resp = await storage.stableswap.assetTradability.v183.get(
      block,
      poolId!,
      assetId
    );
    if (resp !== undefined) tradable = resp;
  }

  // TODO add support storage.stableswap.poolPegs query

  if (tradable === null || peg === null) return null;

  return {
    tradable,
    peg,
  };
}

async function getAllPoolIds({
  block,
}: StablepoolGetAllPoolIdsInput): Promise<number[]> {
  if (block.specVersion < 183) return [];

  if (storage.stableswap.pools.v183.is(block)) {
    const ids = await storage.stableswap.pools.v183.getKeys(block);

    return ids;
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

export default {
  getPoolData,
  getPoolAssetStorageData,
  getAllPoolIds,
  getConstants,
};
