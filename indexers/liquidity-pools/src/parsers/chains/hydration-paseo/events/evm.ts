import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { EvmLogEventParams } from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';
import { EvmLogDecoder } from '../../../../utils/evmTools/evmLogDecoder';
import { EvmEventName } from '../../../../model';

function parseLogParams(event: SqdEvent): EvmLogEventParams | null {
  if (events.evm.log.v287.is(event)) {
    const { log } = events.evm.log.v287.decode(event);

    const decodedLog = EvmLogDecoder.getInstance().tryDecodeLog(log);

    if (!decodedLog) return null;

    return {
      eventName: decodedLog.name as EvmEventName,
      address: log.address,
      signature: decodedLog.signature,
      args: decodedLog.args,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseLogParams,
};
