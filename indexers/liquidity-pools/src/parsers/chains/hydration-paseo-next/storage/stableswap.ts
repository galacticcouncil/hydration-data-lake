import { storage, constants } from '../typegenTypes/';
import {
  GetConstantsInput,
  GetDataAtBlockInput,
  GetPoolAssetInfoInput,
  OmnipoolAssetTradability,
  StablepoolAllPoolsInfoWithPoolId,
  StablepoolAssetState,
  StablepoolGetAllPoolIdsInput,
  StablepoolGetPoolDataInput,
  StablepoolGetPoolPegsInput,
  StablepoolInfo,
  StablepoolManyPoolsPegsInfoWithPoolId,
  StablepoolPoolPegsInfo,
  StablepoolStorageData,
  StableswapConstants,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { hexToString } from '@polkadot/util';
import { EmaOraclePeriod } from '../../../../model';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';
import { fetOracleNameFromStableswapPegsSource } from '../../hydration/utils';

function getConstants({ block }: GetConstantsInput): StableswapConstants {
  let minTradingLimit = null;
  let amplificationRange = null;
  let minPoolLiquidity = null;

  if (constants.stableswap.minTradingLimit.v324.is(block)) {
    const resp = constants.stableswap.minTradingLimit.v324.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }
  if (constants.stableswap.minPoolLiquidity.v324.is(block)) {
    const resp = constants.stableswap.minPoolLiquidity.v324.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.stableswap.amplificationRange.v324.is(block)) {
    const resp = constants.stableswap.amplificationRange.v324.get(block);
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
  if (storage.stableswap.pools.v324.is(block)) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.stableswap.pools.v324.get(block, poolId);
      if (resp !== undefined) return resp;
      return null;
    }, null);
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

async function getAllPoolsData({
  block,
}: GetDataAtBlockInput): Promise<StablepoolAllPoolsInfoWithPoolId[] | null> {
  if (block.specVersion < 324) return [];

  if (storage.stableswap.pools.v324.is(block) || block.specVersion >= 324) {
    return tryExecOrReturnFallback(async () => {
      const pairsPaged = [];

      try {
        for await (const page of storage.stableswap.pools.v324.getPairsPaged(
          500,
          block
        )) {
          pairsPaged.push(
            ...page
              .filter((p) => !!p && p[1] !== undefined && p[1] !== null)
              .map(([poolId, poolInfo]) => ({
                poolId,
                data: poolInfo!,
              }))
          );
        }
      } catch (e) {
        throw e;
      }
      return pairsPaged;
    }, []);
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

async function getPoolAssetStorageData({
  poolId,
  block,
  assetId,
}: GetPoolAssetInfoInput): Promise<StablepoolAssetState | null> {
  let tradable: OmnipoolAssetTradability | null = null;

  if (storage.stableswap.assetTradability.v324.is(block)) {
    // @ts-ignore
    return tryExecOrReturnFallback<StablepoolAssetState>(async () => {
      // TODO fix call - returns undefined in any case

      const resp = await storage.stableswap.assetTradability.v324.get(
        block,
        poolId!,
        assetId
      );
      if (resp !== undefined) tradable = resp;
    }, null);
  }

  if (tradable === null) return null;

  return {
    tradable,
  };
}

async function getAllPoolIds({
  block,
}: StablepoolGetAllPoolIdsInput): Promise<number[]> {
  if (block.specVersion < 324) return [];

  if (storage.stableswap.pools.v324.is(block)) {
    return tryExecOrReturnFallback(async () => {
      const ids = await storage.stableswap.pools.v324.getKeys(block);

      return ids;
    }, []);
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

async function getPoolPegs({
  poolId,
  block,
}: StablepoolGetPoolPegsInput): Promise<StablepoolPoolPegsInfo | null> {
  if (block.specVersion < 324) return null;

  if (storage.stableswap.poolPegs.v324.is(block) || block.specVersion >= 324) {
    return tryExecOrReturnFallback(async () => {
      const pegsInfo = await storage.stableswap.poolPegs.v324.get(
        block,
        poolId
      );

      if (!pegsInfo) return null;

      const res = {
        maxPegUpdate: pegsInfo.maxPegUpdate,
        current: pegsInfo.current,
        source: pegsInfo.source.map((s) => ({
          sourceKind: s.__kind,
          oracleName: fetOracleNameFromStableswapPegsSource(s),
          oraclePeriod:
            s.__kind === 'Oracle'
              ? (s.value[1].__kind as EmaOraclePeriod)
              : undefined,
          oracleAsset: s.__kind === 'Oracle' ? s.value[2] : undefined,
          valuePoints: s.__kind === 'Value' ? s.value : undefined,
        })),
      };
      return res;
    }, null);
  }

  throw new UnknownVersionError('storage.stableswap.poolPegs');
}

async function getAllPoolsPegs({
  block,
}: GetDataAtBlockInput): Promise<
  StablepoolManyPoolsPegsInfoWithPoolId[] | null
> {
  if (block.specVersion < 324) return null;

  if (storage.stableswap.poolPegs.v324.is(block) || block.specVersion >= 324) {
    return tryExecOrReturnFallback(async () => {
      const pairsPaged = [];

      try {
        for await (const page of storage.stableswap.poolPegs.v324.getPairsPaged(
          500,
          block
        )) {
          pairsPaged.push(
            ...page
              .filter((p) => !!p && p[1] !== undefined && p[1] !== null)
              .map(([poolId, pegsInfo]) => ({
                poolId,
                data: {
                  maxPegUpdate: pegsInfo!.maxPegUpdate,
                  current: pegsInfo!.current,
                  source: pegsInfo!.source.map((s) => ({
                    sourceKind: s.__kind,
                    oracleName: fetOracleNameFromStableswapPegsSource(s),
                    oraclePeriod:
                      s.__kind === 'Oracle'
                        ? (s.value[1].__kind as EmaOraclePeriod)
                        : undefined,
                    oracleAsset: s.__kind === 'Oracle' ? s.value[2] : undefined,
                    valuePoints: s.__kind === 'Value' ? s.value : undefined,
                  })),
                },
              }))
          );
        }
      } catch (e) {
        throw e;
      }

      return pairsPaged;
    }, null);
  }

  throw new UnknownVersionError('storage.stableswap.poolPegs');
}

export default {
  getPoolData,
  getPoolAssetStorageData,
  getAllPoolIds,
  getConstants,
  getPoolPegs,
  getAllPoolsData,
  getAllPoolsPegs,
};
