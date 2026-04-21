import { constants, storage } from '../typegenTypes/';
import {
  AssetDetailsWithId,
  GetConstantsInput,
  GetDataAtBlockInput,
  OmnipoolAssetData,
  OmnipoolAssetDataWithId,
  OmnipoolAssetTradability,
  OmnipoolConstants,
  OmnipoolData,
  OmnipoolGetAllAssetIdsInput,
  OmnipoolGetAssetDataInput,
  OmnipoolGetHubAssetTradabilityInput,
  OmnipoolGetLiquidityPositionsInput,
  OmnipoolGetPoolDataInput,
  OmnipoolLiquidityPositionDataWithId,
  OmnipoolNftCollectionId,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';
import { getOmnipoolLiquidityPositionPriceDecorated } from '../../../../utils/helpers';

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

function getNftCollectionIdConstant({
  block,
}: GetDataAtBlockInput): OmnipoolNftCollectionId | null {
  if (block.specVersion < 123) return null;
  if (constants.omnipool.nftCollectionId.v123.is(block)) {
    const resp = constants.omnipool.nftCollectionId.v123.get(block);
    return {
      collectionId: resp.toString(),
    };
  }
  throw new UnknownVersionError('constants.omnipool.nftCollectionId');
}

async function getOmnipoolAssetData({
  assetId,
  block,
}: OmnipoolGetAssetDataInput): Promise<OmnipoolAssetData | null> {
  return measureStorageFetch({
    storageName: 'omnipool.assets.get',
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

async function getOmnipoolAllAssetsData({
  block,
}: GetDataAtBlockInput): Promise<OmnipoolAssetDataWithId[] | null> {
  return measureStorageFetch({
    storageName: 'omnipool.assets.getPairsPaged',
    originFn: 'getOmnipoolAllAssetsData',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 115) return null;

      if (storage.omnipool.assets.v115.is(block)) {
        try {
          const pairsPaged: OmnipoolAssetDataWithId[] = [];

          for await (const page of storage.omnipool.assets.v115.getPairsPaged(
            500,
            block
          ))
            pairsPaged.push(
              ...page
                .filter((p) => !!p && !!p[1])
                .map(([assetId, data]) => ({
                  assetId,
                  data: data ?? null,
                }))
            );
          return pairsPaged;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.omnipoolWarehouseLm.deposit');
    },
  });
}

async function getOmnipoolAllAssetIds({
  block,
}: OmnipoolGetAllAssetIdsInput): Promise<number[]> {
  return measureStorageFetch({
    storageName: 'omnipool.assets.getKeys',
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
    storageName: 'omnipool.hubAssetTradability.get',
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

async function getOmnipoolLiquidityPositions({
  block,
  positionIds,
}: OmnipoolGetLiquidityPositionsInput): Promise<
  OmnipoolLiquidityPositionDataWithId[] | null
> {
  return measureStorageFetch({
    storageName: 'omnipool.positions.getMany',
    originFn: 'getOmnipoolLiquidityPositions',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 115) return null;

      if (storage.omnipool.positions.v115.is(block)) {
        try {
          const resp = await storage.omnipool.positions.v115.getMany(
            block,
            positionIds.map((id) => BigInt(id))
          );

          const decoratedResp: OmnipoolLiquidityPositionDataWithId[] = [];
          positionIds.forEach((id, index) => {
            if (!resp[index]) {
              decoratedResp.push({ positionId: id, data: null });
            } else {
              decoratedResp.push({
                positionId: id,
                data: {
                  assetId: resp[index].assetId,
                  amount: resp[index].amount,
                  shares: resp[index].shares,
                  price: !Array.isArray(resp[index].price)
                    ? resp[index].price
                    : getOmnipoolLiquidityPositionPriceDecorated(
                        resp[index].price
                      ),
                },
              });
            }
          });
          return decoratedResp;
        } catch (e) {
          return null;
        }
      }
      if (storage.omnipool.positions.v123.is(block)) {
        try {
          const resp = await storage.omnipool.positions.v123.getMany(
            block,
            positionIds.map((id) => BigInt(id))
          );

          const decoratedResp: OmnipoolLiquidityPositionDataWithId[] = [];
          positionIds.forEach((id, index) => {
            if (!resp[index]) {
              decoratedResp.push({ positionId: id, data: null });
            } else {
              decoratedResp.push({
                positionId: id,
                data: {
                  assetId: resp[index].assetId,
                  amount: resp[index].amount,
                  shares: resp[index].shares,
                  price: !Array.isArray(resp[index].price)
                    ? resp[index].price
                    : getOmnipoolLiquidityPositionPriceDecorated(
                        resp[index].price
                      ),
                },
              });
            }
          });

          return decoratedResp;
        } catch (e) {
          console.log(e);
          return null;
        }
      }
      throw new UnknownVersionError('storage.omnipool.positions');
    },
  });
}

async function getAllOmnipoolLiquidityPositions({
  block,
}: GetDataAtBlockInput): Promise<OmnipoolLiquidityPositionDataWithId[] | null> {
  return measureStorageFetch({
    storageName: 'omnipool.positions.getPairsPaged',
    originFn: 'getAllOmnipoolLiquidityPositions',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 115) return null;

      if (storage.omnipool.positions.v115.is(block)) {
        try {
          const pairsPaged: OmnipoolLiquidityPositionDataWithId[] = [];

          for await (const page of storage.omnipool.positions.v115.getPairsPaged(
            500,
            block
          ))
            pairsPaged.push(
              ...page
                .filter((p) => !!p && !!p[1])
                .map(([positionId, positionData]) => ({
                  positionId: positionId.toString(),
                  data: !positionData
                    ? null
                    : {
                        assetId: positionData.assetId,
                        amount: positionData.amount,
                        shares: positionData.shares,
                        price: !Array.isArray(positionData.price)
                          ? positionData.price
                          : getOmnipoolLiquidityPositionPriceDecorated(
                              positionData.price
                            ),
                      },
                }))
            );
          return pairsPaged;
        } catch (e) {
          return null;
        }
      }
      if (storage.omnipool.positions.v123.is(block)) {
        try {
          const pairsPaged: OmnipoolLiquidityPositionDataWithId[] = [];

          for await (const page of storage.omnipool.positions.v123.getPairsPaged(
            500,
            block
          ))
            pairsPaged.push(
              ...page
                .filter((p) => !!p && !!p[1])
                .map(([positionId, positionData]) => ({
                  positionId: positionId.toString(),
                  data: !positionData
                    ? null
                    : {
                        assetId: positionData.assetId,
                        amount: positionData.amount,
                        shares: positionData.shares,
                        price: !Array.isArray(positionData.price)
                          ? positionData.price
                          : getOmnipoolLiquidityPositionPriceDecorated(
                              positionData.price
                            ),
                      },
                }))
            );
          return pairsPaged;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.omnipoolWarehouseLm.deposit');
    },
  });
}

export default {
  getOmnipoolAssetData,
  getOmnipoolAllAssetsData,
  getPoolData,
  getOmnipoolAllAssetIds,
  getOmnipoolHubAssetTradability,
  getConstants,
  getOmnipoolLiquidityPositions,
  getNftCollectionIdConstant,
  getAllOmnipoolLiquidityPositions,
};
