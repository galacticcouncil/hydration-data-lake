import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { CurrenciesTransferredEventParams } from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTransferredParams(
  event: SqdEvent
): CurrenciesTransferredEventParams {
  if (events.currencies.transferred.v287.is(event)) {
    const { currencyId, to, from, amount } =
      events.currencies.transferred.v287.decode(event);
    return {
      currencyId,
      to,
      from,
      amount,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parseTransferredParams };
