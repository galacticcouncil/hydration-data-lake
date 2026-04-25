import { Schedule } from './typegenTypes/v347';
import {
  DcaScheduleCallData,
  DcaScheduleOrderData,
  DcaScheduleOrderRouteData,
} from '../../types/calls';
import { DcaScheduleOrderType, SwapFillerType } from '../../../model';
import { Erc20AssetContractDetails } from '../../types/storage';
import { AssetRegistryAssetLocation } from '../../types/events';
import { hexToString } from '@polkadot/util';

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

export function getErc20AssetContractFromLocation(
  location?: AssetRegistryAssetLocation
): Erc20AssetContractDetails | null {
  if (!location) return null;

  try {
    switch (location.interior.__kind) {
      case 'X1': {
        if (location.interior.value && Array.isArray(location.interior.value)) {
          return {
            address: location.interior.value[0].key,
          };
        }
        return {
          address: location.interior.value.key,
        };
      }

      case 'X2':
        return {
          address: location.interior.value[1].key,
        };
      case 'X3':
        return {
          address: location.interior.value[2].key,
        };
      case 'X4':
        return {
          address: location.interior.value[3].key,
        };
      case 'X5':
        return {
          address: location.interior.value[4].key,
        };
      case 'X6':
        return {
          address: location.interior.value[5].key,
        };
      default:
        return null;
    }
  } catch (e) {
    return null;
  }
}

export function getOracleNameFromStableswapPegsSource(data: any) {
  if (data.__kind === 'Oracle') return hexToString(data.value[0]);
  if (data.__kind === 'MMOracle') return data.value;
  return undefined;
}
