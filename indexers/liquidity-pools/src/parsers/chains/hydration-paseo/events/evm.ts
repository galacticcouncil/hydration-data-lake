import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { EvmLogEventParams } from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';
import { EvmLogDecoder } from '../../../../utils/evmTools/evmLogDecoder';
import { EvmEventName } from '../../../../model';

function parseLogParams(event: SqdEvent): EvmLogEventParams | null {
  if (events.evm.log.v347.is(event)) {
    const { log } = events.evm.log.v347.decode(event);

    const decodedLog = EvmLogDecoder.getInstance().tryDecodeLog(log);

    if (!decodedLog) return null;

    const { parsedLog, contractName } = decodedLog;

    return {
      eventName: parsedLog.name as EvmEventName,
      address: log.address,
      signature: parsedLog.signature,
      contractName,
      args: parsedLog.args,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseLogParams,
};
