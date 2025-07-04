import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AssetDetailsWithId,
  GetPoolAssetInfoInput,
  OmnipoolAssetTradability,
  StablepoolAssetState,
  StablepoolGetAllPoolIdsInput,
  StablepoolGetPoolPegsInput,
  StablepoolPoolPegsInfo,
  StablepoolPoolPegsInfoWithPoolId,
  StablepoolWithDetails,
  XykPoolWithAssets,
} from '../types/storage';
import { storage } from '../../typegenTypes/';
import { UnknownVersionError } from '../../utils/errors';
import { AssetType, EmaOraclePeriod } from '../../model';
import { hexToString, stringToHex } from '@polkadot/util';
import { hexToStrWithNullCharCheck } from '../../utils/helpers';

function fetOracleNameFromPegsSource(data: any) {
  if (data.__kind === 'Oracle') return hexToString(data.value[0]);
  if (data.__kind === 'MMOracle') return data.value;
  return undefined;
}

async function getPoolsAll(
  block: BlockHeader
): Promise<StablepoolWithDetails[]> {
  let pairsPaged: StablepoolWithDetails[] = [];

  if (block.specVersion < 183) return [];

  if (storage.stableswap.pools.v183.is(block)) {
    for await (let page of storage.stableswap.pools.v183.getPairsPaged(
      500,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p)
          .map((pair) => ({
            poolId: pair[0],
            assetIds: pair[1]!.assets, // TODO fix types
            initialAmplification: pair[1]!.initialAmplification,
            finalAmplification: pair[1]!.finalAmplification,
            initialBlock: pair[1]!.initialBlock,
            finalBlock: pair[1]!.finalBlock,
            fee: pair[1]!.fee,
          }))
      );
    return pairsPaged;
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
        oracleName: fetOracleNameFromPegsSource(s),
        oraclePeriod:
          s.__kind === 'Oracle'
            ? (s.value[1].__kind as EmaOraclePeriod)
            : undefined,
        oracleAsset: s.__kind === 'Oracle' ? s.value[2] : undefined,
        valuePoints: s.__kind === 'Value' ? s.value : undefined,
      })),
    };
  }
  if (storage.stableswap.poolPegs.v323.is(block)) {
    const pegsInfo = await storage.stableswap.poolPegs.v323.get(block, poolId);

    if (!pegsInfo) return null;

    return {
      maxPegUpdate: pegsInfo.maxPegUpdate,
      current: pegsInfo.current,
      source: pegsInfo.source.map((s) => ({
        sourceKind: s.__kind,
        oracleName: fetOracleNameFromPegsSource(s),
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

async function getAllPoolsPegs({
  block,
}: StablepoolGetAllPoolIdsInput): Promise<StablepoolPoolPegsInfoWithPoolId[]> {
  let pairsPaged: StablepoolPoolPegsInfoWithPoolId[] = [];

  if (block.specVersion < 305) return [];

  if (storage.stableswap.poolPegs.v305.is(block) || block.specVersion === 305) {
    for await (let page of storage.stableswap.poolPegs.v305.getPairsPaged(
      500,
      block
    )) {
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map((pair) => ({
            poolId: pair[0]!,
            maxPegUpdate: pair[1]!.maxPegUpdate,
            current: pair[1]!.current,
            source: pair[1]!.source.map((s) => ({
              sourceKind: s.__kind,
              oracleName: fetOracleNameFromPegsSource(s),
              oraclePeriod:
                s.__kind === 'Oracle'
                  ? (s.value[1].__kind as EmaOraclePeriod)
                  : undefined,
              oracleAsset: s.__kind === 'Oracle' ? s.value[2] : undefined,
              valuePoints: s.__kind === 'Value' ? s.value : undefined,
            })),
          }))
      );
    }
    return pairsPaged;
  }
  if (storage.stableswap.poolPegs.v323.is(block) || block.specVersion === 323) {
    for await (let page of storage.stableswap.poolPegs.v323.getPairsPaged(
      500,
      block
    )) {
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map((pair) => ({
            poolId: pair[0]!,
            maxPegUpdate: pair[1]!.maxPegUpdate,
            current: pair[1]!.current,
            source: pair[1]!.source.map((s) => ({
              sourceKind: s.__kind,
              oracleName: fetOracleNameFromPegsSource(s),
              oraclePeriod:
                s.__kind === 'Oracle'
                  ? (s.value[1].__kind as EmaOraclePeriod)
                  : undefined,
              oracleAsset: s.__kind === 'Oracle' ? s.value[2] : undefined,
              valuePoints: s.__kind === 'Value' ? s.value : undefined,
            })),
          }))
      );
    }
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.stableswap.poolPegs');
}

export default {
  getPoolsAll,
  getPoolAssetStorageData,
  getAllPoolIds,
  getAllPoolsPegs,
  getPoolPegs,
};
