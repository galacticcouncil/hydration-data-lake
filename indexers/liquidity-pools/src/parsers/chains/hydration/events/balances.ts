import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  BalancesTransferEventParams,
  BalancesDepositEventParams,
  BalancesWithdrawEventParams,
  BalancesReservedEventParams,
  BalancesUnreservedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTransferParams(event: SqdEvent): BalancesTransferEventParams {
  if (events.balances.transfer.v100.is(event)) {
    const [from, to, amount] = events.balances.transfer.v100.decode(event);
    return {
      to,
      from,
      amount,
    };
  }

  if (events.balances.transfer.v104.is(event)) {
    const { to, from, amount } = events.balances.transfer.v104.decode(event);
    return {
      to,
      from,
      amount,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseDepositParams(event: SqdEvent): BalancesDepositEventParams {
  if (events.balances.deposit.v100.is(event)) {
    const [who, amount] = events.balances.deposit.v100.decode(event);
    return { who, amount };
  }

  if (events.balances.deposit.v104.is(event)) {
    const { who, amount } = events.balances.deposit.v104.decode(event);
    return { who, amount };
  }

  throw new UnknownVersionError(event.name);
}

function parseWithdrawParams(event: SqdEvent): BalancesWithdrawEventParams {
  if (events.balances.withdraw.v100.is(event)) {
    const [who, amount] = events.balances.withdraw.v100.decode(event);
    return { who, amount };
  }

  if (events.balances.withdraw.v104.is(event)) {
    const { who, amount } = events.balances.withdraw.v104.decode(event);
    return { who, amount };
  }

  throw new UnknownVersionError(event.name);
}

function parseReservedParams(event: SqdEvent): BalancesReservedEventParams {
  if (events.balances.reserved.v100.is(event)) {
    const [who, amount] = events.balances.reserved.v100.decode(event);
    return { who, amount };
  }

  if (events.balances.reserved.v104.is(event)) {
    const { who, amount } = events.balances.reserved.v104.decode(event);
    return { who, amount };
  }

  throw new UnknownVersionError(event.name);
}

function parseUnreservedParams(event: SqdEvent): BalancesUnreservedEventParams {
  if (events.balances.unreserved.v100.is(event)) {
    const [who, amount] = events.balances.unreserved.v100.decode(event);
    return { who, amount };
  }

  if (events.balances.unreserved.v104.is(event)) {
    const { who, amount } = events.balances.unreserved.v104.decode(event);
    return { who, amount };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseTransferParams,
  parseDepositParams,
  parseWithdrawParams,
  parseReservedParams,
  parseUnreservedParams,
};
