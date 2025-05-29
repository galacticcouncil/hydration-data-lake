import { storage } from '../../typegenTypes/';
import {
  AssetDynamicFeeData,
  DynamicFeesConstants,
  GetAssetsDynamicFeesAllInput,
} from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';

async function getAssetFeesAll({
  block,
}: GetAssetsDynamicFeesAllInput): Promise<Array<AssetDynamicFeeData>> {
  if (block.specVersion < 170) return [];

  if (storage.dynamicFees.assetFee.v170.is(block) || block.specVersion >= 170) {
    const pairsPaged = [];

    try {
      for await (const page of storage.dynamicFees.assetFee.v170.getPairsPaged(
        500,
        block
      )) {
        pairsPaged.push(
          ...page
            .filter((p) => !!p && !!p[1])
            .map(([assetId, fees]): AssetDynamicFeeData | null => {
              if (!fees) return null;

              return {
                assetId,
                assetFee: fees.assetFee,
                protocolFee: fees.protocolFee,
                timestamp: fees.timestamp,
              };
            })
            .filter((resp) => !!resp)
        );
      }
    } catch (e) {
      console.log('storage.dynamicFees.assetFee.v170 has failed');
      console.log(e);
    }
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.dynamicFees.assetFee');
}

export default {
  getAssetFeesAll,
};
