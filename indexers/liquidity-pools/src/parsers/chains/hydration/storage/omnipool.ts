import { constants, storage } from '../typegenTypes/';
import {
  OmnipoolAssetData,
  OmnipoolData,
  OmnipoolGetAssetDataInput,
  OmnipoolGetPoolDataInput,
} from '../../../types/storage';

async function getOmnipoolAssetData({
  assetId,
  block,
}: OmnipoolGetAssetDataInput): Promise<OmnipoolAssetData | null> {
  let assetData = null;
  let tradable = null;

  if (storage.omnipool.assets.v115.is(block)) {
    const resp = await storage.omnipool.assets.v115.get(block, assetId);
    if (!resp) return null;
    assetData = resp;
  }
  if (storage.omnipool.hubAssetTradability.v115.is(block)) {
    const resp = await storage.omnipool.hubAssetTradability.v115.get(block);
    if (resp) tradable = resp;
  }

  if (assetData === null || tradable === null) return null;

  return {
    ...assetData,
    tradable,
  };
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

  if (constants.omnipool.burnProtocolFee.v287.is(block)) {
    const resp = constants.omnipool.burnProtocolFee.v287.get(block);
    if (resp !== undefined) burnProtocolFee = resp;
  }
  if (constants.omnipool.hdxAssetId.v115.is(block)) {
    const resp = constants.omnipool.hdxAssetId.v115.get(block);
    if (resp !== undefined) hdxAssetId = resp;
  }
  if (constants.omnipool.hubAssetId.v115.is(block)) {
    const resp = constants.omnipool.hubAssetId.v115.get(block);
    if (resp !== undefined) hubAssetId = resp;
  }
  if (constants.omnipool.maxInRatio.v115.is(block)) {
    const resp = constants.omnipool.maxInRatio.v115.get(block);
    if (resp !== undefined) maxInRatio = resp;
  }
  if (constants.omnipool.maxOutRatio.v115.is(block)) {
    const resp = constants.omnipool.maxOutRatio.v115.get(block);
    if (resp !== undefined) maxOutRatio = resp;
  }
  if (constants.omnipool.minimumPoolLiquidity.v115.is(block)) {
    const resp = constants.omnipool.minimumPoolLiquidity.v115.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.omnipool.minimumTradingLimit.v115.is(block)) {
    const resp = constants.omnipool.minimumTradingLimit.v115.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }
  if (constants.omnipool.minWithdrawalFee.v148.is(block)) {
    const resp = constants.omnipool.minWithdrawalFee.v148.get(block);
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

export default { getOmnipoolAssetData, getPoolData };
