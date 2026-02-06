import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  OmnipoolBuyExecutedEventParams,
  OmnipoolLiquidityAddedEventParams,
  OmnipoolLiquidityRemovedEventParams,
  OmnipoolPositionCreatedEventParams,
  OmnipoolPositionDestroyedEventParams,
  OmnipoolPositionUpdatedEventParams,
  OmnipoolSellExecutedEventParams,
  OmnipoolTokenAddedEventParams,
  OmnipoolTokenRemovedEventParams,
} from '../../../types/events';
import { UnknownVersionError } from '../../../../utils/errors';

function parseTokenAddedParams(event: SqdEvent): OmnipoolTokenAddedEventParams {
  if (events.omnipool.tokenAdded.v115.is(event)) {
    return events.omnipool.tokenAdded.v115.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseTokenRemovedParams(
  event: SqdEvent
): OmnipoolTokenRemovedEventParams {
  if (events.omnipool.tokenRemoved.v185.is(event)) {
    return events.omnipool.tokenRemoved.v185.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseBuyExecutedParams(
  event: SqdEvent
): OmnipoolBuyExecutedEventParams {
  if (events.omnipool.buyExecuted.v201.is(event)) {
    return events.omnipool.buyExecuted.v201.decode(event);
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

  throw new UnknownVersionError(event.name);
}

function parseSellExecutedParams(
  event: SqdEvent
): OmnipoolSellExecutedEventParams {
  if (events.omnipool.sellExecuted.v201.is(event)) {
    const resp = events.omnipool.sellExecuted.v201.decode(event);
    return resp;
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

  throw new UnknownVersionError(event.name);
}

function parseLiquidityAddedParams(
  event: SqdEvent
): OmnipoolLiquidityAddedEventParams {
  if (events.omnipool.liquidityAdded.v115.is(event)) {
    return events.omnipool.liquidityAdded.v115.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parseLiquidityRemovedParams(
  event: SqdEvent
): OmnipoolLiquidityRemovedEventParams {
  if (events.omnipool.liquidityRemoved.v115.is(event)) {
    return events.omnipool.liquidityRemoved.v115.decode(event);
  }
  if (events.omnipool.liquidityRemoved.v148.is(event)) {
    return events.omnipool.liquidityRemoved.v148.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionCreatedParams(
  event: SqdEvent
): OmnipoolPositionCreatedEventParams {
  if (events.omnipool.positionCreated.v115.is(event)) {
    return events.omnipool.positionCreated.v115.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionDestroyedParams(
  event: SqdEvent
): OmnipoolPositionDestroyedEventParams {
  if (events.omnipool.positionDestroyed.v115.is(event)) {
    return events.omnipool.positionDestroyed.v115.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

function parsePositionUpdatedParams(
  event: SqdEvent
): OmnipoolPositionUpdatedEventParams {
  if (events.omnipool.positionUpdated.v115.is(event)) {
    return events.omnipool.positionUpdated.v115.decode(event);
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseTokenAddedParams,
  parseTokenRemovedParams,
  parseBuyExecutedParams,
  parseSellExecutedParams,
  parseLiquidityAddedParams,
  parseLiquidityRemovedParams,
  parsePositionCreatedParams,
  parsePositionDestroyedParams,
  parsePositionUpdatedParams,
};
