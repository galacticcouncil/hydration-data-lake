import BigNumber from 'bignumber.js';

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_UP,
});

function toFixedTrimmed(value: BigNumber.Value, dp = 18): string {
  return new BigNumber(value).decimalPlaces(dp).toFixed();
}

export { BigNumber, toFixedTrimmed };
