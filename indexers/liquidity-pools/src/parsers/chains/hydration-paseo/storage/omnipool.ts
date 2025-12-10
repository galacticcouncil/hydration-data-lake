import { storage, constants } from '../typegenTypes/';
import {
  GetConstantsInput,
  GetDataAtBlockInput,
  OmnipoolAssetData,
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
import BigNumber from 'bignumber.js';
import { getOmnipoolLiquidityPositionPriceDecorated } from '../../../../utils/helpers';

function getConstants({ block }: GetConstantsInput): OmnipoolConstants {
  const burnProtocolFee = null;
  let hdxAssetId = null;
  let hubAssetId = null;
  let maxInRatio = null;
  let maxOutRatio = null;
  let minPoolLiquidity = null;
  let minTradingLimit = null;
  let minWithdrawalFee = null;

  if (constants.omnipool.hdxAssetId.v287.is(block)) {
    const resp = constants.omnipool.hdxAssetId.v287.get(block);
    if (resp !== undefined) hdxAssetId = resp;
  }
  if (constants.omnipool.hubAssetId.v287.is(block)) {
    const resp = constants.omnipool.hubAssetId.v287.get(block);
    if (resp !== undefined) hubAssetId = resp;
  }
  if (constants.omnipool.maxInRatio.v287.is(block)) {
    const resp = constants.omnipool.maxInRatio.v287.get(block);
    if (resp !== undefined) maxInRatio = resp;
  }
  if (constants.omnipool.maxOutRatio.v287.is(block)) {
    const resp = constants.omnipool.maxOutRatio.v287.get(block);
    if (resp !== undefined) maxOutRatio = resp;
  }
  if (constants.omnipool.minimumPoolLiquidity.v287.is(block)) {
    const resp = constants.omnipool.minimumPoolLiquidity.v287.get(block);
    if (resp !== undefined) minPoolLiquidity = resp;
  }
  if (constants.omnipool.minimumTradingLimit.v287.is(block)) {
    const resp = constants.omnipool.minimumTradingLimit.v287.get(block);
    if (resp !== undefined) minTradingLimit = resp;
  }
  if (constants.omnipool.minWithdrawalFee.v287.is(block)) {
    const resp = constants.omnipool.minWithdrawalFee.v287.get(block);
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
  if (block.specVersion < 287) return null;
  if (constants.omnipool.nftCollectionId.v287.is(block)) {
    const resp = constants.omnipool.burnProtocolFee.v287.get(block);
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
  if (storage.omnipool.assets.v287.is(block)) {
    const resp = await storage.omnipool.assets.v287.get(block, assetId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.omnipool.assets');
}

async function getOmnipoolAllAssetIds({
  block,
}: OmnipoolGetAllAssetIdsInput): Promise<number[]> {
  if (block.specVersion < 287) return [];

  if (storage.omnipool.assets.v287.is(block)) {
    const resp = await storage.omnipool.assets.v287.getKeys(block);

    return resp;
  }
  throw new UnknownVersionError('storage.omnipool.assets');
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
  if (block.specVersion < 287) return null;

  if (storage.omnipool.assets.v287.is(block)) {
    const resp = await storage.omnipool.hubAssetTradability.v287.get(block);

    return resp ?? null;
  }
  throw new UnknownVersionError('storage.omnipool.hubAssetTradability');
}

async function getOmnipoolLiquidityPositions({
  block,
  positionIds,
}: OmnipoolGetLiquidityPositionsInput): Promise<
  OmnipoolLiquidityPositionDataWithId[] | null
> {
  return measureStorageFetch({
    storageName: 'omnipool.positions',
    originFn: 'getOmnipoolLiquidityPositions',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 287) return null;

      if (storage.omnipool.positions.v287.is(block)) {
        try {
          const resp = await storage.omnipool.positions.v287.getMany(
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
      throw new UnknownVersionError('storage.omnipool.positions');
    },
  });
}

async function getAllOmnipoolLiquidityPositions({
  block,
}: GetDataAtBlockInput): Promise<OmnipoolLiquidityPositionDataWithId[] | null> {
  return measureStorageFetch({
    storageName: 'storage.omnipool.positions',
    originFn: 'getAllPositionsData',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 287) return null;

      if (storage.omnipool.positions.v287.is(block)) {
        try {
          const pairsPaged: OmnipoolLiquidityPositionDataWithId[] = [];

          for await (const page of storage.omnipool.positions.v287.getPairsPaged(
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
  getOmnipoolAllAssetIds,
  getPoolData,
  getOmnipoolHubAssetTradability,
  getConstants,
  getNftCollectionIdConstant,
  getOmnipoolLiquidityPositions,
  getAllOmnipoolLiquidityPositions,
};
