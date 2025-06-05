import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  OtcOrderCancelledEventParams,
  OtcOrderFilledEventParams,
  OtcOrderPartiallyFilledEventParams,
  OtcOrderPlacedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseOrderPlacedParams(event: SqdEvent): OtcOrderPlacedEventParams {
  if (events.otc.placed.v287.is(event)) {
    return events.otc.placed.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseOrderCancelledParams(
  event: SqdEvent
): OtcOrderCancelledEventParams {
  if (events.otc.cancelled.v287.is(event)) {
    return events.otc.cancelled.v287.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseOrderFilledParams(event: SqdEvent): OtcOrderFilledEventParams {
  if (events.otc.filled.v287.is(event)) {
    const { orderId, amountIn, amountOut, who, fee } =
      events.otc.filled.v287.decode(event);

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
  event: SqdEvent
): OtcOrderPartiallyFilledEventParams {
  if (events.otc.filled.v287.is(event)) {
    const { orderId, amountIn, amountOut, who, fee } =
      events.otc.filled.v287.decode(event);

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
