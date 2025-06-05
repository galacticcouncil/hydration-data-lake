import { SqdCall } from '../../../../processor';
import { XykCreatePoolCallArgs } from '../../../types/calls';
import { calls } from '../typegenTypes';
import { UnknownVersionError } from '../../../../utils/errors';

function parseCreatePoolArgs(call: SqdCall): XykCreatePoolCallArgs {
  if (calls.xyk.createPool.v287.is(call)) {
    return calls.xyk.createPool.v287.decode(call);
  }

  throw new UnknownVersionError(call.name);
}

export default { parseCreatePoolArgs };
