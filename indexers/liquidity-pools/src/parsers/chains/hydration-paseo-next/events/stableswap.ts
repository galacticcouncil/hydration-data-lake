import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import {
  StableswapBuyExecutedEventParams,
  StableswapLiquidityAddedEventParams,
  StableswapLiquidityRemovedEventParams,
  StableswapPoolCreatedEventParams,
  StableswapSellExecutedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parsePoolCreatedParams(
  event: Event
): StableswapPoolCreatedEventParams {
  if (events.stableswap.poolCreated.v276.is(event)) {
    return events.stableswap.poolCreated.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityAddedParams(
  event: Event
): StableswapLiquidityAddedEventParams {
  if (events.stableswap.liquidityAdded.v276.is(event)) {
    return events.stableswap.liquidityAdded.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityRemovedParams(
  event: Event
): StableswapLiquidityRemovedEventParams {
  if (events.stableswap.liquidityRemoved.v276.is(event)) {
    return events.stableswap.liquidityRemoved.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(
  event: Event
): StableswapBuyExecutedEventParams {
  if (events.stableswap.buyExecuted.v276.is(event)) {
    return events.stableswap.buyExecuted.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(
  event: Event
): StableswapSellExecutedEventParams {
  if (events.stableswap.sellExecuted.v276.is(event)) {
    return events.stableswap.sellExecuted.v276.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parsePoolCreatedParams,
  parseLiquidityAddedParams,
  parseLiquidityRemovedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
};
