import { storage, constants } from '../typegenTypes/';
import {
  DynamicFeesConstants,
  GetConstantsInput,
} from '../../../types/storage';

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

export default {
  getConstants,
};
