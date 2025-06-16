import lodashCamelCase from 'lodash.camelcase';
import { AppConfig } from '../appConfig';
import { NodeEnv } from './types';
import { join } from 'path';
import { hexToString, hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { HYDRADX_SS58_PREFIX } from '@galacticcouncil/sdk';
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
