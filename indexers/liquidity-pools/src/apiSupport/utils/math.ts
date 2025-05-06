import BigNumber from 'bignumber.js';
import { YieldMetricsInterval } from '../types';
import { getPeriodsNumberFromInterval } from './aggregationUtils';

export type AssetYieldMetricsRaw = {
  projectedApyPerc: BigNumber;
  projectedAprPerc: BigNumber;
};

/**
 * Calculates yield metrics for asset based on the provided fee amount, total value locked (TVL),
 * and interval for yield calculation.
 *
 * Notice: returns metrics as represents but not in decimal form.
 *
 */
export function calculateAssetYieldMetrics({
  feeAmount,
  tvl,
  interval,
}: {
  feeAmount: BigNumber;
  tvl: BigNumber;
  interval: YieldMetricsInterval;
}): AssetYieldMetricsRaw {
  if (tvl.isZero())
    return {
      projectedAprPerc: new BigNumber(0),
      projectedApyPerc: new BigNumber(0),
    };

  const feeYieldPerPeriod = feeAmount.div(tvl);

  return {
    projectedAprPerc: feeYieldPerPeriod
      .multipliedBy(getPeriodsNumberFromInterval(interval))
      .multipliedBy(100),
    projectedApyPerc: new BigNumber(1)
      .plus(feeYieldPerPeriod)
      .pow(getPeriodsNumberFromInterval(interval))
      .minus(1)
      .multipliedBy(100),
  };
}

export function calculateAverageYieldMetrics(
  data: AssetYieldMetricsRaw[]
): AssetYieldMetricsRaw {
  const avrMetrics = {
    projectedAprPerc: new BigNumber(0),
    projectedApyPerc: new BigNumber(0),
  };

  data.forEach((assetData) => {
    avrMetrics.projectedAprPerc = avrMetrics.projectedAprPerc.plus(
      assetData.projectedAprPerc
    );
    avrMetrics.projectedApyPerc = avrMetrics.projectedApyPerc.plus(
      assetData.projectedApyPerc
    );
  });

  return {
    projectedAprPerc: avrMetrics.projectedAprPerc.div(data.length),
    projectedApyPerc: avrMetrics.projectedApyPerc.div(data.length),
  };
}
