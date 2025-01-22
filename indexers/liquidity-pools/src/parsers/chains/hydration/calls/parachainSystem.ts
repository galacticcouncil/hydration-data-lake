import { Call } from '../../../../processor';
import { RelaySystemSetValidationDataCallArgs } from '../../../types/calls';
import { calls } from '../typegenTypes';
import { UnknownVersionError } from '../../../../utils/errors';

function parseSetValidationDataArgs(
  call: Call
): RelaySystemSetValidationDataCallArgs {
  if (calls.parachainSystem.setValidationData.v100.is(call)) {
    const decodedData =
      calls.parachainSystem.setValidationData.v100.decode(call);

    return {
      relayParentNumber: decodedData.data.validationData.relayParentNumber,
    };
  }

  throw new UnknownVersionError(call.name);
}

export default { parseSetValidationDataArgs };
