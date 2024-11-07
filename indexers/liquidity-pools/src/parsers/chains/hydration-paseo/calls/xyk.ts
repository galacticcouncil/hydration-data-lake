import { Call } from '../../../../processor';
import { XykCreatePoolCallArgs } from '../../../types/calls';
import { calls } from '../typegenTypes';
import { UnknownVersionError } from '../../../../utils/errors';

function parseCreatePoolArgs(call: Call): XykCreatePoolCallArgs {
  if (calls.xyk.createPool.v257.is(call)) {
    return calls.xyk.createPool.v257.decode(call);
  }

  throw new UnknownVersionError(call.name);
}

export default { parseCreatePoolArgs };
