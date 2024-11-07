import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import { BalancesTransferEventParams } from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTransferParams(event: Event): BalancesTransferEventParams {
  if (events.balances.transfer.v257.is(event)) {
    const { to, from, amount } = events.balances.transfer.v257.decode(event);
    return {
      to,
      from,
      amount,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parseTransferParams };
