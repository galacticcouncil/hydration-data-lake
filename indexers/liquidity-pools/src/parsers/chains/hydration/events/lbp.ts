import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import {
  LbpBuyExecutedEventParams,
  LbpPoolCreatedEventParams,
  LbpPoolUpdatedEventParams,
  LbpSellExecutedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parsePoolCreatedParams(event: Event): LbpPoolCreatedEventParams {
  if (events.lbp.poolCreated.v176.is(event)) {
    return events.lbp.poolCreated.v176.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePoolUpdatedParams(event: Event): LbpPoolUpdatedEventParams {
  if (events.lbp.poolUpdated.v176.is(event)) {
    return events.lbp.poolUpdated.v176.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: Event): LbpBuyExecutedEventParams {
  if (events.lbp.buyExecuted.v176.is(event)) {
    return events.lbp.buyExecuted.v176.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(event: Event): LbpSellExecutedEventParams {
  if (events.lbp.sellExecuted.v176.is(event)) {
    return events.lbp.sellExecuted.v176.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parsePoolCreatedParams,
  parsePoolUpdatedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
};
