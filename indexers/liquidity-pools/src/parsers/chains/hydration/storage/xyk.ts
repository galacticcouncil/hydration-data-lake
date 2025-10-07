import { storage, constants } from '../typegenTypes/';
import {
  GetConstantsInput,
  XykConstants,
  XykGetAssetsInput,
  XykGetPoolShareTokenPairsManyInput,
  XykGetShareTokenInput,
  XykPoolAssetIds,
  XykPoolData,
  XykPoolShareTokenPair,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

function getConstants({ block }: GetConstantsInput): XykConstants {
  let exchangeFee = null;
  let maxInRatio = null;
  let maxOutRatio = null;
  let minPoolLiquidity = null;
  let minTradingLimit = null;
  let nativeAssetId = null;
  let oracleSource = null;

  if (constants.xyk.getExchangeFee.v183.is(block)) {
    const resp = constants.xyk.getExchangeFee.v183.get(block);
    if (resp) exchangeFee = resp;
  }
  if (constants.xyk.maxInRatio.v183.is(block)) {
    const resp = constants.xyk.maxInRatio.v183.get(block);
    if (resp !== undefined) maxInRatio = resp;
  }
  if (constants.xyk.maxOutRatio.v183.is(block)) {
    const resp = constants.xyk.maxOutRatio.v183.get(block);
    if (resp !== undefined) maxOutRatio = resp;
  }
  if (constants.xyk.minPoolLiquidity.v183.is(block)) {
    const resp = constants.xyk.minPoolLiquidity.v183.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.xyk.minTradingLimit.v183.is(block)) {
    const resp = constants.xyk.minTradingLimit.v183.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }
  if (constants.xyk.nativeAssetId.v183.is(block)) {
    const resp = constants.xyk.nativeAssetId.v183.get(block);
    if (resp !== undefined) nativeAssetId = resp;
  }
  if (constants.xyk.oracleSource.v193.is(block)) {
    const resp = constants.xyk.oracleSource.v193.get(block);
    if (resp !== undefined) oracleSource = resp;
  }

  return {
    exchangeFee,
    maxInRatio,
    maxOutRatio,
    minPoolLiquidity,
    minTradingLimit,
    nativeAssetId,
    oracleSource,
  };
}

async function getPoolAssets({
  block,
  poolAddress,
}: XykGetAssetsInput): Promise<XykPoolAssetIds | null> {
  return measureStorageFetch({
    storageName: 'xyk.poolAssets',
    originFn: 'getPoolAssets',
    blockHeight: block.height,
    args: { poolAddress },
    fn: async () => {
      if (block.specVersion < 183) return null;

      if (storage.xyk.poolAssets.v183.is(block) || block.specVersion >= 183) {
        return tryExecOrReturnFallback(async () => {
          const resp = await storage.xyk.poolAssets.v183.get(
            block,
            poolAddress
          );

          if (!resp) return null;

          const [assetAId, assetBId] = resp;

          return {
            assetAId,
            assetBId,
            poolAddress,
          };
        }, null);
      }

      throw new UnknownVersionError('storage.xyk.poolAssets');
    },
  });
}

async function getPoolData({
  block,
  poolAddress,
}: XykGetAssetsInput): Promise<XykPoolData | null> {
  return measureStorageFetch({
    storageName: 'xyk.poolAssets',
    originFn: 'getPoolData',
    blockHeight: block.height,
    args: { poolAddress },
    fn: async () => {
      if (block.specVersion < 183) return null;

      let poolAssetIds: XykPoolAssetIds | null = null;

      if (storage.xyk.poolAssets.v183.is(block) || block.specVersion >= 183) {
        return tryExecOrReturnFallback(async () => {
          const resp = await storage.xyk.poolAssets.v183.get(
            block,
            poolAddress
          );
          if (resp) {
            const [assetAId, assetBId] = resp;

            poolAssetIds = {
              assetAId,
              assetBId,
              poolAddress,
            };

            return poolAssetIds;
          }
          return null;
        }, null);
      }
      throw new UnknownVersionError('storage.xyk.poolAssets');
    },
  });
}

async function getShareToken({
  block,
  poolAddress,
}: XykGetShareTokenInput): Promise<number | null> {
  return measureStorageFetch({
    storageName: 'xyk.shareToken',
    originFn: 'getShareToken',
    blockHeight: block.height,
    args: { poolAddress },
    fn: async () => {
      if (block.specVersion < 183) return null;

      if (storage.xyk.shareToken.v183.is(block) || block.specVersion >= 183) {
        return tryExecOrReturnFallback(async () => {
          const resp = await storage.xyk.shareToken.v183.get(
            block,
            poolAddress
          );

          if (resp === undefined) return null;

          return resp;
        }, null);
      }

      throw new UnknownVersionError('storage.xyk.shareToken');
    },
  });
}

async function getPoolShareTokenPairsMany({
  block,
}: XykGetPoolShareTokenPairsManyInput): Promise<XykPoolShareTokenPair[]> {
  return measureStorageFetch({
    storageName: 'xyk.shareToken',
    originFn: 'getPoolShareTokenPairsMany',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 183) return [];

      if (storage.xyk.shareToken.v183.is(block) || block.specVersion >= 183) {
        return tryExecOrReturnFallback(async () => {
          const pairsPaged = [];

          try {
            for await (const page of storage.xyk.shareToken.v183.getPairsPaged(
              500,
              block
            )) {
              pairsPaged.push(
                ...page
                  .filter((p) => !!p && !!p[1])
                  .map(
                    ([poolId, shareTokenId]): XykPoolShareTokenPair => ({
                      poolId,
                      shareTokenId: shareTokenId!,
                    })
                  )
              );
            }
          } catch (e) {
            throw e;
          }

          return pairsPaged;
        }, []);
      }

      throw new UnknownVersionError('storage.xyk.shareToken');
    },
  });
}

export default {
  getPoolAssets,
  getShareToken,
  getPoolShareTokenPairsMany,
  getPoolData,
  getConstants,
};
