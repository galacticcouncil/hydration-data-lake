import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { TokensTransferEventParams } from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTransferParams(event: SqdEvent): TokensTransferEventParams {
  if (events.tokens.transfer.v108.is(event)) {
    const { currencyId, to, from, amount } =
      events.tokens.transfer.v108.decode(event);
    return {
      currencyId,
      to,
      from,
      amount,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parseTransferParams };
