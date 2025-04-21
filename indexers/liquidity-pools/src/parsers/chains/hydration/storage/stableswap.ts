import { constants, storage } from '../typegenTypes/';
import {
  GetPoolAssetInfoInput,
  OmnipoolAssetTradability,
  StablepoolAssetState,
  StablepoolGetAllPoolIdsInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  StablepoolStorageData,
  XykGetPoolShareTokenPairsManyInput,
  XykPoolShareTokenPair,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getPoolData({
  poolId,
  block,
}: StablepoolGetPoolDataInput): Promise<StablepoolInfo | null> {
  let poolStorageData: StablepoolStorageData | null = null;
  let minTradingLimit = null;
  let amplificationRange = null;
  let minPoolLiquidity = null;

  if (storage.stableswap.pools.v183.is(block)) {
    const resp = await storage.stableswap.pools.v183.get(block, poolId);
    if (resp !== undefined) poolStorageData = resp;
  }

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

  if (
    poolStorageData === null ||
    minTradingLimit === null ||
    amplificationRange === null ||
    minPoolLiquidity === null
  )
    return null;

  return {
    ...poolStorageData,
    minTradingLimit,
    amplificationRange,
    minPoolLiquidity,
    maxInRatio: 0n,
    maxOutRatio: 0n,
  };

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

export default { getPoolData, getPoolAssetStorageData, getAllPoolIds };
