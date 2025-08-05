import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import {
  AssetDetails,
  AssetDetailsWithId,
  AssetExistentialDeposit,
  Erc20AssetContractDetails,
  GetDataAtBlockInput,
} from '../../../types/storage';
import { hexToStrWithNullCharCheck } from '../../../../utils/helpers';
import { AssetType } from '../../../../model';
import { UnknownVersionError } from '../../../../utils/errors';
import { getErc20AssetContractFromLocation } from '../utils';

async function getAsset(
  assetId: string | number,
  block: BlockHeader
): Promise<AssetDetails | null> {
  if (block.specVersion < 287) return null;

  if (storage.assetRegistry.assets.v287.is(block)) {
    const resp = await storage.assetRegistry.assets.v287.get(block, +assetId);

    return !resp
      ? null
      : {
          name: hexToStrWithNullCharCheck(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          symbol: hexToStrWithNullCharCheck(resp.symbol),
          decimals: resp.decimals,
          isSufficient: resp.isSufficient,
        };
  }

  throw new UnknownVersionError('storage.assetRegistry.assets');
}

async function getAssetMany(
  assetIds: Array<string | number>,
  block: BlockHeader
): Promise<Array<AssetDetailsWithId>> {
  if (block.specVersion < 287) return [];

  if (storage.assetRegistry.assets.v287.is(block)) {
    const resp = await storage.assetRegistry.assets.v287.getMany(
      block,
      assetIds.map((id) => +id)
    );
    if (!resp) return [];

    const decoratedResp: AssetDetailsWithId[] = [];
    assetIds.forEach((assetId, index) => {
      if (!resp[index]) {
        decoratedResp.push({ assetId: +assetId, data: null });
      } else {
        decoratedResp.push({
          assetId: +assetId,
          data: {
            name: hexToStrWithNullCharCheck(resp[index].name),
            assetType: resp[index].assetType.__kind as AssetType,
            existentialDeposit: resp[index].existentialDeposit,
            xcmRateLimit: resp[index].xcmRateLimit,
            symbol: hexToStrWithNullCharCheck(resp[index].symbol),
            decimals: resp[index].decimals,
            isSufficient: resp[index].isSufficient,
          },
        });
      }
    });
    return decoratedResp;
  }

  throw new UnknownVersionError('storage.assetRegistry.assets');
}

async function getAssetAll(
  block: BlockHeader
): Promise<Array<AssetDetailsWithId>> {
  if (block.specVersion < 287) return [];

  if (storage.assetRegistry.assets.v287.is(block)) {
    const pairsPaged = [];

    for await (const page of storage.assetRegistry.assets.v287.getPairsPaged(
      100,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map(([assetId, assetData]) => ({
            assetId: +assetId,
            data: {
              name: hexToStrWithNullCharCheck(assetData!.name),
              assetType: assetData!.assetType.__kind as AssetType,
              existentialDeposit: assetData!.existentialDeposit,
              xcmRateLimit: assetData!.xcmRateLimit,
              symbol: hexToStrWithNullCharCheck(assetData!.symbol),
              decimals: assetData!.decimals,
              isSufficient: true,
            },
          }))
      );
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.assetRegistry.assets [getPairsPaged]');
}

async function getErc20AssetContractAddress(
  assetId: string | number,
  block: BlockHeader
): Promise<Erc20AssetContractDetails | null> {
  if (block.specVersion < 287) return null;

  if (storage.assetRegistry.assetLocations.v287.is(block)) {
    const resp = await storage.assetRegistry.assetLocations.v287.get(
      block,
      +assetId
    );

    return getErc20AssetContractFromLocation(resp);
  }

  throw new UnknownVersionError('storage.assetRegistry.assetLocations');
}

async function getAssetsExistentialDepositAll({
  block,
}: GetDataAtBlockInput): Promise<Array<AssetExistentialDeposit>> {
  const allAssetsData = await getAssetAll(block);

  return allAssetsData
    .filter((a) => !!a.data)
    .map((asset) => ({
      assetId: `${asset.assetId}`,
      existentialDeposit: asset.data!.existentialDeposit,
    }));
}

export default {
  getAsset,
  getAssetMany,
  getErc20AssetContractAddress,
  getAssetAll,
  getAssetsExistentialDepositAll,
};
