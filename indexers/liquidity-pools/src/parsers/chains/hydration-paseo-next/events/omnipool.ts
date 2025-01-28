import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  OmnipoolBuyExecutedEventParams,
  OmnipoolSellExecutedEventParams,
  OmnipoolTokenAddedEventParams,
  OmnipoolTokenRemovedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTokenAddedParams(event: SqdEvent): OmnipoolTokenAddedEventParams {
  if (events.omnipool.tokenAdded.v276.is(event)) {
    return events.omnipool.tokenAdded.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseTokenRemovedParams(
  event: SqdEvent
): OmnipoolTokenRemovedEventParams {
  if (events.omnipool.tokenRemoved.v276.is(event)) {
    return events.omnipool.tokenRemoved.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: SqdEvent): OmnipoolBuyExecutedEventParams {
  if (events.omnipool.buyExecuted.v276.is(event)) {
    return events.omnipool.buyExecuted.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(
  event: SqdEvent
): OmnipoolSellExecutedEventParams {
  if (events.omnipool.sellExecuted.v276.is(event)) {
    return events.omnipool.sellExecuted.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseTokenAddedParams,
  parseTokenRemovedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
};
