import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { EvmLogEventParams } from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';
import { EvmLogDecoder } from '../../../../utils/evmLogDecoder';

function parseLogParams(event: SqdEvent): EvmLogEventParams | null {
  if (events.evm.log.v193.is(event)) {
    const { log } = events.evm.log.v193.decode(event);

    const decodedLog = EvmLogDecoder.getInstance().tryDecodeLog(log);

    console.log('decodedLog');
    console.dir(decodedLog, { depth: null });

    if (!decodedLog) return null;

    return { name: decodedLog.name, args: decodedLog.args };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseLogParams,
};
