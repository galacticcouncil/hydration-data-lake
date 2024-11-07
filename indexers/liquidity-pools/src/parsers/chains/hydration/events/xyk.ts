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
  if (events.xyk.poolCreated.v183.is(event)) {
    return events.xyk.poolCreated.v183.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePoolDestroyedParams(event: Event): XykPoolDestroyedEventParams {
  if (events.xyk.poolDestroyed.v183.is(event)) {
    return events.xyk.poolDestroyed.v183.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: Event): XykBuyExecutedEventParams {
  if (events.xyk.buyExecuted.v183.is(event)) {
    return events.xyk.buyExecuted.v183.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(event: Event): XykSellExecutedEventParams {
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
