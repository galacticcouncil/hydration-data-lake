import { storage, constants } from '../typegenTypes/';
import {
  AssetDynamicFeeData,
  DynamicFeesConstants,
  GetAssetsDynamicFeesAllInput,
  GetConstantsInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

function getConstants({
  block,
}: GetConstantsInput): DynamicFeesConstants | null {
  let assetFeeParameters = null;
  let protocolFeeParameters = null;

  if (constants.dynamicFees.assetFeeParameters.v170.is(block)) {
    const resp = constants.dynamicFees.assetFeeParameters.v170.get(block);
    if (resp) assetFeeParameters = resp;
  }
  if (constants.dynamicFees.protocolFeeParameters.v170.is(block)) {
    const resp = constants.dynamicFees.protocolFeeParameters.v170.get(block);
    if (resp) protocolFeeParameters = resp;
  }

  return {
    assetFeeParameters,
    protocolFeeParameters,
  };
}

async function getAssetFeesAll({
  block,
}: GetAssetsDynamicFeesAllInput): Promise<Array<AssetDynamicFeeData>> {
  return measureStorageFetch({
    storageName: 'dynamicFees.assetFee.getPairsPaged',
    originFn: 'getAssetFeesAll',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 170) return [];

      if (
        storage.dynamicFees.assetFee.v170.is(block) ||
        block.specVersion >= 170
      ) {
        return tryExecOrReturnFallback(async () => {
          const pairsPaged = [];

          try {
            for await (const page of storage.dynamicFees.assetFee.v170.getPairsPaged(
              500,
              block
            ))
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
          } catch (e) {
            throw e;
          }

          return pairsPaged;
        }, []);
      }

      throw new UnknownVersionError('storage.dynamicFees.assetFee');
    },
  });
}

export default {
  getConstants,
  getAssetFeesAll,
};
