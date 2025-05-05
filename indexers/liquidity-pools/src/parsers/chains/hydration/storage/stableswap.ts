import { constants, storage } from '../typegenTypes/';
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
import { hexToString, stringToHex } from '@polkadot/util';
import { EmaOraclePeriod } from '../../../../model';

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

  if (storage.stableswap.assetTradability.v183.is(block)) {
    // TODO fix call - returns undefined in any case
    const resp = await storage.stableswap.assetTradability.v183.get(
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
  if (block.specVersion < 183) return [];

  if (storage.stableswap.pools.v183.is(block)) {
    const ids = await storage.stableswap.pools.v183.getKeys(block);

    return ids;
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

async function getPoolPegs({
  poolId,
  block,
}: StablepoolGetPoolPegsInput): Promise<StablepoolPoolPegsInfo | null> {
  if (block.specVersion < 305) return null;

  if (storage.stableswap.poolPegs.v305.is(block)) {
    const pegsInfo = await storage.stableswap.poolPegs.v305.get(block, poolId);

    if (!pegsInfo) return null;

    return {
      maxPegUpdate: pegsInfo.maxPegUpdate,
      current: pegsInfo.current,
      source: pegsInfo.source.map((s) => ({
        sourceKind: s.__kind,
        oracleName: s.__kind === 'Oracle' ? hexToString(s.value[0]) : undefined,
        oraclePeriod:
          s.__kind === 'Oracle'
            ? (s.value[1].__kind as EmaOraclePeriod)
            : undefined,
        oracleAsset: s.__kind === 'Oracle' ? s.value[2] : undefined,
        valuePoints: s.__kind === 'Value' ? s.value : undefined,
      })),
    };
  }

  throw new UnknownVersionError('storage.stableswap.poolPegs');
}

export default {
  getPoolData,
  getPoolAssetStorageData,
  getAllPoolIds,
  getConstants,
  getPoolPegs,
};
