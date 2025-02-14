import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { EvmLogEventParams } from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';
import { EvmLogDecoder } from '../../../../utils/evmLogDecoder';

function parseLogParams(event: SqdEvent): EvmLogEventParams | null {
  if (events.evm.log.v276.is(event)) {
    const { log } = events.evm.log.v276.decode(event);

    const decodedLog = EvmLogDecoder.getInstance().tryDecodeLog(log);

    if (!decodedLog) return null;

    return { name: decodedLog.name, args: decodedLog.args };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseLogParams,
};
