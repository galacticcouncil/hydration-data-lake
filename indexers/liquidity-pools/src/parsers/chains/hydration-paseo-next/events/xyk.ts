import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import {
  XykBuyExecutedEventParams,
  XykPoolCreatedEventParams,
  XykPoolDestroyedEventParams,
  XykSellExecutedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parsePoolCreatedParams(event: Event): XykPoolCreatedEventParams {
  if (events.xyk.poolCreated.v276.is(event)) {
    return events.xyk.poolCreated.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePoolDestroyedParams(event: Event): XykPoolDestroyedEventParams {
  if (events.xyk.poolDestroyed.v276.is(event)) {
    return events.xyk.poolDestroyed.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: Event): XykBuyExecutedEventParams {
  if (events.xyk.buyExecuted.v276.is(event)) {
    return events.xyk.buyExecuted.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(event: Event): XykSellExecutedEventParams {
  if (events.xyk.sellExecuted.v276.is(event)) {
    return events.xyk.sellExecuted.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parsePoolCreatedParams,
  parsePoolDestroyedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
};
