import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  UniquesAssetDataWithId,
  UniquesGetAllAssetsDataInput,
  UniquesGetAssetsDataInput,
} from '../../../types/storage/uniques';
import { constants, storage } from '../typegenTypes/';

async function getAssetsData({
  collectionId,
  assetIds,
  block,
}: UniquesGetAssetsDataInput): Promise<UniquesAssetDataWithId[] | null> {
  return measureStorageFetch({
    storageName: 'uniques.asset',
    originFn: 'getAssetsData',
    blockHeight: block.height,
    args: { collectionId, assetIds },
    fn: async () => {
      if (block.specVersion < 347) return null;

      if (storage.uniques.asset.v347.is(block)) {
        try {
          const resp = await storage.uniques.asset.v347.getMany(
            block,
            assetIds.map((assetId) => [BigInt(collectionId), BigInt(assetId)])
          );

          const decoratedResp: UniquesAssetDataWithId[] = [];

          assetIds.forEach((assetId, index) => {
            if (!resp[index]) {
              decoratedResp.push({ collectionId, assetId, data: null });
            } else {
              decoratedResp.push({
                collectionId,
                assetId,
                data: {
                  owner: resp[index].owner,
                  approved: resp[index].approved ?? null,
                  isFrozen: resp[index].isFrozen,
                  deposit: resp[index].deposit,
                },
              });
            }
          });
          return decoratedResp;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.uniques.asset');
    },
  });
}

async function getAllAssetsData({
  collectionId,
  block,
}: UniquesGetAllAssetsDataInput): Promise<UniquesAssetDataWithId[] | null> {
  return measureStorageFetch({
    storageName: 'uniques.asset',
    originFn: 'getAllUniques',
    blockHeight: block.height,
    args: { collectionId },
    fn: async () => {
      if (block.specVersion < 347) return null;

      if (storage.uniques.asset.v347.is(block)) {
        try {
          const pairsPaged = [];

          for await (const page of storage.uniques.asset.v347.getPairsPaged(
            500,
            block
          ))
            pairsPaged.push(
              ...page
                .filter((p) => !!p && !!p[1])
                .map(([[collId, assetId], assetData]) => ({
                  assetId: assetId.toString(),
                  collectionId: collId.toString(),
                  data: {
                    owner: assetData!.owner,
                    approved: assetData!.approved ?? null,
                    isFrozen: assetData!.isFrozen,
                    deposit: assetData!.deposit,
                  },
                }))
            );
          return pairsPaged;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.uniques.asset');
    },
  });
}

export default {
  getAssetsData,
  getAllAssetsData,
};
