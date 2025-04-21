import { storage, constants } from '../typegenTypes/';
import {
  OmnipoolAssetData,
  OmnipoolAssetTradability,
  OmnipoolData,
  OmnipoolGetAllAssetIdsInput,
  OmnipoolGetAssetDataInput,
  OmnipoolGetHubAssetTradabilityInput,
  OmnipoolGetPoolDataInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getOmnipoolAssetData({
  assetId,
  block,
}: OmnipoolGetAssetDataInput): Promise<OmnipoolAssetData | null> {
  if (storage.omnipool.assets.v276.is(block)) {
    const resp = await storage.omnipool.assets.v276.get(block, assetId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.omnipool.assets');
}

async function getOmnipoolAllAssetIds({
  block,
}: OmnipoolGetAllAssetIdsInput): Promise<number[]> {
  if (block.specVersion < 276) return [];

  if (storage.omnipool.assets.v276.is(block)) {
    const resp = await storage.omnipool.assets.v276.getKeys(block);

    return resp;
  }
  throw new UnknownVersionError('storage.omnipool.assets');
}

async function getPoolData({
  poolAddress,
  block,
}: OmnipoolGetPoolDataInput): Promise<OmnipoolData | null> {
  let burnProtocolFee = null;
  let hdxAssetId = null;
  let hubAssetId = null;
  let maxInRatio = null;
  let maxOutRatio = null;
  let minPoolLiquidity = null;
  let minTradingLimit = null;
  let minWithdrawalFee = null;

  // if (constants.omnipool.burnProtocolFee.v287.is(block)) {
  //   const resp = constants.omnipool.burnProtocolFee.v287.get(block);
  //   if (resp !== undefined) burnProtocolFee = resp;
  // }
  if (constants.omnipool.hdxAssetId.v276.is(block)) {
    const resp = constants.omnipool.hdxAssetId.v276.get(block);
    if (resp !== undefined) hdxAssetId = resp;
  }
  if (constants.omnipool.hubAssetId.v276.is(block)) {
    const resp = constants.omnipool.hubAssetId.v276.get(block);
    if (resp !== undefined) hubAssetId = resp;
  }
  if (constants.omnipool.maxInRatio.v276.is(block)) {
    const resp = constants.omnipool.maxInRatio.v276.get(block);
    if (resp !== undefined) maxInRatio = resp;
  }
  if (constants.omnipool.maxOutRatio.v276.is(block)) {
    const resp = constants.omnipool.maxOutRatio.v276.get(block);
    if (resp !== undefined) maxOutRatio = resp;
  }
  if (constants.omnipool.minimumPoolLiquidity.v276.is(block)) {
    const resp = constants.omnipool.minimumPoolLiquidity.v276.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.omnipool.minimumTradingLimit.v276.is(block)) {
    const resp = constants.omnipool.minimumTradingLimit.v276.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }
  if (constants.omnipool.minWithdrawalFee.v276.is(block)) {
    const resp = constants.omnipool.minWithdrawalFee.v276.get(block);
    if (resp !== undefined) minWithdrawalFee = resp;
  }

  if (
    burnProtocolFee === null ||
    hdxAssetId === null ||
    hubAssetId === null ||
    maxInRatio === null ||
    maxOutRatio === null ||
    minPoolLiquidity === null ||
    minTradingLimit === null ||
    minWithdrawalFee === null
  )
    return null;

  return {
    poolAddress,
    burnProtocolFee,
    hdxAssetId,
    hubAssetId,
    maxInRatio,
    maxOutRatio,
    minPoolLiquidity,
    minTradingLimit,
    minWithdrawalFee: BigInt(minWithdrawalFee),
  };
}

async function getOmnipoolHubAssetTradability({
  block,
}: OmnipoolGetHubAssetTradabilityInput): Promise<OmnipoolAssetTradability | null> {
  if (block.specVersion < 276) return null;

  if (storage.omnipool.assets.v276.is(block)) {
    const resp = await storage.omnipool.hubAssetTradability.v276.get(block);

    return resp ?? null;
  }
  throw new UnknownVersionError('storage.omnipool.hubAssetTradability');
}

export default {
  getOmnipoolAssetData,
  getOmnipoolAllAssetIds,
  getPoolData,
  getOmnipoolHubAssetTradability,
};
