import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { BalancesTransferEventParams } from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTransferParams(event: SqdEvent): BalancesTransferEventParams {
  if (events.balances.transfer.v276.is(event)) {
    const { to, from, amount } = events.balances.transfer.v276.decode(event);
    return {
      to,
      from,
      amount,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parseTransferParams };
