import { storage, constants } from '../typegenTypes/';
import {
  GetConstantsInput,
  GetDataAtBlockInput,
  GetPoolAssetInfoInput,
  OmnipoolAssetTradability,
  StablepoolAllPoolsInfoWithPoolId,
  StablepoolAssetState,
  StablepoolAssetStatesWithId,
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
import { getOracleNameFromStableswapPegsSource } from '../../hydration/utils';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

function getConstants({ block }: GetConstantsInput): StableswapConstants {
  let minTradingLimit = null;
  let amplificationRange = null;
  let minPoolLiquidity = null;

  if (constants.stableswap.minTradingLimit.v405.is(block)) {
    const resp = constants.stableswap.minTradingLimit.v405.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }
  if (constants.stableswap.minPoolLiquidity.v405.is(block)) {
    const resp = constants.stableswap.minPoolLiquidity.v405.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.stableswap.amplificationRange.v405.is(block)) {
    const resp = constants.stableswap.amplificationRange.v405.get(block);
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
  if (storage.stableswap.pools.v405.is(block)) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.stableswap.pools.v405.get(block, poolId);
      if (resp !== undefined) return resp;
      return null;
    }, null);
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

async function getAllPoolsData({
  block,
}: GetDataAtBlockInput): Promise<StablepoolAllPoolsInfoWithPoolId[] | null> {
  if (block.specVersion < 405) return [];

  if (storage.stableswap.pools.v405.is(block) || block.specVersion >= 405) {
    return tryExecOrReturnFallback(async () => {
      const pairsPaged = [];

      try {
        for await (const page of storage.stableswap.pools.v405.getPairsPaged(
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

  if (storage.stableswap.assetTradability.v405.is(block)) {
    // @ts-ignore
    return tryExecOrReturnFallback<StablepoolAssetState>(async () => {
      // TODO fix call - returns undefined in any case

      const resp = await storage.stableswap.assetTradability.v405.get(
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
  if (block.specVersion < 405) return [];

  if (storage.stableswap.pools.v405.is(block)) {
    return tryExecOrReturnFallback(async () => {
      const ids = await storage.stableswap.pools.v405.getKeys(block);

      return ids;
    }, []);
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

async function getPoolPegs({
  poolId,
  block,
}: StablepoolGetPoolPegsInput): Promise<StablepoolPoolPegsInfo | null> {
  if (block.specVersion < 405) return null;

  if (storage.stableswap.poolPegs.v405.is(block) || block.specVersion >= 405) {
    return tryExecOrReturnFallback(async () => {
      const pegsInfo = await storage.stableswap.poolPegs.v405.get(
        block,
        poolId
      );

      if (!pegsInfo) return null;

      const res = {
        maxPegUpdate: pegsInfo.maxPegUpdate,
        current: pegsInfo.current,
        source: pegsInfo.source.map((s) => ({
          sourceKind: s.__kind,
          oracleName: getOracleNameFromStableswapPegsSource(s),
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
  if (block.specVersion < 405) return null;

  if (storage.stableswap.poolPegs.v405.is(block) || block.specVersion >= 405) {
    return tryExecOrReturnFallback(async () => {
      const pairsPaged = [];

      try {
        for await (const page of storage.stableswap.poolPegs.v405.getPairsPaged(
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
                    oracleName: getOracleNameFromStableswapPegsSource(s),
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

async function getAllPoolsAssetsStorageData({
  block,
}: GetDataAtBlockInput): Promise<StablepoolAssetStatesWithId[] | null> {
  return measureStorageFetch({
    storageName: 'stableswap.assetTradability.get',
    originFn: 'getAllPoolsAssetsStorageData',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 405) return null;

      if (
        storage.stableswap.assetTradability.v405.is(block) ||
        block.specVersion >= 405
      ) {
        const pairsPageMap: Map<number, StablepoolAssetStatesWithId> =
          new Map();

        for await (const page of storage.stableswap.assetTradability.v405.getPairsPaged(
          500,
          block
        )) {
          for (const [[poolId, assetId], data] of page.filter(
            (p) => !!p && !!p[1]
          )) {
            if (!pairsPageMap.has(poolId))
              pairsPageMap.set(poolId, { poolId, assetStates: [] });

            pairsPageMap.get(poolId)!.assetStates.push({
              assetId: assetId,
              data: { tradable: { bits: data?.bits ?? 15 } },
            });
          }
        }

        return Array.from(pairsPageMap.values());
      }
      throw new UnknownVersionError('storage.stableswap.assetTradability');
    },
  });
}

export default {
  getPoolData,
  getPoolAssetStorageData,
  getAllPoolsAssetsStorageData,
  getAllPoolIds,
  getConstants,
  getPoolPegs,
  getAllPoolsData,
  getAllPoolsPegs,
};
