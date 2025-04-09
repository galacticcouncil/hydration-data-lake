import { storage, constants } from '../typegenTypes/';
import {
  XykGetAssetsInput,
  XykGetShareTokenInput,
  XykPoolAssetIds,
  XykPoolData,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getPoolAssets({
  block,
  poolAddress,
}: XykGetAssetsInput): Promise<XykPoolAssetIds | null> {
  if (block.specVersion < 276) return null;

  if (storage.xyk.poolAssets.v276.is(block)) {
    const resp = await storage.xyk.poolAssets.v276.get(block, poolAddress);

    if (!resp) return null;

    const [assetAId, assetBId] = resp;

    return {
      assetAId,
      assetBId,
      poolAddress,
    };
  }

  throw new UnknownVersionError('storage.xyk.poolAssets');
}

async function getPoolData({
  block,
  poolAddress,
}: XykGetAssetsInput): Promise<XykPoolData | null> {
  if (block.specVersion < 183) return null;

  let poolAssetIds: XykPoolAssetIds | null = null;
  let poolExchangeFee = null;
  let poolMaxInRatio = null;
  let poolMaxOutRatio = null;
  let poolMinPoolLiquidity = null;
  let poolMinTradingLimit = null;
  let poolNativeAssetId = null;
  let poolOracleSource = null;

  if (storage.xyk.poolAssets.v276.is(block)) {
    const resp = await storage.xyk.poolAssets.v276.get(block, poolAddress);
    if (resp) {
      const [assetAId, assetBId] = resp;

      poolAssetIds = {
        assetAId,
        assetBId,
        poolAddress,
      };
    }
  }
  if (constants.xyk.getExchangeFee.v276.is(block)) {
    const resp = constants.xyk.getExchangeFee.v276.get(block);
    if (resp !== undefined) poolExchangeFee = resp;
  }
  if (constants.xyk.maxInRatio.v276.is(block)) {
    const resp = constants.xyk.maxInRatio.v276.get(block);
    if (resp !== undefined) poolMaxInRatio = resp;
  }
  if (constants.xyk.maxOutRatio.v276.is(block)) {
    const resp = constants.xyk.maxOutRatio.v276.get(block);
    if (resp !== undefined) poolMaxOutRatio = resp;
  }
  if (constants.xyk.minPoolLiquidity.v276.is(block)) {
    const resp = constants.xyk.minPoolLiquidity.v276.get(block);
    if (resp !== undefined) poolMinPoolLiquidity = resp;
  }
  if (constants.xyk.minTradingLimit.v276.is(block)) {
    const resp = constants.xyk.minTradingLimit.v276.get(block);
    if (resp !== undefined) poolMinTradingLimit = resp;
  }
  if (constants.xyk.nativeAssetId.v276.is(block)) {
    const resp = constants.xyk.nativeAssetId.v276.get(block);
    if (resp !== undefined) poolNativeAssetId = resp;
  }
  if (constants.xyk.oracleSource.v276.is(block)) {
    const resp = constants.xyk.oracleSource.v276.get(block);
    if (resp !== undefined) poolOracleSource = resp;
  }

  if (
    poolAssetIds === null ||
    poolExchangeFee === null ||
    poolMaxInRatio === null ||
    poolMaxOutRatio === null ||
    poolMinPoolLiquidity === null ||
    poolMinTradingLimit === null ||
    poolNativeAssetId === null ||
    poolOracleSource === null
  )
    return null;

  return {
    ...poolAssetIds,
    exchangeFee: poolExchangeFee,
    maxInRatio: poolMaxInRatio,
    maxOutRatio: poolMaxOutRatio,
    minPoolLiquidity: poolMinPoolLiquidity,
    minTradingLimit: poolMinTradingLimit,
    nativeAssetId: poolNativeAssetId,
    oracleSource: poolOracleSource,
  };

  throw new UnknownVersionError('storage.xyk.poolData');
}

async function getShareToken({
  block,
  poolAddress,
}: XykGetShareTokenInput): Promise<number | null> {
  if (block.specVersion < 276) return null;

  if (storage.xyk.shareToken.v276.is(block)) {
    const resp = await storage.xyk.shareToken.v276.get(block, poolAddress);

    if (resp === undefined) return null;

    return resp;
  }

  throw new UnknownVersionError('storage.xyk.shareToken');
}

export default { getPoolAssets, getShareToken, getPoolData };
