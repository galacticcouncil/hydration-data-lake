import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import {
  OtcOrderCancelledEventParams,
  OtcOrderFilledEventParams,
  OtcOrderPartiallyFilledEventParams,
  OtcOrderPlacedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseOrderPlacedParams(event: Event): OtcOrderPlacedEventParams {
  if (events.otc.placed.v276.is(event)) {
    return events.otc.placed.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseOrderCancelledParams(event: Event): OtcOrderCancelledEventParams {
  if (events.otc.cancelled.v276.is(event)) {
    return events.otc.cancelled.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseOrderFilledParams(event: Event): OtcOrderFilledEventParams {
  if (events.otc.filled.v276.is(event)) {
    const { orderId, amountIn, amountOut, who, fee } =
      events.otc.filled.v276.decode(event);

    return {
      orderId,
      amountIn,
      amountOut,
      who,
      fee,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseOrderPartiallyFilledParams(
  event: Event
): OtcOrderPartiallyFilledEventParams {
  if (events.otc.filled.v276.is(event)) {
    const { orderId, amountIn, amountOut, who, fee } =
      events.otc.filled.v276.decode(event);

    return {
      orderId,
      amountIn,
      amountOut,
      who,
      fee,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseOrderPlacedParams,
  parseOrderCancelledParams,
  parseOrderFilledParams,
  parseOrderPartiallyFilledParams,
};
