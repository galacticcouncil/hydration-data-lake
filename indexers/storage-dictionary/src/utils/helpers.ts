import lodashCamelCase from 'lodash.camelcase';
import { AppConfig } from '../appConfig';
import { NodeEnv } from './types';
import { join } from 'path';
import { hexToString, hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { HYDRADX_SS58_PREFIX, BigNumber } from '@galacticcouncil/sdk';
import { deepEqual } from 'fast-equals';

const appConfig = AppConfig.getInstance();

export function isNotNullOrUndefined<T extends Object>(
  input: null | undefined | T
): input is T {
  return input != null;
}

export function getEnvPath(subPath: string): string {
  return appConfig.NODE_ENV === NodeEnv.DEV
    ? join(process.cwd(), 'src/', subPath)
    : join(process.cwd(), 'lib/', subPath);
}

export function hexToStrWithNullCharCheck(str?: string) {
  if (!str) return str;
  const decorated = hexToString(str);
  return decorated.includes('\0') ? str : decorated;
}

export function* splitIntoBatches<T>(
  list: T[],
  maxBatchSize: number
): Generator<T[]> {
  if (list.length <= maxBatchSize) {
    yield list;
  } else {
    let offset = 0;
    while (list.length - offset > maxBatchSize) {
      yield list.slice(offset, offset + maxBatchSize);
      offset += maxBatchSize;
    }
    yield list.slice(offset);
  }
}

export function getAavePoolAddress(
  reserve: string | number,
  atoken: string | number,
  prefix?: number // HYDRADX_SS58_PREFIX
): string {
  const id = reserve + '/' + atoken;

  if (prefix) return encodeAddress(stringToU8a(id.padEnd(32, '\0')), prefix);

  return u8aToHex(decodeAddress(stringToU8a(id.padEnd(32, '\0'))));
}

export function publicKeyToSs58(
  key: string,
  prefix: number = HYDRADX_SS58_PREFIX
): string {
  return encodeAddress(hexToU8a(key), prefix);
}

export function isDeepEqual(a: any, b: any) {
  return deepEqual(a, b);
}

export function fromExponentialToDecimalNotation(
  input: BigNumber | string,
  decimals: number
): BigNumber {
  return BigNumber(input).dividedBy(BigNumber(10).pow(decimals));
}

export function fromDecimalToExponentialNotation(
  input: BigNumber | string,
  decimals: number
): BigNumber {
  try {
    if (!input && input !== '0') {
      throw new Error(
        "Invalid input: 'input' cannot be null, undefined, or empty"
      );
    }

    const numericInput = BigNumber(input);

    if (!numericInput.isFinite() || numericInput.isNaN()) {
      throw new Error(
        `Invalid input: 'input' is not a finite number. Received: ${input}`
      );
    }

    if (!Number.isInteger(decimals) || decimals < 0) {
      throw new Error(
        `Invalid decimals: 'decimals' must be a non-negative integer. Received: ${decimals}`
      );
    }

    const result = numericInput.multipliedBy(BigNumber(10).pow(decimals));

    if (!result.isFinite() || result.isNaN()) {
      throw new Error(
        `Computation resulted in an invalid BigNumber: ${result}`
      );
    }

    return result;
  } catch (error) {
    console.error(
      // @ts-ignore
      `Error in fromDecimalToExponentialNotation: ${error?.message}`
    );
    throw error;
  }
}

export function calcPriceNormalized({
  amount,
  assetDecimals,
  spotPrice,
}: {
  amount: bigint;
  spotPrice: string;
  assetDecimals: number;
}): string {
  return fromExponentialToDecimalNotation(amount.toString(), assetDecimals)
    .multipliedBy(spotPrice)
    .toFixed();
}

export async function tryExecOrReturnFallback<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  return fn().catch((e) => {
    console.error(e);
    return fallback;
  });
}

export function isValueMaxUint256(value: string) {
  const maxUint256 = BigInt('2') ** BigInt(256) - BigInt(1);
  return value >= maxUint256.toString();
}
