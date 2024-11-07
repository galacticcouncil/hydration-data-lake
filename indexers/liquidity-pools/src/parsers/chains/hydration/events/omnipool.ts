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
  if (events.omnipool.tokenAdded.v115.is(event)) {
    return events.omnipool.tokenAdded.v115.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseTokenRemovedParams(
  event: Event
): OmnipoolTokenRemovedEventParams {
  if (events.omnipool.tokenRemoved.v185.is(event)) {
    return events.omnipool.tokenRemoved.v185.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(event: Event): OmnipoolBuyExecutedEventParams {
  if (events.omnipool.buyExecuted.v115.is(event)) {
    const { who, assetIn, assetOut, amountIn, amountOut } =
      events.omnipool.buyExecuted.v115.decode(event);

    return {
      who,
      assetIn,
      assetOut,
      amountIn,
      amountOut,
      hubAmountIn: BigInt(0),
      hubAmountOut: BigInt(0),
      assetFeeAmount: BigInt(0),
      protocolFeeAmount: BigInt(0),
    };
  }
  if (events.omnipool.buyExecuted.v170.is(event)) {
    const {
      who,
      assetIn,
      assetOut,
      amountIn,
      amountOut,
      assetFeeAmount,
      protocolFeeAmount,
    } = events.omnipool.buyExecuted.v170.decode(event);

    return {
      who,
      assetIn,
      assetOut,
      amountIn,
      amountOut,
      assetFeeAmount,
      protocolFeeAmount,
      hubAmountIn: BigInt(0),
      hubAmountOut: BigInt(0),
    };
  }

  if (events.omnipool.buyExecuted.v201.is(event)) {
    return events.omnipool.buyExecuted.v201.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(
  event: Event
): OmnipoolSellExecutedEventParams {
  if (events.omnipool.sellExecuted.v115.is(event)) {
    const { who, assetIn, assetOut, amountIn, amountOut } =
      events.omnipool.sellExecuted.v115.decode(event);

    return {
      who,
      assetIn,
      assetOut,
      amountIn,
      amountOut,
      hubAmountIn: BigInt(0),
      hubAmountOut: BigInt(0),
      assetFeeAmount: BigInt(0),
      protocolFeeAmount: BigInt(0),
    };
  }

  if (events.omnipool.sellExecuted.v170.is(event)) {
    const {
      who,
      assetIn,
      assetOut,
      amountIn,
      amountOut,
      assetFeeAmount,
      protocolFeeAmount,
    } = events.omnipool.sellExecuted.v170.decode(event);

    return {
      who,
      assetIn,
      assetOut,
      amountIn,
      amountOut,
      assetFeeAmount,
      protocolFeeAmount,
      hubAmountIn: BigInt(0),
      hubAmountOut: BigInt(0),
    };
  }

  if (events.omnipool.sellExecuted.v201.is(event)) {
    return events.omnipool.sellExecuted.v201.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseTokenAddedParams,
  parseTokenRemovedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
};
