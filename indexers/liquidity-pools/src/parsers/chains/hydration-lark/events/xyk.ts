import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  XykBuyExecutedEventParams,
  XykLiquidityAddedEventParams,
  XykLiquidityRemovedEventParams,
  XykPoolCreatedEventParams,
  XykPoolDestroyedEventParams,
  XykSellExecutedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parsePoolCreatedParams(event: SqdEvent): XykPoolCreatedEventParams {
  if (events.xyk.poolCreated.v405.is(event)) {
    return events.xyk.poolCreated.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePoolDestroyedParams(
  event: SqdEvent
): XykPoolDestroyedEventParams {
  if (events.xyk.poolDestroyed.v405.is(event)) {
    return events.xyk.poolDestroyed.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: SqdEvent): XykBuyExecutedEventParams {
  if (events.xyk.buyExecuted.v405.is(event)) {
    return events.xyk.buyExecuted.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(event: SqdEvent): XykSellExecutedEventParams {
  if (events.xyk.sellExecuted.v405.is(event)) {
    return events.xyk.sellExecuted.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityAddedParams(
  event: SqdEvent
): XykLiquidityAddedEventParams {
  if (events.xyk.liquidityAdded.v405.is(event)) {
    return events.xyk.liquidityAdded.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityRemovedParams(
  event: SqdEvent
): XykLiquidityRemovedEventParams {
  if (events.xyk.liquidityRemoved.v405.is(event)) {
    return events.xyk.liquidityRemoved.v405.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parsePoolCreatedParams,
  parsePoolDestroyedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
  parseLiquidityAddedParams,
  parseLiquidityRemovedParams,
};
