import { constants, storage } from '../typegenTypes/';
import {
  GetConstantsInput,
  OmnipoolAssetData,
  OmnipoolAssetTradability,
  OmnipoolConstants,
  OmnipoolData,
  OmnipoolGetAllAssetIdsInput,
  OmnipoolGetAssetDataInput,
  OmnipoolGetHubAssetTradabilityInput,
  OmnipoolGetPoolDataInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

function getConstants({ block }: GetConstantsInput): OmnipoolConstants {
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

  return {
    burnProtocolFee,
    hdxAssetId,
    hubAssetId,
    maxInRatio,
    maxOutRatio,
    minPoolLiquidity,
    minTradingLimit,
    minWithdrawalFee,
  };
}

async function getOmnipoolAssetData({
  assetId,
  block,
}: OmnipoolGetAssetDataInput): Promise<OmnipoolAssetData | null> {
  return measureStorageFetch({
    storageName: 'omnipool.assets',
    originFn: 'getOmnipoolAssetData',
    blockHeight: block.height,
    args: { assetId },
    fn: async () => {
      if (block.specVersion < 115) return null;
      if (storage.omnipool.assets.v115.is(block) || block.specVersion >= 115) {
        try {
          const resp = await storage.omnipool.assets.v115.get(block, assetId);
          return resp ?? null;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.omnipool.assets');
    },
  });
}

async function getOmnipoolAllAssetIds({
  block,
}: OmnipoolGetAllAssetIdsInput): Promise<number[]> {
  return measureStorageFetch({
    storageName: 'omnipool.assets',
    originFn: 'getOmnipoolAllAssetIds',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 115) return [];

      if (storage.omnipool.assets.v115.is(block) || block.specVersion >= 115) {
        try {
          const resp = await storage.omnipool.assets.v115.getKeys(block);
          return resp;
        } catch (e) {
          return [];
        }
      }
      throw new UnknownVersionError('storage.omnipool.assets');
    },
  });
}

async function getPoolData({
  poolAddress,
  block,
}: OmnipoolGetPoolDataInput): Promise<OmnipoolData | null> {
  return {
    poolAddress,
    ...getConstants({ block }),
  };
}

async function getOmnipoolHubAssetTradability({
  block,
}: OmnipoolGetHubAssetTradabilityInput): Promise<OmnipoolAssetTradability | null> {
  return measureStorageFetch({
    storageName: 'omnipool.assets',
    originFn: 'getOmnipoolHubAssetTradability',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 115) return null;

      if (storage.omnipool.assets.v115.is(block) || block.specVersion >= 115) {
        try {
          const resp =
            await storage.omnipool.hubAssetTradability.v115.get(block);
          return resp ?? null;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.omnipool.hubAssetTradability');
    },
  });
}

export default {
  getOmnipoolAssetData,
  getPoolData,
  getOmnipoolAllAssetIds,
  getOmnipoolHubAssetTradability,
  getConstants,
};
