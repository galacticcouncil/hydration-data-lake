import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import {
  OmnipoolBuyExecutedEventParams,
  OmnipoolSellExecutedEventParams,
  OmnipoolTokenAddedEventParams,
  OmnipoolTokenRemovedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTokenAddedParams(event: Event): OmnipoolTokenAddedEventParams {
  if (events.omnipool.tokenAdded.v257.is(event)) {
    return events.omnipool.tokenAdded.v257.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseTokenRemovedParams(
  event: Event
): OmnipoolTokenRemovedEventParams {
  if (events.omnipool.tokenRemoved.v257.is(event)) {
    return events.omnipool.tokenRemoved.v257.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: Event): OmnipoolBuyExecutedEventParams {
  if (events.omnipool.buyExecuted.v257.is(event)) {
    return events.omnipool.buyExecuted.v257.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(
  event: Event
): OmnipoolSellExecutedEventParams {
  if (events.omnipool.sellExecuted.v257.is(event)) {
    return events.omnipool.sellExecuted.v257.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseTokenAddedParams,
  parseTokenRemovedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
};
