import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  UniquesAssetDataWithId,
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
      if (block.specVersion < 287) return null;

      if (storage.uniques.asset.v287.is(block)) {
        try {
          const resp = await storage.uniques.asset.v287.getMany(
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

export default {
  getAssetsData,
};
