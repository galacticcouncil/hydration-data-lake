import { Schedule } from './typegenTypes/v278';
import {
  DcaScheduleCallData,
  DcaScheduleOrderData,
  DcaScheduleOrderRouteData,
} from '../../types/calls';
import { DcaScheduleOrderType, SwapFillerType } from '../../../model';

export function decorateDcaSchedule(scheduleRaw: Schedule) {
  const {
    owner,
    period,
    slippage,
    stabilityThreshold,
    totalAmount,
    maxRetries,
    order,
  } = scheduleRaw;

  let amountOut = null;
  let amountIn = null;
  let maxAmountIn = null;
  let minAmountOut = null;

  if (order.__kind === 'Sell') {
    amountIn = order.amountIn;
    minAmountOut = order.minAmountOut;
  } else {
    amountOut = order.amountOut;
    maxAmountIn = order.maxAmountIn;
  }

  const routes: DcaScheduleOrderRouteData[] = order.route.map((routeData) => ({
    poolKind: routeData.pool.__kind as SwapFillerType,
    assetInId: routeData.assetIn,
    assetOutId: routeData.assetOut,
  }));

  const orderData: DcaScheduleOrderData = {
    kind: order.__kind as DcaScheduleOrderType,
    assetInId: order.assetIn,
    assetOutId: order.assetOut,
    amountOut,
    amountIn,
    maxAmountIn,
    minAmountOut,
    routes,
  };

  const scheduleDecoratedData: DcaScheduleCallData = {
    owner,
    period,
    maxRetries,
    totalAmount,
    slippage,
    stabilityThreshold,
    order: orderData,
  };

  return scheduleDecoratedData;
}
