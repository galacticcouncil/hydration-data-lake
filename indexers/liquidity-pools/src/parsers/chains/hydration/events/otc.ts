import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import {
  DcaCompletedEventParams,
  DcaExecutionPlannedEventParams,
  DcaRandomnessGenerationFailedEventParams,
  DcaScheduledEventParams,
  DcaTerminatedEventParams,
  DcaTradeExecutedEventParams,
  DcaTradeFailedEventParams,
  OtcOrderCancelledEventParams,
  OtcOrderFilledEventParams,
  OtcOrderPartiallyFilledEventParams,
  OtcOrderPlacedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseOrderPlacedParams(event: Event): OtcOrderPlacedEventParams {
  if (events.otc.placed.v138.is(event)) {
    return events.otc.placed.v138.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseOrderCancelledParams(event: Event): OtcOrderCancelledEventParams {
  if (events.otc.cancelled.v138.is(event)) {
    return events.otc.cancelled.v138.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseOrderFilledParams(event: Event): OtcOrderFilledEventParams {
  if (events.otc.filled.v138.is(event)) {
    const { orderId, amountIn, amountOut, who } =
      events.otc.filled.v138.decode(event);

    return {
      orderId,
      amountIn,
      amountOut,
      who,
      fee: BigInt(0),
    };
  }
  if (events.otc.filled.v253.is(event)) {
    const { orderId, amountIn, amountOut, who, fee } =
      events.otc.filled.v253.decode(event);

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
  if (events.otc.partiallyFilled.v138.is(event)) {
    const { orderId, amountIn, amountOut, who } =
      events.otc.partiallyFilled.v138.decode(event);

    return {
      orderId,
      amountIn,
      amountOut,
      who,
      fee: BigInt(0),
    };
  }
  if (events.otc.filled.v253.is(event)) {
    const { orderId, amountIn, amountOut, who, fee } =
      events.otc.filled.v253.decode(event);

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
