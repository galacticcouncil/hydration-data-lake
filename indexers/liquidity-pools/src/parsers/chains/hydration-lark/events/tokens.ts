import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  TokensTransferEventParams,
  TokensDepositedEventParams,
  TokensWithdrawnEventParams,
  TokensReservedEventParams,
  TokensUnreservedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTransferParams(event: SqdEvent): TokensTransferEventParams {
  if (events.tokens.transfer.v405.is(event)) {
    const { currencyId, to, from, amount } =
      events.tokens.transfer.v405.decode(event);
    return {
      currencyId,
      to,
      from,
      amount,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseDepositedParams(event: SqdEvent): TokensDepositedEventParams {
  if (events.tokens.deposited.v405.is(event)) {
    const { currencyId, who, amount } =
      events.tokens.deposited.v405.decode(event);
    return { currencyId, who, amount };
  }

  throw new UnknownVersionError(event.name);
}

function parseWithdrawnParams(event: SqdEvent): TokensWithdrawnEventParams {
  if (events.tokens.withdrawn.v405.is(event)) {
    const { currencyId, who, amount } =
      events.tokens.withdrawn.v405.decode(event);
    return { currencyId, who, amount };
  }

  throw new UnknownVersionError(event.name);
}

function parseReservedParams(event: SqdEvent): TokensReservedEventParams {
  if (events.tokens.reserved.v405.is(event)) {
    const { currencyId, who, amount } =
      events.tokens.reserved.v405.decode(event);
    return { currencyId, who, amount };
  }

  throw new UnknownVersionError(event.name);
}

function parseUnreservedParams(event: SqdEvent): TokensUnreservedEventParams {
  if (events.tokens.unreserved.v405.is(event)) {
    const { currencyId, who, amount } =
      events.tokens.unreserved.v405.decode(event);
    return { currencyId, who, amount };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseTransferParams,
  parseDepositedParams,
  parseWithdrawnParams,
  parseReservedParams,
  parseUnreservedParams,
};
