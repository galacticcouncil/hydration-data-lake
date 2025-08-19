import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  EvmAccountsBoundEventParams,
  EvmLogEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseBoundParams(event: SqdEvent): EvmAccountsBoundEventParams | null {
  if (events.evmAccounts.bound.v324.is(event)) {
    const { address, account } = events.evmAccounts.bound.v324.decode(event);

    return {
      accountAddress: account,
      evmAddress: address,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseBoundParams,
};
