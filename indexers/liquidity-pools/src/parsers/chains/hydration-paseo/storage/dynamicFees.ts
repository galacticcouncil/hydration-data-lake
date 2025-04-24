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

export default {
  getConstants,
};
