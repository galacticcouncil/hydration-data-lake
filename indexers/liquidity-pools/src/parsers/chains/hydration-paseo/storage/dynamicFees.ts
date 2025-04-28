import { storage, constants } from '../typegenTypes/';
import {
  AssetDynamicFeeData,
  DynamicFeesConstants,
  GetAssetsDynamicFeesAllInput,
  GetConstantsInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

function getConstants({
  block,
}: GetConstantsInput): DynamicFeesConstants | null {
  let assetFeeParameters = null;
  let protocolFeeParameters = null;

  if (constants.dynamicFees.assetFeeParameters.v276.is(block)) {
    const resp = constants.dynamicFees.assetFeeParameters.v276.get(block);
    if (resp) assetFeeParameters = resp;
  }
  if (constants.dynamicFees.protocolFeeParameters.v276.is(block)) {
    const resp = constants.dynamicFees.protocolFeeParameters.v276.get(block);
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
  if (block.specVersion < 170) return [];

  if (storage.dynamicFees.assetFee.v276.is(block)) {
    const pairsPaged = [];

    for await (const page of storage.dynamicFees.assetFee.v276.getPairsPaged(
      100,
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
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.dynamicFees.assetFee');
}

export default {
  getConstants,
  getAssetFeesAll,
};
