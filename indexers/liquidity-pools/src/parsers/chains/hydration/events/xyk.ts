import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  XykBuyExecutedEventParams,
  XykPoolCreatedEventParams,
  XykPoolDestroyedEventParams,
  XykSellExecutedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parsePoolCreatedParams(event: SqdEvent): XykPoolCreatedEventParams {
  if (events.xyk.poolCreated.v183.is(event)) {
    return events.xyk.poolCreated.v183.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePoolDestroyedParams(
  event: SqdEvent
): XykPoolDestroyedEventParams {
  if (events.xyk.poolDestroyed.v183.is(event)) {
    return events.xyk.poolDestroyed.v183.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: SqdEvent): XykBuyExecutedEventParams {
  if (events.xyk.buyExecuted.v183.is(event)) {
    return events.xyk.buyExecuted.v183.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(event: SqdEvent): XykSellExecutedEventParams {
  if (events.xyk.sellExecuted.v183.is(event)) {
    return events.xyk.sellExecuted.v183.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parsePoolCreatedParams,
  parsePoolDestroyedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
};
