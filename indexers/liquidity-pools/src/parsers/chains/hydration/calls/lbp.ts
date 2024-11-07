import { Call } from '../../../../processor';
import { LbpCreatePoolCallArgs } from '../../../types/calls';
import { calls } from '../typegenTypes';
import { UnknownVersionError } from '../../../../utils/errors';

function parseCreatePoolArgs(call: Call): LbpCreatePoolCallArgs {
  if (calls.lbp.createPool.v176.is(call)) {
    const {
      assetA,
      assetB,
      assetAAmount,
      assetBAmount,
      fee,
      feeCollector,
      initialWeight,
      finalWeight,
      repayTarget,
      poolOwner,
    } = calls.lbp.createPool.v176.decode(call);

    return {
      assetA,
      assetB,
      assetAAmount,
      assetBAmount,
      fee,
      feeCollector,
      initialWeight,
      finalWeight,
      repayTarget,
      poolOwner,
    };
  }

  throw new UnknownVersionError(call.name);
}

export default { parseCreatePoolArgs };
